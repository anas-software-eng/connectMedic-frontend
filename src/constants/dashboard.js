import {
  Activity,
  CalendarCheck,
  ClipboardList,
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
    subtitle: "Your care, your record, your questions — all in one place.",
    cta: { label: "Message care team", to: "/dashboard/care-team", icon: MessagesSquare },
    nav: [
      { id: "home", label: "Overview", to: "/dashboard", end: true, icon: LayoutDashboard },
      { id: "care-team", label: "Care Team", to: "/dashboard/care-team", icon: Users },
      { id: "messages", label: "Messages", to: "/dashboard/messages", icon: MessagesSquare },
      { id: "records", label: "Records", to: "/dashboard/records", icon: FileHeart },
      { id: "profile", label: "Profile", to: "/profile", icon: UserCog },
    ],
    stats: [
      { id: "unread", label: "Unread messages", value: 0, icon: MessagesSquare, hint: "From your care team" },
      { id: "appointments", label: "Upcoming visits", value: 0, icon: CalendarCheck, hint: "Next 30 days" },
      { id: "results", label: "New results", value: 0, icon: FileHeart, hint: "Labs and imaging" },
    ],
    sections: [
      { id: "appointments", title: "Upcoming appointments", empty: "No appointments scheduled.", icon: CalendarCheck, action: { label: "Book a visit", to: "/dashboard/records" } },
      { id: "messages", title: "Recent messages", empty: "No messages yet.", icon: MessagesSquare, action: { label: "Open inbox", to: "/dashboard/messages" } },
    ],
  },

  [ROLES.DOCTOR]: {
    label: "Clinician",
    subtitle: "Your panel, your queue, and everything waiting on a reply.",
    cta: { label: "Open inbox", to: "/dashboard/messages", icon: MessagesSquare },
    nav: [
      { id: "home", label: "Overview", to: "/dashboard", end: true, icon: LayoutDashboard },
      { id: "care-team", label: "Care Team", to: "/dashboard/care-team", icon: Users },
      { id: "inbox", label: "Inbox", to: "/dashboard/messages", icon: MessagesSquare },
      { id: "patients", label: "Patients", to: "/dashboard/patients", icon: Stethoscope },
      { id: "schedule", label: "Schedule", to: "/dashboard/schedule", icon: CalendarCheck },
      { id: "profile", label: "Profile", to: "/profile", icon: UserCog },
    ],
    stats: [
      { id: "queue", label: "Messages to answer", value: 0, icon: MessagesSquare, hint: "Oldest first" },
      { id: "patients", label: "Patients on panel", value: 0, icon: Users, hint: "Assigned to you" },
      { id: "today", label: "Visits today", value: 0, icon: CalendarCheck, hint: "In-person and virtual" },
      { id: "orders", label: "Orders pending", value: 0, icon: ClipboardList, hint: "Awaiting sign-off" },
    ],
    sections: [
      { id: "queue", title: "Message queue", empty: "Inbox is clear.", icon: MessagesSquare, action: { label: "Open inbox", to: "/dashboard/messages" } },
      { id: "schedule", title: "Today's schedule", empty: "Nothing scheduled today.", icon: CalendarCheck, action: { label: "Full schedule", to: "/dashboard/schedule" } },
      { id: "results", title: "Results to review", empty: "No results waiting.", icon: FileHeart },
    ],
  },

  [ROLES.ADMIN]: {
    label: "Administrator",
    subtitle: "Users, access, and the health of the platform.",
    cta: { label: "Manage users", to: "/dashboard/admin/users", icon: Users },
    nav: [
      { id: "home", label: "Overview", to: "/dashboard", end: true, icon: LayoutDashboard },
      { id: "users", label: "Users", to: "/dashboard/admin/users", icon: Users },
      { id: "audit", label: "Audit log", to: "/dashboard/admin/audit", icon: ShieldCheck },
      { id: "care-team", label: "Care Team", to: "/dashboard/care-team", icon: Users },
      { id: "messages", label: "Messages", to: "/dashboard/messages", icon: MessagesSquare },
    ],
    stats: [
      { id: "users", label: "Total users", value: 0, icon: Users, hint: "All accounts" },
      { id: "clinicians", label: "Clinicians", value: 0, icon: Stethoscope, hint: "Verified providers" },
      { id: "online", label: "Online now", value: 0, icon: Activity, hint: "Live socket count" },
      { id: "flags", label: "Access reviews", value: 0, icon: ShieldCheck, hint: "Due this quarter" },
    ],
    sections: [
      { id: "signups", title: "Recent sign-ups", empty: "No new accounts.", icon: Users, action: { label: "Manage users", to: "/dashboard/admin/users" } },
      { id: "audit", title: "Audit highlights", empty: "Nothing flagged.", icon: ShieldCheck, action: { label: "Audit log", to: "/dashboard/admin/audit" } },
    ],
  },
};

export const getDashboardConfig = (role) =>
  DASHBOARD_CONFIG[role] ?? DASHBOARD_CONFIG[ROLES.PATIENT];
