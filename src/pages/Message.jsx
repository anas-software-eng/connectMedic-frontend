import { useChatStore } from "../store/useChatStore";

import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

// Conversation only. The contact list lives on its own Care Team page.
const Message = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="bg-base-100 border border-base-300/70 rounded-2xl shadow-sm h-[calc(100vh-20rem)] min-h-[30rem] overflow-hidden">
      <div className="flex h-full">
        {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
      </div>
    </div>
  );
};
export default Message;

