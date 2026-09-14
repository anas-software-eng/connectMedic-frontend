import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { getErrorMessage } from "../lib/utils";

export const useAppointmentStore = create((set, get) => ({
  appointments: [],
  patients: [],
  isFetching: false,
  isSubmitting: false,

  fetchMine: async () => {
    set({ isFetching: true });
    try {
      const res = await axiosInstance.get("/appointments");
      set({ appointments: res.data });
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load appointments"));
    } finally {
      set({ isFetching: false });
    }
  },

  fetchPatients: async () => {
    set({ isFetching: true });
    try {
      const res = await axiosInstance.get("/appointments/patients");
      set({ patients: res.data });
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load your patients"));
    } finally {
      set({ isFetching: false });
    }
  },

  book: async (data) => {
    set({ isSubmitting: true });
    try {
      const res = await axiosInstance.post("/appointments", data);
      toast.success("Appointment booked");
      return res.data;
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not book appointment"));
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },

  cancel: async (id) => {
    try {
      await axiosInstance.put(`/appointments/${id}/cancel`);
      toast.success("Appointment cancelled");
      get().fetchMine();
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not cancel appointment"));
    }
  },

  updateStatus: async (id, status) => {
    try {
      await axiosInstance.put(`/appointments/${id}/status`, { status });
      toast.success(`Appointment marked ${status}`);
      get().fetchMine();
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not update appointment"));
    }
  },

  // Either side answers independently; the backend flips status to
  // "completed" only once both have confirmed the visit happened.
  confirmDone: async (id, completed) => {
    try {
      await axiosInstance.put(`/appointments/${id}/confirm-completion`, { completed });
      get().fetchMine();
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not record your answer"));
    }
  },
}));