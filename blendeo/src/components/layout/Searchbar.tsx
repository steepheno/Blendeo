// src/components/layout/Navbar.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import noUserImg from "@/assets/no_user.jpg";

interface NavbarProps {
  showNotification?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ showNotification }) => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [searchTerm, setSearchTerm] = useState("");

  const goToMain = () => {
    navigate("/main");
  };

  const goToMypage = () => {
    if (currentUser) {
      navigate("/profile/me");
    } else {
      navigate("/auth/signin");
    }
  };

  const handleAuthButton = async () => {
    if (currentUser) {
      try {
        await logout();
        navigate("/main");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    } else {
      navigate("/auth/signin");
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const dummyProfileImage = noUserImg;
  const profileImageUrl = currentUser?.profileImage || dummyProfileImage;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-200">
        <div className="flex justify-between items-center px-10 py-4 w-full min-h-[65px] max-md:px-5">
          {/* 로고 영역 */}
          <div
            onClick={goToMain}
            className="flex items-center gap-2 cursor-pointer min-w-[120px]"
          >
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/ec1bac5572379625521291a5a2be7bd8cec2e72569fbc49d76a7c45bd2f1676f"
              alt="Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="text-xl font-bold text-neutral-900">BLENDEO</span>
          </div>

          {/* 오른쪽 요소들 */}
          <div className="flex items-center gap-6 max-lg:gap-4 max-md:gap-2">
            {showNotification && (
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
            )}

            {/* 데스크톱 검색창 */}
            <form
              onSubmit={handleSearch}
              className="relative max-md:hidden"
              role="search"
            >
              <div className="flex items-center bg-gray-100 rounded-full overflow-hidden">
                <div className="flex items-center justify-center pl-4">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="프로젝트 제목 또는 @닉네임으로 검색"
                  className="w-80 max-xl:w-64 max-lg:w-48 max-md:hidden py-2 px-3 text-base bg-transparent outline-none text-gray-700 placeholder-gray-500"
                />
              </div>
            </form>

            {/* 모바일 검색 버튼 */}
            <button
              onClick={() => navigate("/search")}
              className="hidden max-md:flex items-center justify-center p-2 hover:bg-gray-100 rounded-full"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>

            <button
              onClick={handleAuthButton}
              className="px-6 py-2 max-lg:px-4 max-md:px-3 text-sm font-bold text-white bg-violet-700 hover:bg-violet-800 rounded-full transition-colors whitespace-nowrap"
            >
              {currentUser ? "로그아웃" : "로그인"}
            </button>

            <img
              onClick={goToMypage}
              loading="lazy"
              src={profileImageUrl}
              alt="User profile"
              className="w-10 h-10 rounded-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
            />
          </div>
        </div>
      </div>

      <div className="h-[65px]" />
    </>
  );
};

export default Navbar;
