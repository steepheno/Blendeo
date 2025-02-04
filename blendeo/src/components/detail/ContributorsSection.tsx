import { Contributor } from "@/types/components/video/videoDetail";

// Contributors Section Component
const ContributorsSection: React.FC = () => {
  const contributors: Contributor[] = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    name: `Contributor ${i + 1}`,
    role: "Piano",
    collaborations: 3,
    avatarUrl: "/api/placeholder/48/48",
  }));

  return (
    <div className="p-4 space-y-4">
      {contributors.map((contributor) => (
        <div key={contributor.id} className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img
              src={contributor.avatarUrl}
              alt={contributor.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{contributor.name}</h3>
            <p className="text-sm text-gray-500">
              {contributor.role} • {contributor.collaborations} collaborations
            </p>
          </div>
          <button
            type="button"
            className="px-4 py-1 text-sm border border-purple-600 text-purple-600 rounded-full hover:bg-purple-50 transition-colors"
          >
            Follow
          </button>
        </div>
      ))}
    </div>
  );
};

export default ContributorsSection;
