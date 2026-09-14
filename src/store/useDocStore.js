import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useDocStore = create((set) => ({
  docProfile: null,
  isUpdatingProfile: false,
  isCreatingProfile: false,

  createProfile: async (data) => {
    set({ isCreatingProfile: true });
    try {
      const res = await axiosInstance.post("/doctor/profile-setup", data);
      set({ docProfile: res.data });
      toast.success("Profile created successfully");
    } catch (error) {
      console.log("error in create doctor profile:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isCreatingProfile: false });
    }
  },
  getDocProfileOverview : async () => {
    set({ isCreatingProfile: true });
    try {
      const res = await axiosInstance.post("/doctor/profile-setup", data);
      set({ docProfile: res.data });
      toast.success("Profile created successfully");
    } catch (error) {
      console.log("error in create doctor profile:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isCreatingProfile: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/doctor/update-profile", data);
      set({ docProfile: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update doctor profile:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
