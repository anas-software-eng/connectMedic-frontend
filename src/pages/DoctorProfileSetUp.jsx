import { useEffect, useRef, useState } from "react";

import { BadgeCheck, Plus, Star, Trash2, UserRoundPen, X } from "lucide-react";

import { useAuthStore } from "../store/useAuthStore";
import { SPECIALIZATIONS } from "../constants/specializations";

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

const EMPTY_FORM = {
  licenseNumber: "",
  specialization: "",
  qualifications: [],
  languages: [],
  experienceYears: 0,
  consultationFee: 0,
  clinicAddress: "",
  about: "",
  availability: [],
  isAvailable: true,
};

// authUser already carries the flattened doctor profile (see backend
// withDoctorProfile) once one exists, so the form just reads off it directly
// — no separate fetch needed.
const formFromUser = (authUser) => ({
  licenseNumber: authUser?.licenseNumber || "",
  specialization: authUser?.specialization || "",
  qualifications: authUser?.qualifications || [],
  languages: authUser?.languages || [],
  experienceYears: authUser?.experienceYears || 0,
  consultationFee: authUser?.consultationFee || 0,
  clinicAddress: authUser?.clinicAddress || "",
  about: authUser?.about || "",
  availability: authUser?.availability || [],
  isAvailable: authUser?.isAvailable ?? true,
});

/* ------------------------------------------------------------------ *
 * Small presentational pieces
 * ------------------------------------------------------------------ */
const StatTile = ({ label, children }) => (
  <div className="rounded-lg bg-base-100 border border-base-content/10 px-3 py-2.5">
    <div className="text-xs text-base-content/72">{label}</div>
    <div className="mt-1 text-sm font-medium">{children}</div>
  </div>
);

