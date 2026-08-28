import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BackButton from "../components/BackButton";
import {
  BadgeCheck,
  Camera,
  Mail,
  Plus,
  Star,
  Trash2,
  User,
  UserRoundPen,
  X,
} from "lucide-react";
import {
  Span, TagsInput, Combobox, Portal,
  useFilter,
  useListCollection,
}
  from "@chakra-ui/react"

const specializations = [
  { label: "General Physician", value: "general-physician" },
  { label: "Cardiologist", value: "cardiologist" },
  { label: "Dermatologist", value: "dermatologist" },
  { label: "Neurologist", value: "neurologist" },
  { label: "Orthopedic Surgeon", value: "orthopedic-surgeon" },
  { label: "Pediatrician", value: "pediatrician" },
  { label: "Gynecologist", value: "gynecologist" },
  { label: "Psychiatrist", value: "psychiatrist" },
  { label: "ENT Specialist", value: "ent-specialist" },
  { label: "Ophthalmologist", value: "ophthalmologist" },
];

// Mirrors the `day` enum on the doctor schema, lowercase values and all.
const DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const EMPTY_SLOT = { day: "monday", startTime: "09:00", endTime: "17:00" };

// Every read-only field and every editable control share these, so the column
// of inputs lines up at one width no matter which role is signed in.
const fieldBox =
  "px-4 py-2.5 rounded-lg bg-base-200 border border-base-content/10";
const controlBox =
  "flex items-center min-h-12 w-full px-3 rounded-lg bg-base-200 border border-base-content/10 transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary";
const inputBox =
  "w-full min-h-12 px-3 rounded-lg bg-base-200 border border-base-content/10 text-sm text-base-content outline-none transition-colors placeholder:text-base-content/40 focus:border-primary focus:ring-1 focus:ring-primary";
