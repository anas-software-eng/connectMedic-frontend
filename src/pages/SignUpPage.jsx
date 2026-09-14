import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, HeartPulse, Loader2, Lock, Mail, ShieldCheck, Stethoscope, User } from "lucide-react";
import { Link } from "react-router-dom";

import AuthImagePattern from "../components/AuthImagePattern";
import BackButton from "../components/BackButton";
import toast from "react-hot-toast";

const ROLE_COPY = {
  patient: {
    label: "Patient",
    icon: HeartPulse,
    heading: "Create your patient account",
    subheading: "Free for patients. Connect with your care team today.",
    namePlaceholder: "Jordan Reyes",
    emailPlaceholder: "you@example.com",
    nameLabel: "Full Name",
    note: "Your health information is encrypted and never shared without your consent.",
    panelTitle: "Care that stays connected",
    panelSubtitle:
      "Message your clinicians, review results, and manage refills - all in one secure place.",
  },
  doctor: {
    label: "Doctor",
    icon: Stethoscope,
    heading: "Create your clinician account",
    subheading: "Join your practice and start caring for patients online.",
    namePlaceholder: "Dr. Alex Morgan",
    emailPlaceholder: "you@clinic.com",
    nameLabel: "Full Name",
    note: "Clinician accounts are verified before you gain access to patient records.",
    panelTitle: "Built for your practice",
    panelSubtitle:
      "Review your patient list, respond to messages, and manage consults from one dashboard.",
  },
};

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "patient",
  });

  const copy = ROLE_COPY[formData.role];
  const RoleIcon = copy.icon;

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) signup(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="relative flex flex-col justify-center items-center p-6 sm:p-12">
        <BackButton to="/" label="Home" className="absolute top-6 left-6" />
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"
              >
                <RoleIcon className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">{copy.heading}</h1>
              <p className="text-base-content/60">{copy.subheading}</p>
            </div>
          </div>

          {/* ROLE TOGGLE */}
          <div role="tablist" className="tabs tabs-boxed bg-base-200 p-1">
            {Object.entries(ROLE_COPY).map(([role, { label, icon: Icon }]) => (
              <button
                key={role}
                type="button"
                role="tab"
                aria-selected={formData.role === role}
                className={`tab flex-1 gap-2 transition-colors ${
                  formData.role === role ? "tab-active" : ""
                }`}
                onClick={() => setFormData({ ...formData, role })}
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label" htmlFor="signup-name">
                <span className="label-text font-medium">{copy.nameLabel}</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/65" />
                </div>
                <input
                  id="signup-name"
                  type="text"
                  autoComplete="name"
                  className={`input input-bordered w-full pl-10`}
                  placeholder={copy.namePlaceholder}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label" htmlFor="signup-email">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/65" />
                </div>
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder={copy.emailPlaceholder}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label" htmlFor="signup-password">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/65" />
                </div>
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/65" />
                  ) : (
                    <Eye className="size-5 text-base-content/65" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="flex items-start gap-2 text-xs text-base-content/60">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>{copy.note}</span>
          </div>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}

      <AuthImagePattern
        title={copy.panelTitle}
        subtitle={copy.panelSubtitle}
      />
    </div>
  );
};
export default SignUpPage;
