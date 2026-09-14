import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, Check, CheckCheck, Loader2, TriangleAlert } from "lucide-react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const NEAR_BOTTOM_PX = 80;
const NEAR_TOP_PX = 60;

const dayLabel = (iso) => {
  const d = new Date(iso);
  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const sameDay = (a, b) => a.toDateString() === b.toDateString();

  if (sameDay(d, now)) return "Today";
  if (sameDay(d, yesterday)) return "Yesterday";
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

// Splits the flat message list into { label, messages[] } runs so the
// thread reads like a real chat app instead of one long undated scroll.
const groupByDay = (messages) => {
  const groups = [];
  for (const message of messages) {
    const label = dayLabel(message.createdAt);
    const last = groups[groups.length - 1];
    if (last?.label === label) last.messages.push(message);
    else groups.push({ label, messages: [message] });
  }
  return groups;
};

const MessageTick = ({ message }) => {
  if (message.status === "sending") return <Loader2 className="size-3 animate-spin" />;
  if (message.status === "failed") {
    return (
      <span className="flex items-center gap-1 text-error">
        <TriangleAlert className="size-3" /> Failed
      </span>
    );
  }
  return message.seenAt ? (
    <CheckCheck className="size-3.5 text-primary" aria-label="Seen" />
  ) : (
    <Check className="size-3.5" aria-label="Sent" />
  );
};

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    loadOlderMessages,
    hasMoreMessages,
    isLoadingOlder,
    isMessagesLoading,
    selectedUser,
  } = useChatStore();
  const { authUser } = useAuthStore();

  const scrollRef = useRef(null);
  const bottomRef = useRef(null);
  const shouldAutoScroll = useRef(true);
  const prevScrollHeight = useRef(0);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  useEffect(() => {
    getMessages(selectedUser._id);
    shouldAutoScroll.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser._id]);

  useEffect(() => {
    if (shouldAutoScroll.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Prepending older messages shifts scroll position — restore it relative
  // to where the reader was instead of yanking them to the very top.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !prevScrollHeight.current) return;
    el.scrollTop += el.scrollHeight - prevScrollHeight.current;
    prevScrollHeight.current = 0;
  }, [messages]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    shouldAutoScroll.current = distanceFromBottom < NEAR_BOTTOM_PX;
    setShowScrollToBottom(distanceFromBottom >= NEAR_BOTTOM_PX);

    if (el.scrollTop < NEAR_TOP_PX && hasMoreMessages && !isLoadingOlder) {
      prevScrollHeight.current = el.scrollHeight;
      loadOlderMessages();
    }
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  const groups = groupByDay(messages);

  return (
    <div className="flex-1 flex flex-col overflow-auto min-w-0">
      <ChatHeader />

      <div className="relative flex-1 overflow-y-auto" ref={scrollRef} onScroll={handleScroll}>
        <div className="p-4 space-y-4" aria-live="polite">
          {isLoadingOlder && (
            <div className="flex justify-center py-2">
              <Loader2 className="size-4 animate-spin text-base-content/60" />
            </div>
          )}

          {groups.map((group) => (
            <div key={group.label} className="space-y-4">
              <div className="flex items-center justify-center">
                <span className="text-xs font-medium text-base-content/65 bg-base-200 rounded-full px-3 py-1">
                  {group.label}
                </span>
              </div>

              {group.messages.map((message) => {
                const isMine = message.senderId === authUser._id;
                return (
                  <div key={message._id} className={`chat ${isMine ? "chat-end" : "chat-start"}`}>
                    <div className="chat-image avatar">
                      <div className="size-10 rounded-full border">
                        <img
                          src={
                            isMine
                              ? authUser.profilePic || "/avatar.png"
                              : selectedUser.profilePic || "/avatar.png"
                          }
                          alt="profile pic"
                        />
                      </div>
                    </div>
                    <div className="chat-header mb-1">
                      <time className="text-xs text-base-content/65 ml-1">
                        {formatMessageTime(message.createdAt)}
                      </time>
                    </div>
                    <div
                      className={`chat-bubble flex flex-col ${
                        message.status === "failed" ? "opacity-60" : ""
                      }`}
                    >
                      {message.image && (
                        <img
                          src={message.image}
                          alt="Attachment"
                          className="sm:max-w-[200px] rounded-md mb-2"
                        />
                      )}
                      {message.text && <p>{message.text}</p>}
                    </div>
                    {isMine && (
                      <div className="chat-footer mt-1 text-xs opacity-80">
                        <MessageTick message={message} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          <div ref={bottomRef} />
        </div>

        {showScrollToBottom && (
          <button
            type="button"
            onClick={scrollToBottom}
            aria-label="Scroll to latest message"
            className="btn btn-circle btn-sm btn-primary absolute bottom-4 right-4 shadow-lg"
          >
            <ArrowDown className="size-4" />
          </button>
        )}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
