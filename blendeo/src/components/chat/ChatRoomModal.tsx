import MainChatArea from "./MainChatArea";
import ContactSidebar from "./ContactSidebar";

interface ChatAppProps {
  chatWindowOpened: boolean;
  setChatWindowOpened: (opened: boolean) => void;
}

const ChatApp = ({ chatWindowOpened, setChatWindowOpened }: ChatAppProps) => {
  return (
    <div className="flex h-[calc(100vh-theme(space.24))] w-full bg-background rounded-lg shadow-sm pt-3">
      {/* Main Chat Area */}
      <div className="flex-1 pt-5">
        {chatWindowOpened && (
          <MainChatArea setChatWindowOpened={setChatWindowOpened} />
        )}
      </div>

      {/* Contacts Sidebar - 오른쪽에 배치 */}
      <ContactSidebar setChatWindowOpened={setChatWindowOpened} />
    </div>
  );
};

export default ChatApp;
