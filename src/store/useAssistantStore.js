import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { getErrorMessage } from "../lib/utils";

export const useAssistantStore = create((set, get) => ({
  messages: [], // { role: "user" | "assistant", content }
  isSending: false,
  suggestedSpecializations: [],

  sendMessage: async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const history = [...get().messages, { role: "user", content: trimmed }];
    set({ messages: history, isSending: true, suggestedSpecializations: [] });

    try {
      const res = await axiosInstance.post("/assistant/chat", { messages: history });
      set({
        messages: [...history, { role: "assistant", content: res.data.reply }],
        suggestedSpecializations: res.data.suggestedSpecializations || [],
      });
    } catch (error) {
      // Keep the user's own message on screen even though the reply failed.
      set({ messages: history });
      toast.error(getErrorMessage(error, "The assistant is unavailable right now"));
    } finally {
      set({ isSending: false });
    }
  },

  reset: () => set({ messages: [], suggestedSpecializations: [] }),
}));
