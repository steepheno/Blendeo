import MusicCard from '../components/common/MusicCard';
import GenreTag from '../components/common/GenreTag';
import Searchbar from '../components/common/Searchbar';
import Sidebar from '../components/common/Sidebar';

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

const Main = () => {
  return (
    <div className="flex overflow-hidden flex-col bg-white">
      <Searchbar />

      <div className="flex flex-wrap flex-1 gap-2.5 mt-2.5 size-full max-md:max-w-full">
        {/* 사이드바 */}
        <div className="flex overflow-hidden flex-col min-w-[240px] w-[354px]">
          <Sidebar />
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
};

export default Main;