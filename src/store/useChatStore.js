import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { getErrorMessage } from "../lib/utils";
import { useAuthStore } from "./useAuthStore";

let listenersAttached = false;

export const useChatStore = create((set, get) => ({
  conversations: [],
  isConversationsLoading: false,

  messages: [],
  isMessagesLoading: false,
  isLoadingOlder: false,
  hasMoreMessages: false,

  selectedUser: null,
  typingFrom: null, // userId of whoever is currently typing to me

  getConversations: async () => {
    set({ isConversationsLoading: true });
    try {
      const res = await axiosInstance.get("/messages/conversations");
      set({ conversations: res.data });
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load conversations"));
    } finally {
      set({ isConversationsLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true, messages: [], hasMoreMessages: false });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data.messages, hasMoreMessages: res.data.hasMore });
      // Opening the thread clears the unread badge for this conversation.
      set({
        conversations: get().conversations.map((c) =>
          c._id === userId ? { ...c, unreadCount: 0 } : c
        ),
      });
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load messages"));
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  loadOlderMessages: async () => {
    const { selectedUser, messages, hasMoreMessages, isLoadingOlder } = get();
    if (!selectedUser || !hasMoreMessages || isLoadingOlder || messages.length === 0) return;

    set({ isLoadingOlder: true });
    try {
      const before = messages[0]._id;
      const res = await axiosInstance.get(`/messages/${selectedUser._id}`, { params: { before } });
      set({
        messages: [...res.data.messages, ...get().messages],
        hasMoreMessages: res.data.hasMore,
      });
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load older messages"));
    } finally {
      set({ isLoadingOlder: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser } = get();
    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      _id: tempId,
      senderId: useAuthStore.getState().authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      seenAt: null,
      status: "sending",
    };
    set({ messages: [...get().messages, optimistic] });

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({
        messages: get().messages.map((m) => (m._id === tempId ? { ...res.data, status: "sent" } : m)),
      });
    } catch (error) {
      set({
        messages: get().messages.map((m) => (m._id === tempId ? { ...m, status: "failed" } : m)),
      });
      toast.error(getErrorMessage(error, "Message failed to send"));
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser, typingFrom: null }),

  emitTyping: () => {
    const { selectedUser } = get();
    const socket = useAuthStore.getState().socket;
    if (socket && selectedUser) socket.emit("typing", { to: selectedUser._id });
  },
  emitStopTyping: () => {
    const { selectedUser } = get();
    const socket = useAuthStore.getState().socket;
    if (socket && selectedUser) socket.emit("stopTyping", { to: selectedUser._id });
  },

  // Wired once from the dashboard shell so live updates (new messages,
  // typing, read receipts) work regardless of which page is on screen —
  // not just while a specific thread happens to be open.
  attachSocketListeners: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket || listenersAttached) return;
    listenersAttached = true;

    socket.on("newMessage", (message) => {
      const myId = useAuthStore.getState().authUser?._id;
      const otherId = message.senderId === myId ? message.receiverId : message.senderId;
      const { selectedUser, messages, conversations } = get();

      if (selectedUser?._id === otherId) {
        set({ messages: [...messages, message] });
      }

      const isIncoming = message.senderId !== myId;
      const existing = conversations.find((c) => c._id === otherId);
      const patch = {
        lastMessage: message.text || (message.image ? "Sent a photo" : ""),
        lastMessageAt: message.createdAt,
        lastMessageFromMe: !isIncoming,
        unreadCount:
          isIncoming && selectedUser?._id !== otherId
            ? (existing?.unreadCount || 0) + 1
            : existing?.unreadCount || 0,
      };
      set({
        conversations: existing
          ? conversations.map((c) => (c._id === otherId ? { ...c, ...patch } : c))
          : conversations, // a brand-new counterpart will show up on next getConversations()
      });
    });

    socket.on("messagesSeen", ({ by }) => {
      const { selectedUser, messages } = get();
      if (selectedUser?._id !== by) return;
      set({
        messages: messages.map((m) =>
          m.receiverId === by && !m.seenAt ? { ...m, seenAt: new Date().toISOString() } : m
        ),
      });
    });

    socket.on("typing", ({ from }) => {
      if (get().selectedUser?._id === from) set({ typingFrom: from });
    });
    socket.on("stopTyping", ({ from }) => {
      if (get().typingFrom === from) set({ typingFrom: null });
    });
  },

  detachSocketListeners: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
    socket.off("messagesSeen");
    socket.off("typing");
    socket.off("stopTyping");
    listenersAttached = false;
  },
}));
