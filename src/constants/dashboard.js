import {
  Activity,
  BadgeCheck,
  CalendarCheck,
  FileHeart,
  LayoutDashboard,
  MessagesSquare,
  ShieldCheck,
  Stethoscope,
  UserCog,
  Users,
} from "lucide-react";

export const ROLES = {
  PATIENT: "patient",
  DOCTOR: "doctor",
  ADMIN: "admin",
};

// One dashboard shell, one config per role. To grow or shrink what a role sees,
// add/remove entries here — the layout and its outlet pages render what's listed.
export const DASHBOARD_CONFIG = {
  [ROLES.PATIENT]: {
    label: "Patient",
    subtitle: "Find a doctor, book a visit, and keep every follow-up in one place.",
    cta: { label: "Find a doctor", to: "/dashboard/find-doctors", icon: Stethoscope },
    nav: [
      { id: "home", label: "Overview", to: "/dashboard", end: true, icon: LayoutDashboard },
      { id: "find-doctors", label: "Find Doctors", to: "/dashboard/find-doctors", icon: Stethoscope },
      { id: "appointments", label: "My Appointments", to: "/dashboard/appointments", icon: CalendarCheck },
      { id: "messages", label: "Messages", to: "/dashboard/messages", icon: MessagesSquare },
      { id: "profile", label: "Profile", to: "/profile", icon: UserCog },
    ],
    stats: [
      { id: "upcoming", label: "Upcoming visits", value: 0, icon: CalendarCheck, hint: "Awaiting or confirmed" },
      { id: "total", label: "Total visits", value: 0, icon: FileHeart, hint: "All booked appointments" },
      { id: "unread", label: "Unread messages", value: 0, icon: MessagesSquare, hint: "From your care team" },
    ],
    sections: [
      { id: "appointments", title: "Recent appointments", empty: "No appointments yet. Find a doctor to book your first visit.", icon: CalendarCheck, action: { label: "Find a doctor", to: "/dashboard/find-doctors" } },
      { id: "messages", title: "Recent messages", empty: "No messages yet.", icon: MessagesSquare, action: { label: "Open inbox", to: "/dashboard/messages" } },
    ],
  },

  [ROLES.DOCTOR]: {
    label: "Clinician",
    subtitle: "Your bookings, your patients, and everything waiting on a reply.",
    cta: { label: "Open inbox", to: "/dashboard/messages", icon: MessagesSquare },
    nav: [
      { id: "home", label: "Overview", to: "/dashboard", end: true, icon: LayoutDashboard },
      { id: "appointments", label: "Appointments", to: "/dashboard/appointments", icon: CalendarCheck },
      { id: "patients", label: "My Patients", to: "/dashboard/patients", icon: Users },
      { id: "inbox", label: "Inbox", to: "/dashboard/messages", icon: MessagesSquare },
      { id: "profile", label: "Profile", to: "/profile", icon: UserCog },
    ],
    stats: [
      { id: "queue", label: "Booking requests", value: 0, icon: MessagesSquare, hint: "Awaiting your confirmation" },
      { id: "today", label: "Appointments today", value: 0, icon: CalendarCheck, hint: "Pending and confirmed" },
      { id: "patients", label: "Patients", value: 0, icon: Users, hint: "Active in your care" },
    ],
    sections: [
      { id: "appointments", title: "Latest appointments", empty: "No appointments yet.", icon: CalendarCheck, action: { label: "View all", to: "/dashboard/appointments" } },
      { id: "queue", title: "Booking requests", empty: "No new requests.", icon: MessagesSquare, action: { label: "Review bookings", to: "/dashboard/appointments" } },
    ],
  },

  [ROLES.ADMIN]: {
    label: "Administrator",
    subtitle: "Users, approvals, and the health of the platform.",
    cta: { label: "Verify doctors", to: "/dashboard/verify-doctors", icon: BadgeCheck },
    nav: [
      { id: "home", label: "Overview", to: "/dashboard", end: true, icon: LayoutDashboard },
      { id: "verify-doctors", label: "Verify Doctors", to: "/dashboard/verify-doctors", icon: BadgeCheck },
      { id: "users", label: "Users", to: "/dashboard/admin/users", icon: Users },
      { id: "messages", label: "Messages", to: "/dashboard/messages", icon: MessagesSquare },
      { id: "audit", label: "Audit log", to: "/dashboard/admin/audit", icon: ShieldCheck },
    ],
    stats: [
      { id: "users", label: "Total users", value: 0, icon: Users, hint: "All accounts" },
      { id: "clinicians", label: "Verified clinicians", value: 0, icon: Stethoscope, hint: "Approved providers" },
      { id: "unverified", label: "Awaiting review", value: 0, icon: BadgeCheck, hint: "Doctor registrations" },
      { id: "online", label: "Online now", value: 0, icon: Activity, hint: "Live socket count" },
    ],
    sections: [
      { id: "signups", title: "Recent sign-ups", empty: "No new accounts.", icon: Users, action: { label: "Manage users", to: "/dashboard/admin/users" } },
      { id: "audit", title: "Audit highlights", empty: "Nothing flagged.", icon: ShieldCheck, action: { label: "Audit log", to: "/dashboard/admin/audit" } },
    ],
  },
};

export const getDashboardConfig = (role) =>
  DASHBOARD_CONFIG[role] ?? DASHBOARD_CONFIG[ROLES.PATIENT];
