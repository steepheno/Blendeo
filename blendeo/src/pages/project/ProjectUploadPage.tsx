import Searchbar from "@/components/layout/Searchbar";
import ProjectCreationForm from "@/components/record/ProjectCreationForm";
import ForkProjectCreationForm from "@/components/record/ForkProjectCreationForm";
import { useLocation } from "react-router-dom";

const ProjectUploadPage = () => {
  const location = useLocation();
  const isForkPath = location.pathname.includes("/fork/upload");

  return (
    <div
      className="w-full h-full"
      style={{
        backgroundColor: "#171226",
      }}
    >
      <div
        style={{
          backgroundColor: "#171226",
          position: "absolute",
          top: "0",
          bottom: "0",
          left: "0",
          right: "0",
          zIndex: "-1",
        }}
      ></div>
      <Searchbar />
      {isForkPath ? <ForkProjectCreationForm /> : <ProjectCreationForm />}
    </div>
  );
};

export default ProjectUploadPage;
