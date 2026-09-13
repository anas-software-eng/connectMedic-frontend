// Single source of truth for doctor specializations (profile + search + filters).
export const SPECIALIZATIONS = [
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

export const SPECIALIZATION_OPTIONS = SPECIALIZATIONS.map((s) => s.label);

// Maps the display label back to its canonical value when filtering doctors.
export const valueOfSpecialization = (label) =>
  SPECIALIZATIONS.find((s) => s.label === label)?.value || label;