import React from 'react';

const Navbar: React.FC = () => {
  return (
    <div className="flex flex-wrap justify-between items-center px-10 py-3.5 mt-2.5 w-full border-b border-gray-200 max-w-[1921px] min-h-[65px] max-md:px-5 max-md:max-w-full">
      <div className="flex gap-1.5 justify-between items-center self-stretch my-auto text-lg font-bold leading-none whitespace-nowrap text-neutral-900 w-[127px]">
        <img 
          loading="lazy" 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/ec1bac5572379625521291a5a2be7bd8cec2e72569fbc49d76a7c45bd2f1676f?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b" 
          alt="Logo" 
          className="object-contain shrink-0 self-stretch my-auto w-8 aspect-square" 
        />
        <div className="flex gap-4 items-center self-stretch my-auto w-[90px]">
          <div className="self-stretch my-auto w-[90px]">BLENDEO</div>
        </div>
      </div>

      <div className="flex flex-wrap flex-1 shrink gap-8 items-start self-stretch my-auto basis-0 min-w-[240px] max-md:max-w-full">
        <form className="flex flex-col w-64 max-w-[256px] min-w-[160px]" role="search">
          <div className="flex flex-1 rounded-xl size-full">
            <label htmlFor="searchInput" className="sr-only">Search</label>
            <div className="flex justify-center items-center pl-4 w-10 h-10 bg-gray-100 rounded-xl">
              <img 
                loading="lazy" 
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/e0b2d6514a108ef46e68e2ebf159f7513b1d9aaed23ca499039bc22626748212?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b"
                alt="" 
                className="object-contain flex-1 shrink self-stretch my-auto w-6 aspect-square basis-0" 
              />
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

        <img 
          loading="lazy" 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/0800ab8a61203407fbdf0957de80f1dcf45222f5193a48567fbc5c3e7b6eb14b?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b" 
          alt="User profile" 
          className="object-contain shrink-0 w-10 rounded-3xl aspect-square" 
        />
      </div>
    </div>
  );
};

export default Navbar;