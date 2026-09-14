import { Video, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const lastSeenLabel = (lastSeenAt) => {
  if (!lastSeenAt) return "Offline";
  const minutes = Math.round((Date.now() - new Date(lastSeenAt).getTime()) / 60000);
  if (minutes < 1) return "Last seen just now";
  if (minutes < 60) return `Last seen ${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `Last seen ${hours}h ago`;
  return `Last seen ${Math.round(hours / 24)}d ago`;
};

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, typingFrom } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const navigate = useNavigate();

  const isOnline = onlineUsers.includes(selectedUser._id);
  const isTyping = typingFrom === selectedUser._id;

  return (
    <div className="p-3 border-b border-base-300/70">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
              {isOnline && (
                <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-success ring-2 ring-base-100" />
              )}
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="font-medium truncate">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/72" aria-live="polite">
              {isTyping ? (
                <span className="text-primary font-medium">Typing…</span>
              ) : isOnline ? (
                "Online"
              ) : (
                lastSeenLabel(selectedUser.lastSeenAt)
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            className="btn btn-ghost btn-sm gap-1.5"
            onClick={() => navigate(`/dashboard/call/${selectedUser._id}`)}
            aria-label={`Start a video call with ${selectedUser.fullName}`}
          >
            <Video className="size-4" />
            <span className="hidden sm:inline">Call</span>
          </button>
          <Link to="/dashboard/care-team" className="btn btn-ghost btn-sm">
            Care team
          </Link>
          <button
            onClick={() => setSelectedUser(null)}
            className="btn btn-ghost btn-sm btn-square"
            aria-label="Close conversation"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;
