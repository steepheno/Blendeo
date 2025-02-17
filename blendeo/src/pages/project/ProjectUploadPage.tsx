import Searchbar from "@/components/layout/Searchbar";
import ProjectCreationForm from "@/components/record/ProjectCreationForm";
import ForkProjectCreationForm from "@/components/record/ForkProjectCreationForm";
import { useLocation } from "react-router-dom";

const ProjectUploadPage = () => {
  const location = useLocation();
  const isForkPath = location.pathname.includes('/fork/upload');

  return (
    <div className="bg-black w-full h-full">
      <Searchbar />
      {isForkPath ? <ForkProjectCreationForm /> : <ProjectCreationForm />}
    </div>
  );
};

export default ProjectUploadPage;