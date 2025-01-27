import { useNavigate } from "react-router-dom";

const Searchbar = () => {
  const navigate = useNavigate();

  const goToMain = () => {
    navigate('/');
  }

  const goToMypage = () => {
    navigate('/mypage');
  }

  const goToUpload = () => {
    navigate('/upload');
  }

  return (
    <div className="flex flex-wrap justify-between items-center px-10 py-3.5 mt-2.5 w-full border-b border-gray-200 min-h-[65px] max-md:px-5 max-md:max-w-full">
      {/* 좌측 상단 */}
      <div onClick={goToMain} className="flex gap-1.5 justify-between items-center self-stretch my-auto text-lg font-bold leading-none whitespace-nowrap text-neutral-900 w-[127px] cursor-pointer">
        {/* 로고 이미지 */}
        <img 
          loading="lazy" 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/ec1bac5572379625521291a5a2be7bd8cec2e72569fbc49d76a7c45bd2f1676f?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b" 
          alt="Logo" 
          className="object-contain shrink-0 self-stretch my-auto w-8 aspect-square" 
        />
        {/* BLENDEO */}
        <div className="flex gap-4 items-center self-stretch my-auto w-[90px]">
          <div className="self-stretch my-auto w-[90px]">BLENDEO</div>
        </div>
      </div>

      {/* 우측 상단 */}
      <div className="flex flex-wrap flex-1 shrink gap-8 items-start justify-end self-stretch my-auto basis-0 min-w-[240px] max-md:max-w-full">
        {/* 검색바 */}
        <form className="flex flex-col w-full max-w-[400px] min-w-[160px]" role="search">
          <div className="flex items-center w-full h-10 bg-gray-100 rounded-full pl-4 pr-2">
            <label htmlFor="searchInput" className="sr-only">Search</label>
            {/* 검색 아이콘 */}
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/e0b2d6514a108ef46e68e2ebf159f7513b1d9aaed23ca499039bc22626748212?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b"
              alt="Search icon"
              className="object-contain w-6 h-6 cursor-pointer"
            />
            {/* 검색창 */}
            <input
              id="searchInput"
              type="search"
              placeholder="Search"
              className="flex-1 h-full text-base text-slate-500 bg-gray-100 border-none outline-none rounded-full pl-2"
            />
          </div>
        </form>


        {/* Upload music */}
        <button
          onClick={goToUpload}
          className="flex overflow-hidden justify-center items-center px-4 w-32 text-sm font-bold text-center text-white bg-violet-700 rounded-3xl max-w-[480px] min-h-[40px] min-w-[84px]">
          <div className="overflow-hidden self-stretch my-auto w-24">Upload music</div>
        </button>

        {/* 프로필 사진 */}
        <img
          onClick={goToMypage}
          loading="lazy" 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/0800ab8a61203407fbdf0957de80f1dcf45222f5193a48567fbc5c3e7b6eb14b?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b" 
          alt="User profile" 
          className="object-contain shrink-0 w-10 rounded-3xl aspect-square cursor-pointer" 
        />
      </div>
    </div>
  );
};

export default Searchbar;