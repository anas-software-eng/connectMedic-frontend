import { Link } from "react-router-dom";
import {
  BellRing,
  ClipboardList,
  HeartPulse,
  Lock,
  MessagesSquare,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  Video,
} from "lucide-react";

const LandingPage = () => {
  const features = [
    {
      icon: <Stethoscope className="w-6 h-6" />,
      title: "Find the Right Doctor",
      description:
        "Search by specialization or just describe a symptom - \"chest pain\" or \"skin rash\" - and we'll surface the right specialists, with ratings and fees up front.",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI Health Assistant",
      description:
        "Not sure what's wrong? Describe how you feel to our AI triage assistant, 24/7, and get pointed toward the right kind of doctor to book.",
    },
    {
      icon: <MessagesSquare className="w-6 h-6" />,
      title: "Real-Time Secure Messaging",
      description:
        "Message your care team directly - typing indicators, read receipts, and photo sharing, all in one encrypted thread per doctor.",
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: "Free Video Consultations",
      description:
        "Start a face-to-face video call with your doctor or patient straight from the chat or an appointment - no extra app, no extra cost.",
    },
    {
      icon: <BellRing className="w-6 h-6" />,
      title: "Reminders & Live Notifications",
      description:
        "Get notified the moment a booking is confirmed, a message arrives, or your visit is coming up - nothing falls through the cracks.",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Ratings You Can Trust",
      description:
        "Every review comes from a patient with a completed visit - browse real feedback before you book, and leave your own after.",
    },
  ];

  const steps = [
    {
      icon: <ClipboardList className="w-6 h-6" />,
      title: "Create your account",
      description: "Sign up as a patient or a doctor in a couple of minutes.",
    },
    {
      icon: <Stethoscope className="w-6 h-6" />,
      title: "Find your doctor",
      description: "Search by symptom or specialty, compare ratings and fees, and check live availability.",
    },
    {
      icon: <HeartPulse className="w-6 h-6" />,
      title: "Book, chat, and follow up",
      description: "Pick a time slot, message or video call your doctor, and get reminders until it's done.",
    },
  ];

  const stats = [
    { value: "24/7", label: "AI-assisted symptom triage" },
    { value: "100%", label: "Admin-verified doctor profiles" },
    { value: "$0", label: "Cost for video consultations" },
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
              From symptom to specialist,
              <span className="text-primary"> all in one place</span>
            </h1>
            <p className="text-lg text-base-content/70 mb-8 max-w-2xl mx-auto">
              Not sure who to see? Ask our AI health assistant. Know exactly who you need?
              Search, compare ratings, and book in seconds - then message or video call
              your doctor and get reminded before every visit.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn btn-primary btn-lg">
                Find a Doctor
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">
                Sign In
              </Link>
            </div>

            <div className="mt-4 text-sm text-base-content/60">
              Are you a doctor?{" "}
              <Link to="/signup" className="link link-primary">
                Register your practice
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
          <h2 className="text-4xl font-bold text-center mb-4">Everything a visit needs, built in</h2>
          <p className="text-center text-base-content/70 mb-12 max-w-2xl mx-auto">
            Not another chat app. ConnectMedic covers the whole loop - finding the right
            doctor, booking, talking to them, and following up - in one place.
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
          <h2 className="text-4xl font-bold mb-4">Book your next visit in minutes</h2>
          <p className="text-lg text-base-content/70 mb-8 max-w-xl mx-auto">
            Join the patients and clinicians already coordinating care on
            ConnectMedic. Free for patients, always.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/signup" className="btn btn-primary btn-lg">
              Get Started
            </Link>
            <Link to="/signup" className="btn btn-outline btn-lg">
              Register as a doctor
            </Link>
          </div>
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
