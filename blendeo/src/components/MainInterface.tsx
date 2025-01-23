import { MusicCard } from './common/MusicCard';
import { SidebarItem } from './common/SidebarItem';
import { GenreTag } from './common/GenreTag';
import { SubscriptionItem } from './common/SubscriptionItem';

const sidebarItems = [
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/2773c8ae867c168434eaa09658e0bf5ca92644170e4886703b307de3e36bd802?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b", label: "홈", isActive: true },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/12210756f538fe6fa67316f5c82ddd736cfb12ec1ffb4a3e944e8b34a0eb4370?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b", label: "탐색" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/89a0072ef0dbff743855d5c27a472bde87b46dbf1c2df85532ab140f348af1d3?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b", label: "Create" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/dc1dd8425faea0ea03838faca2a0ae63608db905b6381b8afeacda1218d866b2?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b", label: "Studio" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/10442a81aaba3d34107e6c64311b1f79a99edf436b7668568be30496a74d8cb5?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b", label: "내 정보" }
];

const genreTags = [
  { label: "All", width: "50px" },
  { label: "Pop", width: "59px" },
  { label: "Rock", width: "67px" },
  { label: "Rap", width: "59px" },
  { label: "Country", width: "88px" },
  { label: "Jazz", width: "62px" },
  { label: "Acoustic", width: "94px" },
  { label: "Electronic", width: "102px" },
  { label: "Classical", width: "101px" },
  { label: "Metal", width: "71px" },
  { label: "Indie", width: "73px" }
];

const musicCards = [
  {
    imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/84b91aec822e2335b9a0351c3b3c829f40999c21a85a8be7db1c9c1eaf340d38?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b",
    title: "Rain on Me | Lady Gaga & Ariana Grande",
    timeAgo: "2 months ago",
    views: "3.2M"
  },
  {
    imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/0cdca0922b40c9fa3c7e22076a74a2ef3635f129600d240995772157a5a9d63b?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b",
    title: "Blinding Lights | The Weeknd",
    timeAgo: "3 weeks ago",
    views: "5.6M"
  },
  {
    imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/1ad23b539ad125293b230e98703ce9ea9e1dbc836781de11d46ae33ccaa59f65?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b",
    title: "Savage Love | Jason Derulo",
    timeAgo: "1 month ago",
    views: "2.1M"
  },
  {
    imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/00e746961297b877ee93de9de6770df04c92fcc7ce996dcf460d3d2fb439bac1?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b",
    title: "Don't Start Now | Dua Lipa",
    timeAgo: "4 days ago",
    views: "8.9M"
  }
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

export function MainInterface() {
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

      <div className="flex flex-wrap flex-1 gap-2.5 mt-2.5 size-full max-md:max-w-full">
        <div className="flex overflow-hidden flex-col min-w-[240px] w-[354px]">
          <div className="flex flex-col justify-between p-4 w-full bg-white bg-opacity-0 min-h-[723px]">
            <div className="flex flex-col w-full">
              <div className="flex flex-col flex-1 w-full">
                {sidebarItems.map((item, index) => (
                  <SidebarItem key={index} {...item} />
                ))}
              </div>
            </div>
            <button className="flex overflow-hidden justify-center items-center px-4 mt-96 w-full text-sm font-bold text-center text-white bg-violet-700 rounded-3xl max-w-[480px] min-h-[40px] min-w-[84px] max-md:mt-10">
              <div className="overflow-hidden self-stretch my-auto w-[47px]">Sign in</div>
            </button>
          </div>

          <div className="flex flex-col pl-2.5 max-w-full w-[281px]">
            <div className="px-4 pt-4 pb-2 w-full text-lg font-bold leading-none whitespace-nowrap min-h-[47px] text-neutral-900">구독중</div>
            {subscriptionItems.map((item, index) => (
              <SubscriptionItem key={index} {...item} />
            ))}
          </div>
        </div>

        <div className="flex flex-col flex-1 shrink self-start px-20 pt-2.5 basis-0 min-w-[240px] max-md:px-5 max-md:max-w-full">
          <div className="flex flex-col w-full max-md:max-w-full">
            <div className="flex flex-col w-full text-5xl font-black tracking-tighter text-white leading-[60px] min-h-[366px] max-md:max-w-full max-md:text-4xl max-md:leading-[56px]">
              <div className="flex flex-col justify-center p-4 w-full max-md:max-w-full max-md:text-4xl max-md:leading-[56px]">
                <div className="flex overflow-hidden flex-col justify-center px-5 py-8 w-full rounded-xl max-md:max-w-full max-md:text-4xl max-md:leading-[56px]">
                  <div className="flex self-center max-w-full min-h-[120px] w-[893px]" />
                  <div className="mt-8 max-md:max-w-full max-md:text-4xl max-md:leading-[56px]">
                    Dive into a world of<br />music creation and discovery
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col pb-3 mt-2.5 w-full text-sm font-bold text-slate-500 max-md:max-w-full">
              <div className="flex flex-wrap justify-between items-start px-4 w-full border-b border-zinc-200 max-md:max-w-full">
                <div className="flex flex-col flex-1 shrink justify-center items-center pt-4 pb-3.5 border-gray-200 basis-0 border-b-[3px] min-w-[240px] text-neutral-900">
                  <div className="w-[53px]">For you</div>
                </div>
                <div className="flex flex-col flex-1 shrink justify-center items-center pt-4 pb-3.5 whitespace-nowrap border-gray-200 basis-0 border-b-[3px] min-w-[240px]">
                  <div className="w-[57px]">Ranking</div>
                </div>
                <div className="flex flex-col flex-1 shrink justify-center items-center pt-4 pb-3.5 whitespace-nowrap border-gray-200 basis-0 border-b-[3px] min-w-[240px]">
                  <div className="w-[46px]">Latest</div>
                </div>
              </div>
            </div>

            <div className="flex overflow-hidden flex-wrap gap-3 items-start p-3 mt-2.5 w-full text-sm font-medium whitespace-nowrap min-h-[56px] text-neutral-900 max-md:max-w-full">
              {genreTags.map((tag, index) => (
                <GenreTag key={index} {...tag} />
              ))}
            </div>

            <div className="flex flex-wrap gap-3 items-start p-4 mt-2.5 w-full max-md:max-w-full">
              <div className="flex flex-wrap flex-1 shrink gap-3 items-start w-full basis-0 min-w-[240px] max-md:max-w-full">
                {musicCards.map((card, index) => (
                  <MusicCard key={index} {...card} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex overflow-hidden flex-col justify-center items-end p-5 min-w-[240px] w-[354px]">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/fcc07085acca2166118f6eac8b7db84853533e77c1866a599eb6cb2cd87483bf?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b" alt="" className="object-contain aspect-square w-[70px]" />
        </div>
      </div>
    </div>
  );
}