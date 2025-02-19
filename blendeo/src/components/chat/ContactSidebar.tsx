import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import useChatStore from "@/stores/chatStore";
import { useChatRooms } from "@/hooks/chat/useChatRooms";
import { useAuthStore } from "@/stores/authStore";
import CreateRoomModal from "@/components/chat/CreateRoomModal";
import type { ChatRoom } from "@/types/api/chat";

interface ContactSidebarProps {
  setChatWindowOpened: (opened: boolean) => void;
}

const ContactSidebar = ({ setChatWindowOpened }: ContactSidebarProps) => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { setCurrentRoom, searchUserByEmail, searchResults, rooms, setRooms } =
    useChatStore();

  const { rooms: fetchedRooms = [], createRoom } = useChatRooms();

  useEffect(() => {
    if (JSON.stringify(rooms) !== JSON.stringify(fetchedRooms)) {
      setRooms(fetchedRooms);
    }
  }, [fetchedRooms, rooms, setRooms]);

  const handleRoomClick = async (room: ChatRoom) => {
    if (!isAuthenticated) return;

    setChatWindowOpened(false);
    await setCurrentRoom(room);
    setChatWindowOpened(true);
  };

  const handleCreateRoom = async (userIds: number[]) => {
    if (!isAuthenticated) return;

    try {
      const newRoom = await createRoom(userIds);
      if (newRoom) {
        await setCurrentRoom(newRoom);
        setChatWindowOpened(true);
        setCreateModalOpen(false);
      }
    } catch (err) {
      console.error("Failed to create room:", err);
    }
  };

  return (
    <>
      <div
        className={cn(
          "border-l bg-background transition-all duration-300 pt-5",
          isSidebarOpen ? "w-80 md:w-96" : "w-20",
          "md:relative fixed inset-y-0 z-30",
          isSidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0",
          "md:block"
        )}
      >
        {isSidebarOpen ? (
          <>
            <header className="flex items-center justify-between border-b p-4 h-[80.85px]">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => setCreateModalOpen(true)}
                variant="outline"
                size="sm"
              >
                New Chat
              </Button>
            </header>
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search people or message..."
                />
              </div>
            </div>
            <ScrollArea className="h-[calc(100%-8rem)]">
              <div className="space-y-2 p-4">
                {rooms.map((room) => (
                  <Card
                    key={room.id}
                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-accent/50"
                    onClick={() => handleRoomClick(room)}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" alt={room.name} />
                        <AvatarFallback>{room.name?.[0] || "?"}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{room.name}</h3>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </>
        ) : (
          <div>
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      <CreateRoomModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreateRoom={handleCreateRoom}
        onSearch={searchUserByEmail}
        searchResults={searchResults}
      />
    </>
  );
};

export default ContactSidebar;
