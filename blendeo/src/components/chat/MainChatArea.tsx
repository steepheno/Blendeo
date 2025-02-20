import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Paperclip, Send, Smile, Video } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import useChatStore from "@/stores/chatStore";
import { useAuthStore } from "@/stores/authStore";
import React, { useEffect, useRef, useState } from "react";
import { useWebSocket } from "@/hooks/chat/useWebSocket";
import { useNavigate } from "react-router-dom";
import EditRoomNameModal from "./EditRoomNameModal";
import { chatAPI } from "@/api/chat";
import { toast } from "sonner";

interface MainChatAreaProps {
  setChatWindowOpened: (opened: boolean) => void;
}

const MainChatArea = ({ setChatWindowOpened }: MainChatAreaProps) => {
  const { currentRoom, setCurrentRoom, updateRoom, messagesByRoom } =
    useChatStore();
  const { user } = useAuthStore();

  const [inputMessage, setInputMessage] = useState("");
  const { sendMessage } = useWebSocket();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messagesByRoom]);

  useEffect(() => {
    scrollToBottom();
  }, []);

  const handleCloseChat = () => {
    setChatWindowOpened(false);
    setCurrentRoom(null);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !currentRoom) return;
    const now = new Date();
    sendMessage(inputMessage, now.toISOString());
    setInputMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const navigate = useNavigate();

  const handleVideoChat = async () => {
    navigate(`/chat/${currentRoom?.id}/video`);
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditRoomName = async (newName: string) => {
    if (!currentRoom) return;

    try {
      await chatAPI.editRoomName({
        roomId: currentRoom.id,
        roomName: newName,
      });
      const updatedRoom = { ...currentRoom, name: newName };
      setCurrentRoom(updatedRoom);
      updateRoom(updatedRoom);
    } catch (error) {
      console.error("채팅방 이름 수정 실패:", error);
      toast.error("채팅방 이름 수정에 실패했습니다.");
    }
  };

  const handleProfileClick = (userId: number) => {
    if (userId === user?.id) {
      navigate("/profile/me");
    } else {
      navigate(`/profile/${userId}`);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center gap-2 border-b p-4">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setIsEditModalOpen(true)}
        >
          <Avatar className="h-10 w-10">
            <AvatarImage
              src="/placeholder.svg"
              alt={currentRoom?.name || "채팅방"}
            />
            <AvatarFallback>{currentRoom?.name?.[0] || "채팅"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">
              {currentRoom?.name || "채팅방을 선택해주세요"}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={handleVideoChat}>
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleCloseChat}>
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </header>
      {currentRoom && (
        <EditRoomNameModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditRoomName}
          currentName={currentRoom.name}
        />
      )}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 flex flex-col">
          {currentRoom &&
            [...(messagesByRoom[currentRoom.id] || [])]
              .sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              )
              .map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-2 w-full",
                    message.userId === user?.id
                      ? "flex-row-reverse"
                      : "flex-row"
                  )}
                >
                  <Avatar
                    className="h-8 w-8 flex-shrink-0 cursor-pointer hover:opacity-80"
                    onClick={() => handleProfileClick(message.userId)}
                  >
                    <AvatarImage
                      src={
                        message.userId === user?.id
                          ? user.profileImage || "/placeholder.svg"
                          : message.profileImage || "/placeholder.svg"
                      }
                      alt={
                        message.userId === user?.id
                          ? "나"
                          : message.nickname || "Unknown"
                      }
                    />
                    <AvatarFallback>
                      {message.userId === user?.id
                        ? "나"[0]
                        : (message.nickname || "Unknown")[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "flex flex-col gap-1",
                      message.userId === user?.id ? "items-end" : "items-start",
                      "max-w-[70%]"
                    )}
                  >
                    <span
                      className={cn(
                        "text-sm font-medium cursor-pointer hover:text-blue-600",
                        message.userId === user?.id ? "text-right" : "text-left"
                      )}
                      onClick={() => handleProfileClick(message.userId)}
                    >
                      {message.userId === user?.id
                        ? "나"
                        : message.nickname || "Unknown"}
                    </span>
                    <div
                      className={cn(
                        "rounded-lg px-4 py-2",
                        message.userId === user?.id
                          ? "bg-customPurple text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <p className="break-words whitespace-normal">
                        {message.content}
                      </p>
                      <div
                        className={cn(
                          "text-xs mt-1",
                          message.userId === user?.id
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        )}
                      >
                        {new Intl.DateTimeFormat("ko-KR", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        }).format(new Date(message.createdAt + "Z"))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <footer className="border-t p-4 mt-auto">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            className="flex-1"
            placeholder="메시지를 입력해주세요"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button variant="ghost" size="icon">
            <Smile className="h-5 w-5" />
          </Button>
          <Button size="icon" onClick={handleSendMessage}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default MainChatArea;