const labelBox = "block text-sm font-medium text-base-content mb-2";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [qualifications, setQualifications] = useState([]);
  const [specialization, setSpecialization] = useState("");
  const [languages, setLanguages] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [form, setForm] = useState({
    licenseNumber: "",
    experienceYears: 0,
    consultationFee: 0,
    clinicAddress: "",
    about: "",
    isAvailable: true,
  });

  // Seed the form once the session lands (checkAuth resolves after first paint).
  useEffect(() => {
    if (!authUser) return;
    setSpecialization(authUser.specialization || "");
    setQualifications(authUser.qualifications || []);
    setLanguages(authUser.languages || []);
    setAvailability(authUser.availability || []);
    setForm({
      licenseNumber: authUser.licenseNumber || "",
      experienceYears: authUser.experienceYears ?? 0,
      consultationFee: authUser.consultationFee ?? 0,
      clinicAddress: authUser.clinicAddress || "",
      about: authUser.about || "",
      isAvailable: authUser.isAvailable ?? true,
    });
  }, [authUser]);

  const { contains } = useFilter({ sensitivity: "base" });
  const { collection, filter } = useListCollection({
    initialItems: specializations,
    filter: contains,
  });

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const setSlot = (index, key, value) =>
    setAvailability((prev) =>
      prev.map((slot, i) => (i === index ? { ...slot, [key]: value } : slot))
    );

  const addSlot = () => setAvailability((prev) => [...prev, { ...EMPTY_SLOT }]);

  const removeSlot = (index) =>
    setAvailability((prev) => prev.filter((_, i) => i !== index));

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await updateProfile({
      ...form,
      experienceYears: Number(form.experienceYears) || 0,
      consultationFee: Number(form.consultationFee) || 0,
      specialization,
      qualifications,
      languages,
      // Drop half-filled rows so the schema's `required` times never see "".
      availability: availability.filter((s) => s.day && s.startTime && s.endTime),
    });
  };

  const isDoctor = authUser?.role === "doctor";

  return (
    <div className="min-h-screen pt-20 pb-12 ">
   
      <div className={`mx-auto px-4 ${isDoctor ? "max-w-6xl" : "max-w-2xl"}`}>
        <BackButton to="/" className="mb-4" />
        <div
          className={`grid gap-6 items-start ${isDoctor ? "lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]" : "grid-cols-1"
            }`}
        >
          <div className="min-w-0 lg:sticky lg:top-24 lg:min-h-[42rem] lg:max-h-[calc(10vh - 60rem)] lg:overflow-y-auto pr-1">
          <div className="bg-base-300 rounded-xl p-6 sm:p-8 space-y-8">
            <div className="text-center">
              <h1 className="text-2xl font-semibold capitalize">{authUser?.role} Profile</h1>
              {authUser?.role === "patient" && (
                <p className="mt-2 text-sm text-base-content/60">
                  The details your care team sees on your messages
                </p>
              )}
            </div>

            {/* avatar upload section */}

            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={selectedImg || authUser?.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4 border-base-100 cm-pulse"
                />
                <label
                  htmlFor="avatar-upload"
                  className={`
                  absolute bottom-0 right-0
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
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
              <div className="space-y-1.5">
                <div className="text-sm text-base-content/60 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </div>
                <p className={fieldBox}>{authUser?.fullName}</p>
              </div>

              <div className="space-y-1.5">
                <div className="text-sm text-base-content/60 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </div>
                <p className={fieldBox}>{authUser?.email}</p>
              </div>
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
                    <span className="text-base-content/70">{authUser?.createdAt?.split("T")[0]}</span>
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
        {isDoctor && (
          <form
            onSubmit={handleSave}
            className="min-w-0 lg:min-h-[32rem] lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto bg-base-200 rounded-xl p-5 border border-base-content/10 space-y-6"
          >
            {/* header + platform-set stats stay pinned while the fields scroll */}
            <div className=" -mx-5 -mt-5 px-5 pt-5 pb-4 space-y-4 bg-base-200 rounded-t-xl border-b border-base-content/10">
              <div className="flex items-center gap-3">
                <UserRoundPen className="w-5 h-5 shrink-0 text-primary" />
                <h2 className="text-lg font-medium">Set up your doctor profile</h2>
              </div>

              {/* verification + reputation are set by the platform, not here */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 cm-stagger">
                <div className="rounded-lg bg-base-100 border border-base-content/10 px-3 py-2.5">
                  <div className="text-xs text-base-content/50">Rating</div>
                  <div className="mt-1 flex items-center gap-1.5 text-sm font-medium">
                    <Star className="w-4 h-4 text-warning" />
                    {(authUser?.rating ?? 0).toFixed(1)}
                  </div>
                </div>
                <div className="rounded-lg bg-base-100 border border-base-content/10 px-3 py-2.5">
                  <div className="text-xs text-base-content/50">Reviews</div>
                  <div className="mt-1 text-sm font-medium">{authUser?.reviewCount ?? 0}</div>
                </div>
                <div className="rounded-lg bg-base-100 border border-base-content/10 px-3 py-2.5">
                  <div className="text-xs text-base-content/50">Verification</div>
                  <div
                    className={`mt-1 flex items-center gap-1.5 text-sm font-medium ${authUser?.isVerified ? "text-success" : "text-base-content/60"
                      }`}
                  >
                    <BadgeCheck className="w-4 h-4" />
                    {authUser?.isVerified ? "Verified" : "Pending"}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className={labelBox} htmlFor="licenseNumber">
                License Number
              </label>
              <input
                id="licenseNumber"
                type="text"
                required
                value={form.licenseNumber}
                onChange={(e) => setField("licenseNumber", e.target.value)}
                placeholder="e.g. PMDC-12345-P"
                className={inputBox}
              />
            </div>

            {/* specialization */}
            <Combobox.Root
              collection={collection}
              value={specialization ? [specialization] : []}
              onValueChange={(details) => {
                setSpecialization(details.value[0] || "");
              }}
              onInputValueChange={(e) => filter(e.inputValue)}
              width="100%"
            >
              <Combobox.Label className={labelBox}>Specialization</Combobox.Label>

              <Combobox.Control className={controlBox}>
                <Combobox.Input
                  placeholder="Search specialization..."
                  className="flex-1 bg-transparent text-sm text-base-content outline-none placeholder:text-base-content/40"
                />

                <Combobox.IndicatorGroup className="flex items-center gap-1 text-base-content/50">
                  <Combobox.ClearTrigger />
                  <Combobox.Trigger />
                </Combobox.IndicatorGroup>
              </Combobox.Control>

              <Portal>
                <Combobox.Positioner>
                  <Combobox.Content className="z-50 max-h-60 overflow-y-auto rounded-lg bg-base-100 border border-base-content/10 shadow-lg p-1">
                    <Combobox.Empty className="px-3 py-2 text-sm text-base-content/50">
                      No specialization found
                    </Combobox.Empty>

                    {collection.items.map((item) => (
                      <Combobox.Item
                        item={item}
                        key={item.value}
                        className="flex items-center justify-between cursor-pointer rounded-md px-3 py-2 text-sm text-base-content hover:bg-base-200 data-[highlighted]:bg-base-200"
                      >
                        {item.label}
                        <Combobox.ItemIndicator />
                      </Combobox.Item>
                    ))}
                  </Combobox.Content>
                </Combobox.Positioner>
              </Portal>
            </Combobox.Root>

            {/* qualifications -- tag input */}
            <TagsInput.Root
              value={qualifications}
              onValueChange={(details) => setQualifications(details.value)}
              width="100%"
            >
              <TagsInput.Label className={labelBox}>Qualifications</TagsInput.Label>

              <TagsInput.Control className={`${controlBox} flex-wrap gap-2 py-2`}>
                <TagsInput.Context>
                  {({ value }) =>
                    value.map((item, index) => (
                      <TagsInput.Item key={`${item}-${index}`} index={index} value={item}>
                        <TagsInput.ItemPreview className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full bg-primary/15 text-primary text-xs font-medium ring-1 ring-primary/30">
                          <TagsInput.ItemText>{item}</TagsInput.ItemText>
                          <TagsInput.ItemDeleteTrigger className="rounded-full p-0.5 opacity-70 hover:opacity-100 hover:bg-primary/25 transition">
                            <X className="w-3 h-3" />
                          </TagsInput.ItemDeleteTrigger>
                        </TagsInput.ItemPreview>
                        <TagsInput.ItemInput className="bg-base-100 text-base-content text-xs rounded px-2 py-1 outline-none ring-1 ring-primary" />
                      </TagsInput.Item>
                    ))
                  }
                </TagsInput.Context>

                <TagsInput.Input
                  placeholder="e.g. MBBS, FCPS..."
                  className="flex-1 min-w-36 bg-transparent text-sm text-base-content outline-none placeholder:text-base-content/40"
                />
              </TagsInput.Control>

              <TagsInput.HiddenInput />

              <Span className="block mt-2 text-xs text-base-content/50">
                Press Enter to add a qualification
              </Span>
            </TagsInput.Root>

            {/* languages -- tag input */}
            <TagsInput.Root
              value={languages}
              onValueChange={(details) => setLanguages(details.value)}
              width="100%"
            >
              <TagsInput.Label className={labelBox}>Languages</TagsInput.Label>

              <TagsInput.Control className={`${controlBox} flex-wrap gap-2 py-2`}>
                <TagsInput.Context>
                  {({ value }) =>
                    value.map((item, index) => (
                      <TagsInput.Item key={`${item}-${index}`} index={index} value={item}>
                        <TagsInput.ItemPreview className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full bg-primary/15 text-primary text-xs font-medium ring-1 ring-primary/30">
                          <TagsInput.ItemText>{item}</TagsInput.ItemText>
                          <TagsInput.ItemDeleteTrigger className="rounded-full p-0.5 opacity-70 hover:opacity-100 hover:bg-primary/25 transition">
                            <X className="w-3 h-3" />
                          </TagsInput.ItemDeleteTrigger>
                        </TagsInput.ItemPreview>
                        <TagsInput.ItemInput className="bg-base-100 text-base-content text-xs rounded px-2 py-1 outline-none ring-1 ring-primary" />
                      </TagsInput.Item>
                    ))
                  }
                </TagsInput.Context>

                <TagsInput.Input
                  placeholder="e.g. English, Urdu..."
                  className="flex-1 min-w-36 bg-transparent text-sm text-base-content outline-none placeholder:text-base-content/40"
                />
              </TagsInput.Control>

              <TagsInput.HiddenInput />

              <Span className="block mt-2 text-xs text-base-content/50">
                Press Enter to add a language
              </Span>
            </TagsInput.Root>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelBox} htmlFor="experienceYears">
                  Years of Experience
                </label>
                <input
                  id="experienceYears"
                  type="number"
                  min="0"
                  value={form.experienceYears}
                  onChange={(e) => setField("experienceYears", e.target.value)}
                  className={inputBox}
                />
              </div>

              <div>
                <label className={labelBox} htmlFor="consultationFee">
                  Consultation Fee
                </label>
                <input
                  id="consultationFee"
                  type="number"
                  min="0"
                  value={form.consultationFee}
                  onChange={(e) => setField("consultationFee", e.target.value)}
                  className={inputBox}
                />
              </div>
            </div>

            <div>
              <label className={labelBox} htmlFor="clinicAddress">
                Clinic Address
              </label>
              <textarea
                id="clinicAddress"
                rows={2}
                value={form.clinicAddress}
                onChange={(e) => setField("clinicAddress", e.target.value)}
                placeholder="Street, city, and any directions patients need"
                className={`${inputBox} py-2.5 resize-y`}
              />
            </div>

            <div>
              <label className={labelBox} htmlFor="about">
                About
              </label>
              <textarea
                id="about"
                rows={4}
                value={form.about}
                onChange={(e) => setField("about", e.target.value)}
                placeholder="A short introduction patients will read before booking"
                className={`${inputBox} py-2.5 resize-y`}
              />
            </div>

            {/* availability -- one row per weekly slot */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`${labelBox} mb-0`}>Availability</span>
                <button
                  type="button"
                  onClick={addSlot}
                  className="btn btn-xs btn-ghost gap-1 text-primary"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add slot
                </button>
              </div>

              {availability.length === 0 ? (
                <p className="text-sm text-base-content/50 px-3 py-4 rounded-lg bg-base-100 border border-dashed border-base-content/15 text-center">
                  No hours set yet. Add a slot so patients know when to reach you.
                </p>
              ) : (
                <div className="space-y-2">
                  {availability.map((slot, index) => (
                    <div
                      key={index}
                      className="flex flex-wrap items-center gap-2 rounded-lg bg-base-100 border border-base-content/10 p-2"
                    >
                      <select
                        value={slot.day}
                        onChange={(e) => setSlot(index, "day", e.target.value)}
                        className="flex-1 min-w-32 h-10 px-2 rounded-md bg-base-200 border border-base-content/10 text-sm capitalize outline-none focus:border-primary"
                      >
                        {DAYS.map((day) => (
                          <option key={day} value={day} className="capitalize">
                            {day}
                          </option>
                        ))}
                      </select>

                      <input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => setSlot(index, "startTime", e.target.value)}
                        className="h-10 px-2 rounded-md bg-base-200 border border-base-content/10 text-sm outline-none focus:border-primary"
                      />
                      <span className="text-base-content/40 text-sm">to</span>
                      <input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => setSlot(index, "endTime", e.target.value)}
                        className="h-10 px-2 rounded-md bg-base-200 border border-base-content/10 text-sm outline-none focus:border-primary"
                      />

                      <button
                        type="button"
                        onClick={() => removeSlot(index)}
                        aria-label={`Remove ${slot.day} slot`}
                        className="ml-auto p-2 rounded-md text-base-content/50 hover:text-error hover:bg-error/10 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <label className="flex items-center justify-between gap-4 rounded-lg bg-base-100 border border-base-content/10 px-4 py-3 cursor-pointer">
              <span>
                <span className="block text-sm font-medium">Accepting patients</span>
                <span className="block text-xs text-base-content/50 mt-0.5">
                  Turn this off to hide yourself from new bookings
                </span>
              </span>
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(e) => setField("isAvailable", e.target.checked)}
                className="toggle toggle-primary"
              />
            </label>

            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="btn btn-primary w-full"
            >
              {isUpdatingProfile ? "Saving..." : "Save profile"}
            </button>
          </form>
        )}
       </div>
      </div>
    </div>
  );
};
export default ProfilePage;
