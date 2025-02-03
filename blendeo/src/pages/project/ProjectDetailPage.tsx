import Layout from "@/components/layout/Layout";

import VideoPlayer from "@/components/detail/VideoPlayer";
import InteractionButton from "@/components/detail/InteractionButton";
import CommentsSection from "@/components/detail/CommentsSection";
import ContributorsSection from "@/components/detail/ContributorsSection";
import SidePanel from "@/components/detail/SidePanel";

import { useState } from "react";
import {
  MessageSquare,
  Heart,
  Bookmark,
  Share2,
  Music,
  Users,
} from "lucide-react";

import { TabType } from "@/types/components/video/videoDetail";

const Main = () => {
  const [activeTab, setActiveTab] = useState<TabType>(null);

  const handleTabClick = (tab: TabType) => {
    setActiveTab(activeTab === tab ? null : tab);
  };
  return (
    <Layout showNotification={true}>
      <div className="flex h-screen bg-white">
        <div className="flex-1 flex">
          <div
            className={`transition-all duration-300 ease-in-out p-4 ${
              activeTab ? "w-3/4" : "w-full"
            }`}
          >
            <div className="relative h-full">
              <VideoPlayer
                videoUrl="video_url_here"
                thumbnail="/thumbnail.jpg"
                metadata={{
                  title: "그거 아세요? +숨겨왔던 이거 올리미다..ㅎㅅㅎ",
                  content: "상세 설명이 여기 들어갑니다...",
                  author: {
                    name: "Cathy",
                    profileImage: "/profile.jpg",
                  },
                }}
                isPortrait={true}
              />

              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-4">
                <InteractionButton icon={Music} count="157" label="Blendit!" />
                <InteractionButton icon={Heart} count="158.5K" />
                <InteractionButton
                  icon={MessageSquare}
                  count="716"
                  isActive={activeTab === "comments"}
                  onClick={() => handleTabClick("comments")}
                />
                <InteractionButton
                  icon={Users}
                  count="24"
                  isActive={activeTab === "contributors"}
                  onClick={() => handleTabClick("contributors")}
                />
                <InteractionButton icon={Bookmark} count="17.5K" />
                <InteractionButton icon={Share2} count="5082" />
              </div>
            </div>
          </div>

          <SidePanel
            activeTab={activeTab}
            content={
              activeTab === "comments" ? (
                <CommentsSection />
              ) : (
                <ContributorsSection />
              )
            }
          />
        </div>
      </div>
    </Layout>
  );
};

export default Main;
