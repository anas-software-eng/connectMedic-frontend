import { Link } from "react-router-dom";
import {
  Activity,
  CalendarCheck,
  ClipboardList,
  FileHeart,
  HeartPulse,
  Lock,
  MessagesSquare,
  ShieldCheck,
  Stethoscope,
  Video,
} from "lucide-react";

const LandingPage = () => {
  const features = [
    {
      icon: <MessagesSquare className="w-6 h-6" />,
      title: "Message Your Care Team",
      description:
        "Ask follow-up questions, report symptoms, and get answers from your clinicians without another waiting room.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "HIPAA-Aligned Security",
      description:
        "Every message is encrypted in transit and at rest, with audit trails on all access to your record.",
    },
    {
      icon: <FileHeart className="w-6 h-6" />,
      title: "Results & Records",
      description:
        "Share lab results, imaging, and visit summaries in the same thread as the conversation about them.",
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: "Telehealth Ready",
      description:
        "Move from a chat to a virtual visit when your provider decides a face-to-face check is needed.",
    },
    {
      icon: <CalendarCheck className="w-6 h-6" />,
      title: "Appointments & Refills",
      description:
        "Request visits, prescription refills, and referrals, and track where each request stands.",
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Care Continuity",
      description:
        "Your whole care team - primary, specialist, and nursing staff - works from one shared thread.",
    },
  ];

  const steps = [
    {
      icon: <ClipboardList className="w-6 h-6" />,
      title: "Create your patient profile",
      description: "Verify your identity and connect to your clinic in a couple of minutes.",
    },
    {
      icon: <Stethoscope className="w-6 h-6" />,
      title: "Reach your care team",
      description: "Start a secure thread with the provider or department you need.",
    },
    {
      icon: <HeartPulse className="w-6 h-6" />,
      title: "Stay on top of your care",
      description: "Follow up on results, plans, and medications between visits.",
    },
  ];

  const stats = [
    { value: "24/7", label: "Secure inbox access" },
    { value: "< 2 hrs", label: "Median clinician reply" },
    { value: "256-bit", label: "Encryption in transit" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero min-h-screen bg-gradient-to-b from-base-200 to-base-100 pt-16">
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <HeartPulse className="w-8 h-8 text-primary" />
              </div>
            </div>

            <div className="badge badge-primary badge-outline gap-2 mb-6 py-3">
              <Lock className="w-3 h-3" />
              HIPAA-aligned, encrypted messaging
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              Care that keeps talking
              <span className="text-primary"> between visits</span>
            </h1>
            <p className="text-lg text-base-content/70 mb-8 max-w-2xl mx-auto">
              ConnectMedic gives patients and clinicians one secure place to share symptoms,
              results, and care plans - so nothing important waits for the next appointment.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn btn-primary btn-lg">
                Create Patient Account
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">
                Sign In
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-xl bg-base-100 border border-base-300 p-4">
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-base-content/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Built for clinical conversations</h2>
          <p className="text-center text-base-content/70 mb-12 max-w-2xl mx-auto">
            Not another chat app. ConnectMedic is designed around how care teams actually
            communicate with the people they treat.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="card bg-base-200 border border-base-300 hover:shadow-lg transition-shadow"
              >
                <div className="card-body">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                    {feature.icon}
                  </div>
                  <h3 className="card-title text-lg">{feature.title}</h3>
                  <p className="text-base-content/70">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">How it works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.title} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary text-primary-content flex items-center justify-center mx-auto mb-4">
                  {step.icon}
                </div>
                <div className="text-sm font-semibold text-primary mb-1">Step {index + 1}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-base-content/70">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency notice */}
      <div className="py-10 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="alert alert-warning max-w-4xl mx-auto">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <span>
              <strong>Not for emergencies.</strong> If you are having a medical emergency, call
              your local emergency number or go to the nearest emergency department.
            </span>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-base-200">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to connect with your care team?</h2>
          <p className="text-lg text-base-content/70 mb-8 max-w-xl mx-auto">
            Join the patients and clinicians already coordinating care on ConnectMedic. Free for
            patients, always.
          </p>
          <Link to="/signup" className="btn btn-primary btn-lg">
            Get Started
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-300 text-base-content">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-primary" />
          <p className="font-bold">ConnectMedic</p>
        </div>
        <div>
          <p className="max-w-xl text-sm text-base-content/70">
            ConnectMedic supports communication with your care team. It does not provide medical
            advice, diagnosis, or treatment, and is not a substitute for emergency care.
          </p>
        </div>
        <div>
          <p>© {new Date().getFullYear()} ConnectMedic. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
