import { create } from "zustand";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

const ICE_SERVERS = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

let listenersAttached = false;
let peerConnection = null;
let pendingCandidates = [];

const cleanupConnection = (get) => {
  peerConnection?.close();
  peerConnection = null;
  pendingCandidates = [];
  get().localStream?.getTracks().forEach((t) => t.stop());
};

const getLocalStream = () =>
  navigator.mediaDevices.getUserMedia({ video: true, audio: true });

const createPeerConnection = (peerId, set, get) => {
  const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

  pc.onicecandidate = (e) => {
    if (e.candidate) {
      useAuthStore.getState().socket?.emit("call:ice-candidate", { to: peerId, candidate: e.candidate });
    }
  };
  pc.ontrack = (e) => {
    set({ remoteStream: e.streams[0], status: "connected" });
  };
  pc.onconnectionstatechange = () => {
    if (["failed", "disconnected", "closed"].includes(pc.connectionState) && get().status !== "ended") {
      set({ status: "ended" });
    }
  };

  return pc;
};

export const useCallStore = create((set, get) => ({
  peerId: null,
  peerName: "",
  status: "idle", // idle | calling | connecting | connected | ended | declined | failed
  localStream: null,
  remoteStream: null,
  incomingCall: null, // { from, offer }

  startCall: async (peerId, peerName = "") => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return toast.error("Not connected — refresh and try again");
    if (!useAuthStore.getState().onlineUsers.includes(peerId)) {
      toast.error(`${peerName || "This person"} is currently offline`);
      return;
    }

    try {
      const localStream = await getLocalStream();
      set({ peerId, peerName, status: "calling", localStream, remoteStream: null });

      peerConnection = createPeerConnection(peerId, set, get);
      localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.emit("call:offer", { to: peerId, offer });
    } catch {
      toast.error("Could not access your camera/microphone");
      set({ status: "failed" });
    }
  },

  acceptIncomingCall: async () => {
    const { incomingCall } = get();
    if (!incomingCall) return;
    const socket = useAuthStore.getState().socket;

    try {
      const localStream = await getLocalStream();
      set({
        peerId: incomingCall.from,
        status: "connecting",
        localStream,
        remoteStream: null,
        incomingCall: null,
      });

      peerConnection = createPeerConnection(incomingCall.from, set, get);
      localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));

      await peerConnection.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
      for (const candidate of pendingCandidates) await peerConnection.addIceCandidate(candidate);
      pendingCandidates = [];

      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit("call:answer", { to: incomingCall.from, answer });
    } catch {
      toast.error("Could not access your camera/microphone");
      set({ status: "failed", incomingCall: null });
    }
  },

  declineIncomingCall: () => {
    const { incomingCall } = get();
    if (!incomingCall) return;
    useAuthStore.getState().socket?.emit("call:decline", { to: incomingCall.from });
    set({ incomingCall: null });
  },

  endCall: () => {
    const { peerId, status } = get();
    if (peerId && !["idle", "ended", "declined"].includes(status)) {
      useAuthStore.getState().socket?.emit("call:end", { to: peerId });
    }
    cleanupConnection(get);
    set({ peerId: null, peerName: "", status: "idle", localStream: null, remoteStream: null });
  },

  // Wired once (RootLayout) so an incoming call can be answered from any
  // page — not just while already sitting on the call screen.
  attachSignaling: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket || listenersAttached) return;
    listenersAttached = true;

    socket.on("call:offer", ({ from, offer }) => {
      // Already on a call — treat a second incoming offer as busy/ignored
      // rather than silently dropping the caller into limbo.
      if (get().status !== "idle") return;
      set({ incomingCall: { from, offer } });
    });

    socket.on("call:answer", async ({ answer }) => {
      if (!peerConnection) return;
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      for (const candidate of pendingCandidates) await peerConnection.addIceCandidate(candidate);
      pendingCandidates = [];
      set({ status: "connecting" });
    });

    socket.on("call:ice-candidate", ({ candidate }) => {
      if (!candidate) return;
      const iceCandidate = new RTCIceCandidate(candidate);
      if (peerConnection?.remoteDescription) peerConnection.addIceCandidate(iceCandidate);
      else pendingCandidates.push(iceCandidate);
    });

    socket.on("call:decline", () => {
      toast.error(`${get().peerName || "They"} declined the call`);
      cleanupConnection(get);
      set({ peerId: null, peerName: "", status: "declined", localStream: null, remoteStream: null });
    });

    socket.on("call:end", () => {
      cleanupConnection(get);
      set({ status: "ended", remoteStream: null });
    });
  },

  detachSignaling: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("call:offer");
    socket?.off("call:answer");
    socket?.off("call:ice-candidate");
    socket?.off("call:decline");
    socket?.off("call:end");
    listenersAttached = false;
  },
}));
