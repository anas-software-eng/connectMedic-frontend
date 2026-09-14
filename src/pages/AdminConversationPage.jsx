import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Eye, Loader2 } from "lucide-react";
import { useAdminStore } from "../store/useAdminStore";
import BackButton from "../components/BackButton";
import { formatMessageTime } from "../lib/utils";

// Read-only — admins can see what was said, but never send, edit, or mark
// anything as seen here. Opening this page is itself logged to the audit trail.
const AdminConversationPage = () => {
  const { userAId, userBId } = useParams();
  const { conversationView, isFetchingConversation, fetchConversation } = useAdminStore();

  useEffect(() => {
    fetchConversation(userAId, userBId);
  }, [userAId, userBId, fetchConversation]);

  if (isFetchingConversation || !conversationView) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  const { userA, userB, messages } = conversationView;

  return (
    <div className="space-y-4">
      <BackButton to="/dashboard/admin/appointments" label="Back to appointments" />

      <div className="bg-warning/10 border border-warning/30 rounded-2xl px-4 py-3 flex items-center gap-2 text-sm text-warning-content">
        <Eye className="size-4 shrink-0 text-warning" />
        <span>
          Read-only oversight view between <strong>{userA.fullName}</strong> and{" "}
          <strong>{userB.fullName}</strong>. This visit is recorded in the audit log.
        </span>
      </div>

      <div className="bg-base-100 border border-base-300/70 rounded-2xl shadow-sm p-4 space-y-4 min-h-[24rem]">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-base-content/72 py-10">
            No messages between these two people yet.
          </p>
        ) : (
          messages.map((m) => {
            const isFromA = m.senderId === userA._id;
            return (
              <div key={m._id} className={`chat ${isFromA ? "chat-start" : "chat-end"}`}>
                <div className="chat-header mb-1 text-xs text-base-content/65">
                  {isFromA ? userA.fullName : userB.fullName} · {formatMessageTime(m.createdAt)}
                </div>
                <div className="chat-bubble flex flex-col">
                  {m.image && (
                    <img src={m.image} alt="Attachment" className="sm:max-w-[200px] rounded-md mb-2" />
                  )}
                  {m.text && <p>{m.text}</p>}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminConversationPage;
