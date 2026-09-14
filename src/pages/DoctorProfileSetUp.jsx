import { useState } from "react";

import { BadgeCheck, Plus, Star, Trash2, UserRoundPen, X, } from "lucide-react";
import { Span, TagsInput, Combobox, Portal, useFilter, useListCollection, } from "@chakra-ui/react";

import { useDocStore } from "../store/useDocStore";


/* ------------------------------------------------------------------ *
 * Constants
 * ------------------------------------------------------------------ */
const SPECIALIZATIONS = [
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

/* ------------------------------------------------------------------ *
 * Small presentational pieces
 * ------------------------------------------------------------------ */
const StatTile = ({ label, children }) => (
  <div className="rounded-lg bg-base-100 border border-base-content/10 px-3 py-2.5">
    <div className="text-xs text-base-content/50">{label}</div>
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

const TagField = ({ label, hint, placeholder, value, onChange }) => (
  <TagsInput.Root value={value} onValueChange={(d) => onChange(d.value)} width="100%">
    <TagsInput.Label className="label label-text">{label}</TagsInput.Label>

    <TagsInput.Control className="input input-bordered flex h-auto min-h-12 w-full flex-wrap items-center gap-2 py-2">

      <TagsInput.Context>
        {({ value: tags }) =>
          tags.map((tag, index) => (
            <TagsInput.Item key={`${tag}-${index}`} index={index} value={tag}>
              <TagsInput.ItemPreview className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full bg-primary/15 text-primary text-xs font-medium ring-1 ring-primary/30">
                <TagsInput.ItemText>{tag}</TagsInput.ItemText>
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
        placeholder={placeholder}
        className="flex-1 min-w-36 bg-transparent text-sm text-base-content outline-none placeholder:text-base-content/40"
      />
    </TagsInput.Control>

    <TagsInput.HiddenInput />

    <Span className="block mt-2 text-xs text-base-content/50">{hint}</Span>
  </TagsInput.Root>
);


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
        <p className="text-sm text-base-content/50 px-3 py-4 rounded-lg bg-base-100 border border-dashed border-base-content/15 text-center">
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
              <span className="text-base-content/40 text-sm">to</span>
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
                className="ml-auto p-2 rounded-md text-base-content/50 hover:text-error hover:bg-error/10 transition"
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

  const createProfile = useDocStore((state) => state.createProfile);
  const isCreatingProfile = useDocStore((state) => state.isCreatingProfile);

  // The doctor profile does not exist yet, so the form starts empty.
  const [formData, setFormData] = useState(EMPTY_FORM);

  // Chakra's combobox needs its own collection so it can filter as you type.
  const { contains } = useFilter({ sensitivity: "base" });
  const { collection, filter } = useListCollection({
    initialItems: SPECIALIZATIONS,
    filter: contains,
  });

  // One setter for every field: handleChange("about", value).
  const handleChange = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

  const handleSave = async (e) => {
    e.preventDefault();
    await createProfile({
      ...formData,
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
          <h2 className="text-lg font-medium">Set up your doctor profile</h2>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 cm-stagger">
          <StatTile label="Rating">
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-warning" />
              {(0).toFixed(1)}
            </span>
          </StatTile>

          <StatTile label="Reviews">0</StatTile>

          <StatTile label="Verification">
            <span className="flex items-center gap-1.5 text-base-content/60">
              <BadgeCheck className="w-4 h-4" />
              Pending
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

      <Combobox.Root
        collection={collection}
        value={form.specialization ? [form.specialization] : []}
        onValueChange={(details) => handleChange("specialization", details.value[0] || "")}
        onInputValueChange={(e) => filter(e.inputValue)}
        width="100%"
      >
        <Combobox.Label className="label label-text">Specialization</Combobox.Label>

        <Combobox.Control className="input input-bordered flex w-full items-center">
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
          <span className="block text-xs text-base-content/50 mt-0.5">
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

      <button type="submit" disabled={isCreatingProfile} className="btn btn-primary w-full">
        {isCreatingProfile ? "Saving..." : "Save profile"}
      </button>
    </form>
  )
}

export default DoctorProfileSetUp;
