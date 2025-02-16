import { useState, useEffect } from "react";
import { getProjectContributors } from "@/api/project";
import { UserMiniInfo } from "../common/UserMiniInfo";

import type { userMiniInfo } from "@/types/api/user";
import { Button } from "../ui/button";

interface ContributorsSectionProps {
  projectId: number;
}

// Contributors Section Component
const ContributorsSection = ({ projectId }: ContributorsSectionProps) => {
  const [contributors, setContributors] = useState<userMiniInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        setIsLoading(true);
        const data = await getProjectContributors(projectId);
        setContributors(data);
      } catch (error) {
        console.error('Failed to fetch contributors:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContributors();
  }, [projectId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="p-4 space-y-4 border border-b-1 border-custom-lavender">
        {contributors.map((contributor) => (
          <div key={contributor.userId} className="flex items-center space-x-3 ">
            <UserMiniInfo user={contributor} />
          </div>
        ))}
      </div>
      <div className="p-4 flex justify-center w-full">
        <div className="flex flex-col items-center gap-2">
          <Button className="bg-violet-700 rounded-full font-semibold">
            Blendit!
          </Button>
          <p className="text-gray-400 text-sm">이 음악에 섞여보세요!</p>
        </div>
      </div>
    </div>
  );
};

export default ContributorsSection;
