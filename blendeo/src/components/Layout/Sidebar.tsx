import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import SidebarItem from "./SidebarItem";
import SubscriptionItem from "./SubscriptionItem";

const sidebarItems = [
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/2773c8ae867c168434eaa09658e0bf5ca92644170e4886703b307de3e36bd802",
    label: "홈",
    isActive: true,
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/12210756f538fe6fa67316f5c82ddd736cfb12ec1ffb4a3e944e8b34a0eb4370",
    label: "촬영",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/89a0072ef0dbff743855d5c27a472bde87b46dbf1c2df85532ab140f348af1d3",
    label: "채팅",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/dc1dd8425faea0ea03838faca2a0ae63608db905b6381b8afeacda1218d866b2",
    label: "Studio",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/10442a81aaba3d34107e6c64311b1f79a99edf436b7668568be30496a74d8cb5",
    label: "내 정보",
  },
];

const subscriptionItems = [
  {
    imageUrl:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/ccbdeea84866b8c6dd74176cc8e180464719262612a895eaa2e4017e5beb77bf",
    title: "Euphoria | Labrinth | Piano Cover",
    timeAgo: "1 month ago",
    views: "1.4M",
  },
  {
    imageUrl:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/547063262c0cf9d7de0c9351202c78568e8a68d3c3d90bb56795be8577e23efb",
    title: "Viva La Vida | Coldplay | Violin Cover",
    timeAgo: "2 months ago",
    views: "3.2M",
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();

  const goToLogin = () => {
    navigate("/auth/signin");
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/"); // 로그아웃 후 메인 페이지로 이동
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* 실제 Sidebar */}
      <div className="fixed top-[81px] left-0 bottom-0 w-[330px] bg-white border-r border-gray-200 overflow-y-auto">
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
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex justify-center items-center px-6 py-2.5 w-full text-sm font-bold text-white bg-violet-700 hover:bg-violet-800 rounded-full transition-colors"
              >
                Sign out
              </button>
            ) : (
              <button
                onClick={goToLogin}
                className="flex justify-center items-center px-6 py-2.5 w-full text-sm font-bold text-white bg-violet-700 hover:bg-violet-800 rounded-full transition-colors"
              >
                Sign in
              </button>
            )}

            {/* 구독 섹션 */}
            <div className="mt-8">
              <h2 className="px-2 mb-4 text-lg font-bold text-neutral-900">
                구독중
              </h2>
              <div className="space-y-4">
                {subscriptionItems.map((item, index) => (
                  <SubscriptionItem key={index} {...item} />
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
