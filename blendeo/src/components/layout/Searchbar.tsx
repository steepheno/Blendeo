import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

const Searchbar = () => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const goToMain = () => {
    navigate("/");
  };

  const goToMypage = () => {
    if (currentUser) {
      navigate("/profile/me");
    } else {
      navigate("/auth/signin"); // 로그인 페이지 경로
    }
  };

  const handleAuthButton = async () => {
    if (currentUser) {
      try {
        await logout();
        navigate("/");
      } catch (error) {
        console.error("Logout failed:", error);
        // 에러 처리 (예: 토스트 메시지 표시)
      }
    } else {
      navigate("/auth/signin");
    }
  };

  // 프로필 이미지 URL 결정
  const dummyProfileImage = 'https://blendeo-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/image_23ef564e-e0c7-4432-bc6b-a3400c07dc30.jpeg'
  const profileImageUrl = currentUser?.profileImage || dummyProfileImage;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-200">
        <div className="flex justify-between items-center px-10 py-4 w-full max-w-[1921px] min-h-[65px] max-md:px-5 mx-auto">
          <div
            onClick={goToMain}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/ec1bac5572379625521291a5a2be7bd8cec2e72569fbc49d76a7c45bd2f1676f"
              alt="Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="text-lg font-bold text-neutral-900">BLENDEO</span>
          </div>

          <div className="flex items-center gap-6">
            <form className="relative" role="search">
              <div className="flex items-center bg-gray-100 rounded-full overflow-hidden">
                <div className="flex items-center justify-center pl-4">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="search"
                  placeholder="Search"
                  className="w-64 py-2 px-3 text-base bg-transparent outline-none text-gray-700 placeholder-gray-500"
                />
              </div>
            </form>

            {/* Sign In/Sign Out 버튼 */}
            <button
              onClick={handleAuthButton}
              className="px-6 py-2 text-sm font-bold text-white bg-violet-700 hover:bg-violet-800 rounded-full transition-colors"
            >
              {currentUser ? "Sign Out" : "Sign In"}
            </button>

            {/* 프로필 사진 */}
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

      <div className="h-[81px]" />
    </>
  );
};

export default Searchbar;