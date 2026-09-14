import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { getErrorMessage } from "../lib/utils";
import { useAuthStore } from "./useAuthStore";

let listenerAttached = false;

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  getNotifications: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/notifications");
      set({ notifications: res.data.notifications, unreadCount: res.data.unreadCount });
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load notifications"));
    } finally {
      set({ isLoading: false });
    }

    const socket = useAuthStore.getState().socket;
    if (socket && !listenerAttached) {
      listenerAttached = true;
      socket.on("notification:new", (notification) => {
        set({
          notifications: [notification, ...get().notifications],
          unreadCount: get().unreadCount + 1,
        });
        toast(notification.title, { icon: "🔔" });
      });
    }
  },

  markRead: async (id) => {
    set({
      notifications: get().notifications.map((n) => (n._id === id ? { ...n, read: true } : n)),
      unreadCount: Math.max(0, get().unreadCount - 1),
    });
    try {
      await axiosInstance.put(`/notifications/${id}/read`);
    } catch {
      // Local state already flipped; a background refresh will reconcile if this failed.
    }
  },

  markAllRead: async () => {
    set({
      notifications: get().notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    });
    try {
      await axiosInstance.put("/notifications/read-all");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not mark notifications read"));
    }
  },
}));
