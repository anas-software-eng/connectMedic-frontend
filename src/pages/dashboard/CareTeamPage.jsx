import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Search, Users } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";

// Directory of people you can message — scoped server-side to your actual
// care team (booked doctors for a patient, booked patients for a doctor).
// Picking someone here is the only way a conversation is opened.
const CareTeamPage = () => {
  const { getConversations, conversations, isConversationsLoading, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);

  useEffect(() => {
    getConversations();
  }, [getConversations]);

  const visible = conversations
    .filter((c) => (availableOnly ? onlineUsers.includes(c._id) : true))
    .filter((c) => c.fullName.toLowerCase().includes(query.trim().toLowerCase()));

  const openChat = (user) => {
    setSelectedUser(user);
    navigate("/dashboard/messages");
  };

  return (
    <div className="space-y-5">
      <div className="bg-base-100 border border-base-300/70 rounded-2xl shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2 font-semibold">
            <Users className="size-5 text-primary" />
            Care Team
          </div>

          <label className="input input-bordered input-sm flex items-center gap-2 flex-1 rounded-xl">
            <Search className="size-4 text-base-content/65" />
            <input
              type="text"
              className="grow"
              placeholder="Search by name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>

          <label className="cursor-pointer flex items-center gap-2 text-sm whitespace-nowrap">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            Available now
            <span className="text-xs text-base-content/65">
              ({Math.max(onlineUsers.length - 1, 0)})
            </span>
          </label>
        </div>
      </div>

      {isConversationsLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-base-100 border border-base-300/70 animate-pulse" />
          ))}
        </div>
      ) : visible.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((c) => {
            const isOnline = onlineUsers.includes(c._id);
            return (
              <button
                key={c._id}
                onClick={() => openChat(c)}
                className="group text-left bg-base-100 border border-base-300/70 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-primary/40 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={c.profilePic || "/avatar.png"}
                      alt={c.fullName}
                      className="size-12 rounded-full object-cover"
                    />
                    <span
                      className={`absolute bottom-0 right-0 size-3 rounded-full ring-2 ring-base-100 ${
                        isOnline ? "bg-success" : "bg-base-300"
                      }`}
                    />
                    {c.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[1.1rem] h-[1.1rem] px-1 rounded-full bg-primary text-primary-content text-[10px] font-bold flex items-center justify-center">
                        {c.unreadCount > 9 ? "9+" : c.unreadCount}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{c.fullName}</div>
                    <div className="text-xs text-base-content/72 truncate">
                      {c.lastMessage
                        ? `${c.lastMessageFromMe ? "You: " : ""}${c.lastMessage}`
                        : isOnline
                          ? "Available now"
                          : "No messages yet"}
                    </div>
                  </div>
                </div>

                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary opacity-80 group-hover:opacity-100 transition-opacity">
                  <MessageSquare className="size-3.5" />
                  {c.lastMessage ? "Continue conversation" : "Start a conversation"}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="bg-base-100 border border-base-300/70 rounded-2xl shadow-sm px-6 py-14 text-center">
          <p className="text-sm text-base-content/72">
            {query
              ? `No one matches "${query}".`
              : "Your care team shows up here once you have a booked appointment."}
          </p>
        </div>
      )}
    </div>
  );
};
export default CareTeamPage;
