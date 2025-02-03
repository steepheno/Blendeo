import * as React from "react";
import { Header } from "./Header";
import { Message } from "./Message";
import { Input } from "./Input";
import { MessageProps, UserProps } from "@/types/components/chat/chat";

interface ChatWindowProps {
  user: UserProps;
  onClose: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ user, onClose }) => {
  const [messages, setMessages] = React.useState<MessageProps[]>([
    {
      avatar: user.imageUrl,
      sender: user.name,
      time: "11:45 AM",
      content: user.message || "Hey there!",
      isUser: false,
    },
    {
      sender: "Me",
      time: "11:46 AM",
      content: "Sure thing! Message me when you're ready to be reminded.",
      isUser: true,
    },
  ]);

  const handleSend = (message: string) => {
    setMessages([
      ...messages,
      {
        sender: "Me",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        content: message,
        isUser: true,
      },
    ]);

    // 상대방의 자동 응답을 시뮬레이션 (실제로는 서버에서 처리해야 함)
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          avatar: user.imageUrl,
          sender: user.name,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          content: "Thanks for your message!",
          isUser: false,
        },
      ]);
    }, 1000);
  };

  return (
    <div
      className="flex flex-col p-2 mx-auto my-0 bg-white rounded-xl border border-gray-100 border-solid shadow-[0px_4px_4px_rgba(0,0,0,0.25)] w-[667px] max-sm:w-full"
      role="main"
      aria-label="Chat window"
    >
      <Header
        title={user.name}
        onBack={onClose}
        onVideo={() => {}}
        onMenu={() => {}}
        avatar={user.imageUrl}
        isOnline={user.isOnline}
      />
      <div
        className="flex flex-col flex-1 p-4 overflow-y-auto max-h-[600px]"
        role="list"
        aria-label="Message list"
      >
        {messages.map((msg, index) => (
          <Message key={index} {...msg} />
        ))}
      </div>
      <Input onSend={handleSend} />
    </div>
  );
};
