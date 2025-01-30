import { useState } from 'react';
import { ChatSearchBar } from "../components/chat/ChatSearchBar";
import { UserItem } from "../components/chat/UserItem";
import { ChatWindow } from "../components/chat/ChatWindow";
import Layout from '../components/Layout/Layout';

interface User {
  name: string;
  message?: string;
  isOnline?: boolean;
  imageUrl: string;
}
const users = [
  { name: "Katie", message: "Sure thing! Message me when you're ready to be reminded.", imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/737891f12d242c60bccf3e49406cbc5b3bf7a5a2c6008b7f12f043ca8ca0b239?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b" },
  { name: "GPT-3.5", isOnline: true, imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/25c684c71d0b87d42917d77d4bc62bf6f44f0048bf22843f37e2ee035bda4b95?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b" }
];

const Chat = () => {
  const [chatWindowOpened, setChatWindowOpened] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setChatWindowOpened(true);
  };

  return (
    <Layout showNotification>
      {/* 채팅 영역 - flex로 변경 */}
      <div className={`flex flex-1 ${chatWindowOpened ? 'gap-0' : ''}`}>
          {/* 유저 목록 - 채팅창이 열리면 너비 조정 */}
          <div className={`flex flex-col ${chatWindowOpened ? 'w-[400px] min-w-[400px]' : 'w-full'}`}>
            <div className="p-4">
              <ChatSearchBar
                placeholder="Search..."
                iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/1b61981f2c48450f2aff765e8726b53074f0dbc21e70d524b2f0fd106c92ae86?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b"
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {users.map((user, index) => (
                <UserItem 
                  key={index} 
                  {...user} 
                  onClick={() => handleUserClick(user)}
                />
              ))}
            </div>
          </div>

          {/* 채팅창 - 조건부 렌더링 */}
          {chatWindowOpened && selectedUser && (
            <div className="flex-1 border-l border-gray-200">
              <ChatWindow 
                user={selectedUser}
                onClose={() => setChatWindowOpened(false)}
              />
            </div>
          )}
        </div>
    </Layout>
  );
};

export default Chat;