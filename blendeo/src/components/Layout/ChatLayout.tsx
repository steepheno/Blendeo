import { ChatSearchBar } from "../chat/ChatSearchBar";
import { UserItem } from "../chat/UserItem";
import Navbar from "../common/Navbar";
import Sidebar from "../common/Sidebar";

const users = [
  { name: "Katie", message: "Sure thing! Message me when you're ready to be reminded.", imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/737891f12d242c60bccf3e49406cbc5b3bf7a5a2c6008b7f12f043ca8ca0b239?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b" },
  { name: "GPT-3.5", isOnline: true, imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/25c684c71d0b87d42917b77d4bc62bf6f44f0048bf22843f37e2ee035bda4b95?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b" }
];

export const ChatLayout = () => {
  return (
    <div className="flex overflow-hidden flex-col bg-white">
      <Navbar />

      {/* 사이드바 */}
      <div className="flex flex-wrap flex-1 gap-2.5 mt-2.5 size-full max-md:max-w-full">

        <div className="flex overflow-hidden flex-col min-w-[240px] w-[354px]">
          <Sidebar />
        </div>

        <main className="flex flex-wrap flex-1 gap-2.5 mt-2.5 size-full max-md:max-w-full">
          <section className="flex flex-col flex-1 shrink justify-center px-16 py-2.5 basis-0 min-w-[240px] max-md:px-5 max-md:max-w-full">
            <div className="flex gap-1 justify-center px-3 py-7 w-full rounded-xl min-h-[840px] max-md:max-w-full">
              <div className="flex overflow-hidden flex-col flex-1 shrink w-full basis-0 min-w-[240px] max-md:max-w-full">
                <ChatSearchBar
                  placeholder="Search..."
                  iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/1b61981f2c48450f2aff765e8726b53074f0dbc21e70d524b2f0fd106c92ae86?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b"
                />
                
                {users.map((user, index) => (
                  <UserItem key={index} {...user} />
                ))}
              </div>
            </div>
          </section>

          <aside className="flex overflow-hidden flex-col justify-center items-end p-5 min-w-[240px] w-[354px]">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/e909df090ac7ea856915eb33569cb507191306a43d172b92ca6d2ed052e8e51e?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b"
              alt="Chat decoration"
              className="object-contain aspect-square w-[70px]"
            />
          </aside>
        </main>
      </div>
    </div>
  );
};