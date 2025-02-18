import VideoRecorder from "@/components/record/VideoRecorder";
import Searchbar from "@/components/layout/Searchbar";

const SeedRecordPage = () => {
  return (
    <div
      className="w-full h-full"
      style={{
        backgroundColor: "#171222",
      }}
    >
      {/* <Searchbar /> */}
      <VideoRecorder />
    </div>
  );
};

export default SeedRecordPage;
