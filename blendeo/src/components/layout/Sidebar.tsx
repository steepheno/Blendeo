import { useNavigate } from "react-router-dom";
import SidebarItem from "./SidebarItem";
import SubscriptionItem from "./SubscriptionItem";
import { useEffect, useState } from "react";
import FollowingProjectResponse, { getFollowingProjects } from "@/api/user";

const sidebarItems = [
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/2773c8ae867c168434eaa09658e0bf5ca92644170e4886703b307de3e36bd802",
    label: "홈",
    isActive: true,
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/12210756f538fe6fa67316f5c82ddd736cfb12ec1ffb4a3e944e8b34a0eb4370",
    label: "탐색",
    path: "/explore",
    requireAuth: true,
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/89a0072ef0dbff743855d5c27a472bde87b46dbf1c2df85532ab140f348af1d3",
    label: "채팅",
    path: "/chat",
    requireAuth: true,
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/10442a81aaba3d34107e6c64311b1f79a99edf436b7668568be30496a74d8cb5",
    label: "내 정보",
    path: "/profile/me",
    requireAuth: true,
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const [subscriptionItems, setSubscriptionItems] = useState<
    FollowingProjectResponse[]
  >([]);

  const goToRecord = () => {
    navigate("/seed/record");
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getFollowingProjects();
      if (response) {
        setSubscriptionItems(response);
        console.log("상태 업데이트됨");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
  }, [subscriptionItems]);
  return (
    <>
      {/* 실제 Sidebar */}
      <div className="fixed top-[81px] left-0 bottom-0 w-[280px] xl:w-[310px] 2xl:w-[330px] bg-white border-r border-gray-200 overflow-y-auto">
        <div className="flex flex-col h-full p-6">
          {/* 상단 섹션 (네비게이션 아이템들) */}
          <div className="flex flex-col space-y-2">
            {sidebarItems.map((item, index) => (
              <SidebarItem key={index} {...item} />
            ))}
          </div>

          {/* 중간 여백 */}
          <div className="flex-grow" />

          {/* 하단 섹션 (Sign in/out + 구독) */}
          <div className="mt-4">
            {/* 로그인/로그아웃 버튼 */}
            <button
              onClick={goToRecord}
              className="flex justify-center items-center px-6 py-2.5 w-full text-sm font-bold text-white bg-violet-700 hover:bg-violet-800 rounded-full transition-colors"
            >
              업로드
            </button>

            {/* 구독 섹션 */}
            <div className="mt-8">
              <h2 className="px-2 mb-4 text-lg font-bold text-neutral-900">
                구독중
              </h2>
              <div className="space-y-4">
                {/* 디버깅용 */}
                {subscriptionItems.map((item) => (
                  <SubscriptionItem
                    key={`subscription-${item.projectId}`} // index 대신 고유 ID 사용
                    {...item}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar 너비만큼 빈 공간을 만들어주는 스페이서 */}
      <div className="w-[330px]" />
    </>
  );
};

export default Sidebar;
