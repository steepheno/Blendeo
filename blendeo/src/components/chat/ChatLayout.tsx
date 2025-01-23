import * as React from "react";
import { SidebarItem } from "../common/SidebarItem";
import { ChatSearchBar } from "./ChatSearchBar";
import { SubscriptionItem } from "../common/SubscriptionItem";
import { UserItem } from "./UserItem";

const sidebarItems = [
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/2773c8ae867c168434eaa09658e0bf5ca92644170e4886703b307de3e36bd802?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b", label: "홈", isActive: true },
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/12210756f538fe6fa67316f5c82ddd736cfb12ec1ffb4a3e944e8b34a0eb4370?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b", label: "탐색" },
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/89a0072ef0dbff743855d5c27a472bde87b46dbf1c2df85532ab140f348af1d3?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b", label: "Create" },
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/dc1dd8425faea0ea03838faca2a0ae63608db905b6381b8afeacda1218d866b2?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b", label: "Studio" },
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/10442a81aaba3d34107e6c64311b1f79a99edf436b7668568be30496a74d8cb5?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b", label: "내 정보" }
  ];

const subscriptionItems = [
  {
    imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/ccbdeea84866b8c6dd74176cc8e180464719262612a895eaa2e4017e5beb77bf?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b",
    title: "Euphoria | Labrinth | Piano Cover",
    timeAgo: "1 month ago",
    views: "1.4M"
  },
  {
    imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/547063262c0cf9d7de0c9351202c78568e8a68d3c3d90bb56795be8577e23efb?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b",
    title: "Viva La Vida | Coldplay | Violin Cover",
    timeAgo: "2 months ago",
    views: "3.2M"
  }
];

const users = [
  { name: "Katie", message: "Sure thing! Message me when you're ready to be reminded.", imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/737891f12d242c60bccf3e49406cbc5b3bf7a5a2c6008b7f12f043ca8ca0b239?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b" },
  { name: "GPT-3.5", isOnline: true, imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/25c684c71d0b87d42917b77d4bc62bf6f44f0048bf22843f37e2ee035bda4b95?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b" }
];

export const ChatLayout: React.FC = () => {
  return (
    <div className="flex overflow-hidden flex-col bg-white">
      
      <div className="flex flex-wrap justify-between items-center px-10 py-3.5 mt-2.5 w-full border-b border-gray-200 max-w-[1921px] min-h-[65px] max-md:px-5 max-md:max-w-full">
        <div className="flex gap-1.5 justify-between items-center self-stretch my-auto text-lg font-bold leading-none whitespace-nowrap text-neutral-900 w-[127px]">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/ec1bac5572379625521291a5a2be7bd8cec2e72569fbc49d76a7c45bd2f1676f?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b" alt="Logo" className="object-contain shrink-0 self-stretch my-auto w-8 aspect-square" />
          <div className="flex gap-4 items-center self-stretch my-auto w-[90px]">
            <div className="self-stretch my-auto w-[90px]">BLENDEO</div>
          </div>
        </div>

        <div className="flex flex-wrap flex-1 shrink gap-8 items-start self-stretch my-auto basis-0 min-w-[240px] max-md:max-w-full">
          <form className="flex flex-col w-64 max-w-[256px] min-w-[160px]" role="search">
            <div className="flex flex-1 rounded-xl size-full">
              <label htmlFor="searchInput" className="sr-only">Search</label>
              <div className="flex justify-center items-center pl-4 w-10 h-10 bg-gray-100 rounded-xl">
                <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/e0b2d6514a108ef46e68e2ebf159f7513b1d9aaed23ca499039bc22626748212?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b" alt="" className="object-contain flex-1 shrink self-stretch my-auto w-6 aspect-square basis-0" />
              </div>
              <input
                id="searchInput"
                type="search"
                placeholder="Search"
                className="overflow-hidden flex-1 shrink self-stretch py-2 pr-4 pl-2 h-full text-base whitespace-nowrap bg-gray-100 rounded-none text-slate-500"
              />
            </div>
          </form>

          <button className="flex overflow-hidden justify-center items-center px-4 w-32 text-sm font-bold text-center text-white bg-violet-700 rounded-3xl max-w-[480px] min-h-[40px] min-w-[84px]">
            <div className="overflow-hidden self-stretch my-auto w-24">Upload music</div>
          </button>

          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/0800ab8a61203407fbdf0957de80f1dcf45222f5193a48567fbc5c3e7b6eb14b?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b" alt="User profile" className="object-contain shrink-0 w-10 rounded-3xl aspect-square" />
        </div>
      </div>
      
      <nav className="flex flex-wrap justify-between items-center px-10 py-3.5 mt-2.5 w-full border-b border-gray-200 max-w-[1921px] min-h-[65px] max-md:px-5 max-md:max-w-full">
        {/* Navigation content remains the same as original */}
      </nav>

      <main className="flex flex-wrap flex-1 gap-2.5 mt-2.5 size-full max-md:max-w-full">
        <aside className="flex overflow-hidden flex-col min-w-[240px] w-[354px]">
          <div className="flex flex-col justify-between p-4 w-full bg-white bg-opacity-0 min-h-[723px]">
            <nav className="flex flex-col w-full">
              {sidebarItems.map((item, index) => (
                <SidebarItem key={index} {...item} />
              ))}
            </nav>
            
            <button className="flex overflow-hidden justify-center items-center px-4 mt-96 w-full text-sm font-bold text-center text-white bg-violet-700 rounded-3xl max-w-[480px] min-h-[40px] min-w-[84px] max-md:mt-10">
              <span className="overflow-hidden self-stretch my-auto w-[47px]">
                Sign in
              </span>
            </button>
          </div>

          <section className="flex flex-col pl-2.5 max-w-full w-[281px]">
            <h2 className="px-4 pt-4 pb-2 w-full text-lg font-bold leading-none whitespace-nowrap min-h-[47px] text-neutral-900">
              구독중
            </h2>
            {subscriptionItems.map((item, index) => (
              <SubscriptionItem key={index} {...item} />
            ))}
          </section>
        </aside>

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
  );
}