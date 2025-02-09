import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const Searchbar = () => {
  const navigate = useNavigate();

  const goToMain = () => {
    navigate("/");
  };

  const goToMypage = () => {
    navigate("/profile/me");
  };

  const goToUpload = () => {
    navigate("/upload");
  };

  return (
    <>
      {/* 실제 Navbar */}
      <div className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-200">
        <div className="flex justify-between items-center px-10 py-4 w-full max-w-[1921px] min-h-[65px] max-md:px-5 mx-auto">
          {/* 좌측 로고 */}
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

          {/* 우측 네비게이션 */}
          <div className="flex items-center gap-6">
            {/* 검색바 */}
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

            {/* Upload 버튼 */}
            <button
              onClick={goToUpload}
              className="px-6 py-2 text-sm font-bold text-white bg-violet-700 hover:bg-violet-800 rounded-full transition-colors"
            >
              Upload music
            </button>

            {/* 프로필 사진 */}
            <img
              onClick={goToMypage}
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/0800ab8a61203407fbdf0957de80f1dcf45222f5193a48567fbc5c3e7b6eb14b"
              alt="User profile"
              className="w-10 h-10 rounded-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
            />
          </div>
        </div>
      </div>

      {/* Navbar의 높이만큼 빈 공간을 만들어주는 스페이서 */}
      <div className="h-[81px]" />
    </>
  );
};

export default Searchbar;
