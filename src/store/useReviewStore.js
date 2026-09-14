import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { getErrorMessage } from "../lib/utils";

export const useReviewStore = create((set, get) => ({
  reviewsByDoctor: {}, // doctorId -> { reviews: [], hasMore: boolean }
  isSubmitting: false,
  isFetching: false,

  submitReview: async ({ appointmentId, rating, comment }) => {
    set({ isSubmitting: true });
    try {
      await axiosInstance.post("/reviews", { appointmentId, rating, comment });
      toast.success("Thanks for your feedback!");
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not submit your review"));
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  fetchDoctorReviews: async (doctorId) => {
    set({ isFetching: true });
    try {
      const res = await axiosInstance.get(`/reviews/${doctorId}`);
      set({
        reviewsByDoctor: {
          ...get().reviewsByDoctor,
          [doctorId]: { reviews: res.data.reviews, hasMore: res.data.hasMore },
        },
      });
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not load reviews"));
    } finally {
      set({ isFetching: false });
    }
  },
}));
