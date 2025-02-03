// Comments Section Component
import { Comment } from "@/types/components/video/videoDetail";

const CommentsSection: React.FC = () => {
  const comments: Comment[] = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    author: `User ${i + 1}`,
    content: "Great performance! Keep it up!",
    timeAgo: "2d",
    avatarUrl: "/api/placeholder/32/32",
  }));

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-2 p-2">
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={comment.avatarUrl}
                  alt={comment.author}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{comment.author}</span>
                  <span className="text-xs text-gray-500">
                    {comment.timeAgo}
                  </span>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img
              src="/api/placeholder/32/32"
              alt="Your profile"
              className="w-full h-full object-cover"
            />
          </div>
          <input
            type="text"
            placeholder="Add a comment..."
            className="flex-1 px-4 py-2 rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          />
          <button
            type="button"
            className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentsSection;
