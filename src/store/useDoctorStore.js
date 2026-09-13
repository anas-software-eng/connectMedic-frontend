import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

// Doctor directory + slot availability.
export const useDoctorStore = create((set) => ({
  doctors: [],
  doctor: null,
  slots: [],
  isFetching: false,
  isFetchingDoctor: false,

  fetchDoctors: async ({ query = "", specialization = "" } = {}) => {
    set({ isFetching: true });
    try {
      const params = new URLSearchParams();
      if (query) params.set("query", query);
      if (specialization) params.set("specialization", specialization);
      const res = await axiosInstance.get(`/doctors?${params.toString()}`);
      set({ doctors: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load doctors");
    } finally {
      set({ isFetching: false });
    }
  },

  fetchDoctor: async (id) => {
    set({ isFetchingDoctor: true });
    try {
      const res = await axiosInstance.get(`/doctors/${id}`);
      set({ doctor: res.data, slots: [] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Doctor not found");
    } finally {
      set({ isFetchingDoctor: false });
    }
  },

  fetchSlots: async (doctorId, date) => {
    set({ slots: [] });
    try {
      const res = await axiosInstance.get(`/doctors/${doctorId}/slots`, {
        params: { date },
      });
      set({ slots: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load time slots");
      set({ slots: [] });
    }
  },
}));