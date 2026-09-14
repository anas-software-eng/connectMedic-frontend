import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BackButton from "../components/BackButton";
import DoctorProfileSetUp from "./DoctorProfileSetUp";
import { Camera, Mail, User } from "lucide-react";

const fieldBox =
  "px-4 py-2.5 rounded-lg bg-base-200 border border-base-content/10";

// Read-only "Full Name" / "Email" rows on the identity card.
const ReadOnlyField = ({ icon: Icon, label, value }) => (
  <div className="space-y-1.5">
    <div className="text-sm text-base-content/60 flex items-center gap-2">
      <Icon className="w-4 h-4" />
      {label}
    </div>
    <p className={fieldBox}>{value}</p>
  </div>
);

/* ------------------------------------------------------------------ *
 * Page - identity card for every role, plus the doctor form when the
 * signed-in user is a doctor. All doctor fields live in DoctorProfileSetUp.
 * ------------------------------------------------------------------ */

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();

  // Local preview of a just-picked avatar; falls back to the saved one.
  const [selectedImg, setSelectedImg] = useState(null);

  const isDoctor = authUser?.role === "doctor";

  // Avatar uploads go straight to the server as base64 - they are not part
  // of the doctor form and do not wait for its "Save profile" button.
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      setSelectedImg(reader.result);
      await updateProfile({ profilePic: reader.result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      {/* Doctors get a two-column layout (identity + form); everyone else one. */}
      <div className={`mx-auto px-4 ${isDoctor ? "max-w-6xl" : "max-w-2xl"}`}>
        <BackButton to="/" className="mb-4" />

        <div
          className={`grid gap-6 items-start ${
            isDoctor ? "lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]" : "grid-cols-1"
          }`}
        >
          <div className="min-w-0 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto pr-1">
            <div className="bg-base-300 rounded-xl p-6 sm:p-8 space-y-8">
              <div className="text-center">
                <h1 className="text-2xl font-semibold capitalize">{authUser?.role} Profile</h1>
                {authUser?.role === "patient" && (
                  <p className="mt-2 text-sm text-base-content/60">
                    The details your care team sees on your messages
                  </p>
                )}
              </div>

              {/* Avatar upload: the label is the click target for the hidden
                  file input it wraps, so the camera badge acts as the button. */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <img
                    src={selectedImg || authUser?.profilePic || "/avatar.png"}
                    alt="Profile"
                    className="size-32 rounded-full object-cover border-4 border-base-100 cm-pulse"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${
                      isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                    }`}
                  >
                    <Camera className="w-5 h-5 text-base-200" />
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUpdatingProfile}
                    />
                  </label>
                </div>
                <p className="text-sm text-base-content/60">
                  {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
                </p>
              </div>

              <div className="space-y-6">
                <ReadOnlyField icon={User} label="Full Name" value={authUser?.fullName} />
                <ReadOnlyField icon={Mail} label="Email Address" value={authUser?.email} />
              </div>

              {authUser?.role !== "admin" && (
                <div className="bg-base-200 rounded-xl p-5 border border-base-content/10">
                  <div className="mb-4 flex items-center gap-3">
                    <h2 className="text-lg font-medium">Account Information</h2>
                    {/* live trace so the card reads as an active monitor */}
                    <svg
                      viewBox="0 0 100 20"
                      className="h-5 flex-1 text-primary"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        pathLength="1"
                        className="cm-ecg"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        d="M0 10h30l4-7 5 14 4-7h10l3-4 4 8 3-4h34"
                      />
                    </svg>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-base-content/10">
                      <span className="capitalize">{authUser?.role} Since</span>
                      {/* createdAt is an ISO string - keep only the date half. */}
                      <span className="text-base-content/70">
                        {authUser?.createdAt?.split("T")[0]}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-base-content/10">
                      <span>Account Status</span>
                      <span className="text-success font-medium flex items-center gap-2">
                        <span className="size-2 rounded-full bg-success cm-beat" />
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span>Record Privacy</span>
                      <span className="text-primary font-medium">Encrypted &mdash; HIPAA aligned</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {isDoctor && <DoctorProfileSetUp />}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
