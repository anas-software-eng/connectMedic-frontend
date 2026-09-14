import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Frown,
  Moon,
  Send,
  Sparkles,
  Stethoscope,
  Thermometer,
  TriangleAlert,
} from "lucide-react";
import { useAssistantStore } from "../store/useAssistantStore";
import { useAuthStore } from "../store/useAuthStore";
import { formatSpec } from "../lib/utils";

const EXAMPLE_PROMPTS = [
  {
    label: "Fever & headache",
    icon: Thermometer,
    text: "I've had a headache and mild fever since yesterday",
  },
  {
    label: "Skin irritation",
    icon: Frown,
    text: "My skin has an itchy red rash on my arm",
  },
  {
    label: "Sleep & anxiety",
    icon: Moon,
    text: "I've been feeling anxious and can't sleep well",
  },
];

const AssistantAvatar = () => (
  <div className="chat-image avatar">
    <div className="size-9 rounded-full bg-primary/15 flex items-center justify-center">
      <Sparkles className="size-4 text-primary" />
    </div>
  </div>
);

const TypingDots = () => (
  <span className="inline-flex items-center gap-1">
    <span className="size-1.5 rounded-full bg-current opacity-60 animate-bounce [animation-delay:-0.3s]" />
    <span className="size-1.5 rounded-full bg-current opacity-60 animate-bounce [animation-delay:-0.15s]" />
    <span className="size-1.5 rounded-full bg-current opacity-60 animate-bounce" />
  </span>
);

const AiAssistantPage = () => {
  const { messages, isSending, suggestedSpecializations, sendMessage } = useAssistantStore();
  const { authUser } = useAuthStore();
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || isSending) return;
    sendMessage(text);
    setText("");
  };

  return (
    <div className="bg-base-100 border border-base-300/70 rounded-2xl shadow-sm flex flex-col h-[calc(100vh-16rem)] min-h-[32rem] overflow-hidden">
      <div className="p-4 border-b border-base-300/70 bg-gradient-to-b from-primary/[0.06] to-transparent flex items-start gap-3">
        <div className="size-11 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 cm-pulse">
          <Sparkles className="size-5 text-primary" />
        </div>
        <div className="min-w-0">
          <h1 className="font-semibold text-lg">AI Health Assistant</h1>
          <p className="text-sm text-base-content/72 flex items-start gap-1.5 mt-0.5">
            <TriangleAlert className="size-4 shrink-0 mt-0.5 text-warning" />
            Not a diagnosis. For a medical emergency, call your local emergency number.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" aria-live="polite">
        {messages.length === 0 && (
          <div className="max-w-lg mx-auto text-center py-6 space-y-5">
            <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <Sparkles className="size-7 text-primary" />
            </div>
            <p className="text-base-content/80">
              Describe what you&apos;re feeling, and I&apos;ll help you figure out which kind of
              doctor to see.
            </p>
            <div className="grid gap-2.5 sm:grid-cols-3 cm-stagger">
              {EXAMPLE_PROMPTS.map(({ label, icon: Icon, text: prompt }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="group flex flex-col items-center gap-2 rounded-2xl border border-base-300/70 bg-base-100 p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  <span className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-content transition-colors">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="chat chat-end cm-settle">
              <div className="chat-image avatar">
                <div className="size-9 rounded-full">
                  <img src={authUser?.profilePic || "/avatar.png"} alt="You" />
                </div>
              </div>
              <div className="chat-bubble chat-bubble-primary">{m.content}</div>
            </div>
          ) : (
            <div key={i} className="chat chat-start cm-settle">
              <AssistantAvatar />
              <div className="chat-bubble">{m.content}</div>
            </div>
          )
        )}

        {isSending && (
          <div className="chat chat-start">
            <AssistantAvatar />
            <div className="chat-bubble flex items-center gap-2 text-base-content/72">
              <span className="sr-only">Assistant is typing</span>
              <TypingDots />
            </div>
          </div>
        )}

        {suggestedSpecializations.length > 0 && (
          <div className="pl-12 space-y-2 cm-settle">
            <p className="text-xs font-medium text-base-content/65">Based on what you described:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedSpecializations.map((spec) => (
                <Link
                  key={spec}
                  to={`/dashboard/find-doctors?specialization=${encodeURIComponent(spec)}`}
                  className="btn btn-sm btn-primary gap-1.5"
                >
                  <Stethoscope className="size-4" />
                  Find a {formatSpec(spec)}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-base-300/70 flex items-center gap-2">
        <label htmlFor="assistant-text" className="sr-only">
          Describe your symptoms
        </label>
        <input
          id="assistant-text"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe your symptoms..."
          className="input input-bordered flex-1"
          disabled={isSending}
          maxLength={2000}
        />
        <button
          type="submit"
          className="btn btn-primary btn-circle"
          disabled={isSending || !text.trim()}
          aria-label="Send"
        >
          <Send className="size-5" />
        </button>
      </form>
    </div>
  );
};

export default AiAssistantPage;
