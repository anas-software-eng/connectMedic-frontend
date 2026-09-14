import { useNavigate } from "react-router-dom";
import { Phone, PhoneOff, Video } from "lucide-react";
import { useCallStore } from "../store/useCallStore";
import { useChatStore } from "../store/useChatStore";

// Rendered once at the app root so an incoming call can be answered from any
// page — not just while the caller and callee both happen to be on the
// video call screen already.
const IncomingCallBanner = () => {
  const { incomingCall, acceptIncomingCall, declineIncomingCall } = useCallStore();
  const { conversations } = useChatStore();
  const navigate = useNavigate();

  if (!incomingCall) return null;

  const callerName = conversations.find((c) => c._id === incomingCall.from)?.fullName || "Someone";

  const handleAccept = async () => {
    await acceptIncomingCall();
    navigate(`/dashboard/call/${incomingCall.from}`);
  };

  return (
    <div
      role="alertdialog"
      aria-label={`Incoming video call from ${callerName}`}
      className="fixed top-20 inset-x-0 z-50 flex justify-center px-4"
    >
      <div className="bg-base-100 border border-primary/30 rounded-2xl shadow-xl px-5 py-4 flex items-center gap-4 cm-settle">
        <div className="size-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Video className="size-5 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold truncate">{callerName}</p>
          <p className="text-sm text-base-content/72">Incoming video call</p>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <button
            type="button"
            onClick={declineIncomingCall}
            aria-label="Decline call"
            className="btn btn-circle btn-sm btn-error"
          >
            <PhoneOff className="size-4" />
          </button>
          <button
            type="button"
            onClick={handleAccept}
            aria-label="Accept call"
            className="btn btn-circle btn-sm btn-success"
          >
            <Phone className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallBanner;
