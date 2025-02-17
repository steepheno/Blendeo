import VideoRecorder from "@/components/record/VideoRecorder";
import Searchbar from "@/components/layout/Searchbar";

const SeedRecordPage = () => {
  return (
    <div className="bg-black w-full h-full">
      <Searchbar />
      <VideoRecorder />
    </div>
  );
};

export default SeedRecordPage;