import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Mic, MicOff, PhoneOff, User, Video, VideoOff } from "lucide-react";
import { useCallStore } from "../store/useCallStore";
import { useChatStore } from "../store/useChatStore";

const STATUS_LABEL = {
  calling: "Calling...",
  connecting: "Connecting...",
  connected: "Connected",
  ended: "Call ended",
  declined: "Call declined",
  failed: "Couldn't start the call",
};

const VideoCallPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { conversations } = useChatStore();
  const { peerId, status, localStream, remoteStream, startCall, endCall } = useCallStore();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  const peerName = conversations.find((c) => c._id === userId)?.fullName || "this person";

  // A fresh visit to /dashboard/call/:userId starts a new call; arriving via
  // "Accept" on an incoming call already set peerId/status before we navigated.
  useEffect(() => {
    if (peerId === null && status === "idle") {
      startCall(userId, peerName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => endCall(), []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (localVideoRef.current) localVideoRef.current.srcObject = localStream || null;
  }, [localStream]);
  useEffect(() => {
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream || null;
  }, [remoteStream]);

  const toggleMic = () => {
    localStream?.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
    setMicOn((v) => !v);
  };
  const toggleCamera = () => {
    localStream?.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
    setCameraOn((v) => !v);
  };

  const isEnded = ["ended", "declined", "failed"].includes(status);

  return (
    <div className="bg-base-100 border border-base-300/70 rounded-2xl shadow-sm overflow-hidden h-[calc(100vh-16rem)] min-h-[32rem] flex flex-col">
      <div className="relative flex-1 bg-neutral">
        {remoteStream ? (
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-neutral-content">
            <div className="size-20 rounded-full bg-neutral-content/10 flex items-center justify-center">
              <User className="size-10" />
            </div>
            <p className="text-lg font-medium">{peerName}</p>
            <p className="text-sm text-neutral-content/70" aria-live="polite">
              {STATUS_LABEL[status] || "Connecting..."}
            </p>
          </div>
        )}

        {localStream && (
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="absolute bottom-4 right-4 w-32 sm:w-44 aspect-video rounded-xl object-cover ring-2 ring-base-100 shadow-lg bg-neutral"
          />
        )}
      </div>

      <div className="p-4 flex items-center justify-center gap-3 border-t border-base-300/70">
        {isEnded ? (
          <button type="button" className="btn btn-primary" onClick={() => navigate(-1)}>
            Back
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={toggleMic}
              aria-label={micOn ? "Mute microphone" : "Unmute microphone"}
              className={`btn btn-circle ${micOn ? "btn-ghost" : "btn-error"}`}
            >
              {micOn ? <Mic className="size-5" /> : <MicOff className="size-5" />}
            </button>
            <button
              type="button"
              onClick={toggleCamera}
              aria-label={cameraOn ? "Turn camera off" : "Turn camera on"}
              className={`btn btn-circle ${cameraOn ? "btn-ghost" : "btn-error"}`}
            >
              {cameraOn ? <Video className="size-5" /> : <VideoOff className="size-5" />}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="End call"
              className="btn btn-circle btn-error"
            >
              <PhoneOff className="size-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoCallPage;