const TextField = ({ as = "input", name, label, value, onChange, ...rest }) => {
  const Element = as;
  return (
    <div>
      <label className="label label-text" htmlFor={name}>
        {label}
      </label>
      <Element
        id={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className={
          as === "textarea"
            ? "textarea textarea-bordered w-full resize-y"
            : "input input-bordered w-full"
        }
        {...rest}
      />
    </div>
  );
};

// Type-to-filter dropdown, styled to match the rest of the DaisyUI form —
// replaces the Chakra Combobox that used to live here.
const SearchableSelect = ({ label, value, onChange, options, placeholder }) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const selected = options.find((o) => o.value === value);
  const filtered = query.trim()
    ? options.filter((o) => o.label.toLowerCase().includes(query.trim().toLowerCase()))
    : options;

  return (
    <div className="relative" ref={containerRef}>
      <label className="label label-text">{label}</label>
      <input
        type="text"
        className="input input-bordered w-full"
        placeholder={placeholder}
        value={open ? query : selected?.label || ""}
        onFocus={() => {
          setOpen(true);
          setQuery("");
        }}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
      />
      {open && (
        <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg bg-base-100 border border-base-content/10 shadow-lg p-1">
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-sm text-base-content/72">No specialization found</li>
          ) : (
            filtered.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  className={`w-full text-left rounded-md px-3 py-2 text-sm transition hover:bg-base-200 ${
                    option.value === value ? "bg-base-200 font-medium text-primary" : ""
                  }`}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  {option.label}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

// Free-form chip input (Enter or comma to add) — replaces the Chakra TagsInput.
const TagField = ({ label, hint, placeholder, value, onChange }) => {
  const [draft, setDraft] = useState("");

  const commit = () => {
    const tag = draft.trim();
    if (tag && !value.includes(tag)) onChange([...value, tag]);
    setDraft("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  const removeAt = (index) => onChange(value.filter((_, i) => i !== index));

  return (
    <div>
      <label className="label label-text">{label}</label>
      <div className="input input-bordered flex h-auto min-h-12 w-full flex-wrap items-center gap-2 py-2">
        {value.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 pl-2.5 pr-1.5 py-1 text-xs font-medium text-primary ring-1 ring-primary/30"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeAt(index)}
              aria-label={`Remove ${tag}`}
              className="rounded-full p-0.5 opacity-70 transition hover:bg-primary/25 hover:opacity-100"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commit}
          placeholder={placeholder}
          className="min-w-36 flex-1 bg-transparent text-sm text-base-content outline-none placeholder:text-base-content/65"
        />
      </div>
      {hint && <span className="mt-2 block text-xs text-base-content/72">{hint}</span>}
    </div>
  );
};

const AvailabilityEditor = ({ slots, onChange }) => {
  const updateSlot = (index, key, value) =>
    onChange(slots.map((slot, i) => (i === index ? { ...slot, [key]: value } : slot)));

  const addSlot = () => onChange([...slots, { ...EMPTY_SLOT }]);
  const removeSlot = (index) => onChange(slots.filter((_, i) => i !== index));

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="label label-text p-0">Availability</span>
        <button type="button" onClick={addSlot} className="btn btn-xs btn-ghost gap-1 text-primary">
          <Plus className="w-3.5 h-3.5" />
          Add slot
        </button>
      </div>

      {slots.length === 0 ? (
        <p className="text-sm text-base-content/72 px-3 py-4 rounded-lg bg-base-100 border border-dashed border-base-content/15 text-center">
          No hours set yet. Add a slot so patients know when to reach you.
        </p>
      ) : (
        <div className="space-y-2">
          {slots.map((slot, index) => (
            // Index as key is fine here: the rows hold no state of their own
            // and are always re-rendered straight from `slots`.
            <div
              key={index}
              className="flex flex-wrap items-center gap-2 rounded-lg bg-base-100 border border-base-content/10 p-2"
            >
              <select
                value={slot.day}
                onChange={(e) => updateSlot(index, "day", e.target.value)}
                className="select select-bordered select-sm flex-1 min-w-32 capitalize"
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
                onChange={(e) => updateSlot(index, "startTime", e.target.value)}
                className="input input-bordered input-sm"
              />
              <span className="text-base-content/65 text-sm">to</span>
              <input
                type="time"
                value={slot.endTime}
                onChange={(e) => updateSlot(index, "endTime", e.target.value)}
                className="input input-bordered input-sm"
              />

              <button
                type="button"
                onClick={() => removeSlot(index)}
                aria-label={`Remove ${slot.day} slot`}
                className="ml-auto p-2 rounded-md text-base-content/72 hover:text-error hover:bg-error/10 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DoctorProfileSetUp = () => {
  const authUser = useAuthStore((state) => state.authUser);
  const saveDoctorProfile = useAuthStore((state) => state.saveDoctorProfile);
  const isUpdatingProfile = useAuthStore((state) => state.isUpdatingProfile);

  const isEditing = Boolean(authUser?.specialization);
  const [form, setForm] = useState(() => formFromUser(authUser) || EMPTY_FORM);

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async (e) => {
    e.preventDefault();
    await saveDoctorProfile({
      ...form,
      // Number inputs hand back strings; the API expects numbers.
      experienceYears: Number(form.experienceYears) || 0,
      consultationFee: Number(form.consultationFee) || 0,
      // Drop half-filled rows so the schema's `required` times never see "".
      availability: form.availability.filter((s) => s.day && s.startTime && s.endTime),
    });
  };

  return (
    <form
      onSubmit={handleSave}
      className="min-w-0 lg:min-h-[32rem] lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto bg-base-200 rounded-xl p-5 border border-base-content/10 space-y-6"
    >
      <div className="-mx-5 -mt-5 px-5 pt-5 pb-4 space-y-4 bg-base-200 rounded-t-xl border-b border-base-content/10">
        <div className="flex items-center gap-3">
          <UserRoundPen className="w-5 h-5 shrink-0 text-primary" />
          <h2 className="text-lg font-medium">
            {isEditing ? "Your doctor profile" : "Set up your doctor profile"}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 cm-stagger">
          <StatTile label="Rating">
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-warning" />
              {(authUser?.rating || 0).toFixed(1)}
            </span>
          </StatTile>

          <StatTile label="Reviews">{authUser?.reviewCount || 0}</StatTile>

          <StatTile label="Verification">
            <span
              className={`flex items-center gap-1.5 ${
                authUser?.isVerified ? "text-success" : "text-base-content/60"
              }`}
            >
              <BadgeCheck className="w-4 h-4" />
              {authUser?.isVerified ? "Verified" : "Pending"}
            </span>
          </StatTile>
        </div>
      </div>

      <TextField
        name="licenseNumber"
        label="License Number"
        value={form.licenseNumber}
        onChange={handleChange}
        required
        placeholder="e.g. PMDC-12345-P"
      />

      <SearchableSelect
        label="Specialization"
        placeholder="Search specialization..."
        options={SPECIALIZATIONS}
        value={form.specialization}
        onChange={(value) => handleChange("specialization", value)}
      />

      <TagField
        label="Qualifications"
        placeholder="e.g. MBBS, FCPS..."
        hint="Press Enter to add a qualification"
        value={form.qualifications}
        onChange={(tags) => handleChange("qualifications", tags)}
      />

      <TagField
        label="Languages"
        placeholder="e.g. English, Urdu..."
        hint="Press Enter to add a language"
        value={form.languages}
        onChange={(tags) => handleChange("languages", tags)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField
          name="experienceYears"
          label="Years of Experience"
          type="number"
          min="0"
          value={form.experienceYears}
          onChange={handleChange}
        />
        <TextField
          name="consultationFee"
          label="Consultation Fee"
          type="number"
          min="0"
          value={form.consultationFee}
          onChange={handleChange}
        />
      </div>

      <TextField
        as="textarea"
        name="clinicAddress"
        label="Clinic Address"
        rows={2}
        value={form.clinicAddress}
        onChange={handleChange}
        placeholder="Street, city, and any directions patients need"
      />

      <TextField
        as="textarea"
        name="about"
        label="About"
        rows={4}
        value={form.about}
        onChange={handleChange}
        placeholder="A short introduction patients will read before booking"
      />

      <AvailabilityEditor
        slots={form.availability}
        onChange={(slots) => handleChange("availability", slots)}
      />

      <label className="flex items-center justify-between gap-4 rounded-lg bg-base-100 border border-base-content/10 px-4 py-3 cursor-pointer">
        <span>
          <span className="block text-sm font-medium">Accepting patients</span>
          <span className="block text-xs text-base-content/72 mt-0.5">
            Turn this off to hide yourself from new bookings
          </span>
        </span>
        <input
          type="checkbox"
          checked={form.isAvailable}
          onChange={(e) => handleChange("isAvailable", e.target.checked)}
          className="toggle toggle-primary"
        />
      </label>

      <button type="submit" disabled={isUpdatingProfile} className="btn btn-primary w-full">
        {isUpdatingProfile ? "Saving..." : isEditing ? "Save changes" : "Save profile"}
      </button>
    </form>
  );
};

export default DoctorProfileSetUp;
