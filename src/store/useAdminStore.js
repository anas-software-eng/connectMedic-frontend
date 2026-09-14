import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { getErrorMessage } from "../lib/utils";

export const useAdminStore = create((set, get) => ({
  users: [],
  doctors: [],
  appointments: [],
  auditLogs: [],
  isFetching: false,

  fetchUsers: async (role = "") => {
    set({ isFetching: true });
    try {
      const res = await axiosInstance.get("/admin/users", { params: role ? { role } : {} });
      set({ users: res.data });
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load users"));
    } finally {
      set({ isFetching: false });
    }
  },

  updateUserRole: async (id, role) => {
    try {
      await axiosInstance.put(`/admin/users/${id}/role`, { role });
      toast.success("Role updated");
      set({ users: get().users.map((u) => (u._id === id ? { ...u, role } : u)) });
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not update role"));
    }
  },

  setUserBanned: async (id, banned) => {
    try {
      await axiosInstance.put(`/admin/users/${id}/ban`, { banned });
      toast.success(banned ? "User banned" : "User unbanned");
      set({ users: get().users.map((u) => (u._id === id ? { ...u, isBanned: banned } : u)) });
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not update user"));
    }
  },

  fetchDoctors: async (verified) => {
    set({ isFetching: true });
    try {
      const res = await axiosInstance.get("/admin/doctors", {
        params: verified === undefined ? {} : { verified },
      });
      set({ doctors: res.data });
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load doctors"));
    } finally {
      set({ isFetching: false });
    }
  },

  setDoctorVerified: async (doctor, isVerified) => {
    try {
      await axiosInstance.put(`/admin/doctors/${doctor._id}/verify`, { isVerified });
      toast.success(isVerified ? "Doctor approved" : "Verification revoked");
      get().fetchDoctors();
    } catch (error) {
      toast.error(getErrorMessage(error, "Update failed"));
    }
  },

  updateDoctor: async (id, updates) => {
    try {
      await axiosInstance.put(`/admin/doctors/${id}`, updates);
      toast.success("Doctor profile updated");
      get().fetchDoctors();
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not update doctor"));
    }
  },

  deleteDoctor: async (id) => {
    try {
      await axiosInstance.delete(`/admin/doctors/${id}`);
      toast.success("Doctor profile removed");
      set({ doctors: get().doctors.filter((d) => d._id !== id) });
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not remove doctor"));
    }
  },

  fetchAppointments: async (status = "") => {
    set({ isFetching: true });
    try {
      const res = await axiosInstance.get("/admin/appointments", { params: status ? { status } : {} });
      set({ appointments: res.data.appointments });
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load appointments"));
    } finally {
      set({ isFetching: false });
    }
  },

  forceCancelAppointment: async (id) => {
    try {
      await axiosInstance.put(`/admin/appointments/${id}/cancel`);
      toast.success("Appointment cancelled");
      set({
        appointments: get().appointments.map((a) => (a._id === id ? { ...a, status: "cancelled" } : a)),
      });
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not cancel appointment"));
    }
  },

  deleteReview: async (id) => {
    try {
      await axiosInstance.delete(`/admin/reviews/${id}`);
      toast.success("Review removed");
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not remove review"));
      return false;
    }
  },

  broadcast: async ({ title, body, audience }) => {
    try {
      const res = await axiosInstance.post("/admin/announce", { title, body, audience });
      toast.success(`Sent to ${res.data.recipients} people`);
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not send announcement"));
      return false;
    }
  },

  conversationView: null, // { userA, userB, messages }
  isFetchingConversation: false,

  fetchConversation: async (userAId, userBId) => {
    set({ isFetchingConversation: true, conversationView: null });
    try {
      const res = await axiosInstance.get(`/admin/messages/${userAId}/${userBId}`);
      set({ conversationView: res.data });
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not load conversation"));
    } finally {
      set({ isFetchingConversation: false });
    }
  },

  fetchAuditLog: async () => {
    set({ isFetching: true });
    try {
      const res = await axiosInstance.get("/admin/audit");
      set({ auditLogs: res.data.logs });
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load audit log"));
    } finally {
      set({ isFetching: false });
    }
  },
}));
