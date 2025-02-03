import { useProjectStore } from "@/stores/projectStore";
import { useEffect, useState } from "react";

interface CommentsSectionProps {
  projectId: number;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ projectId }) => {
  const [newComment, setNewComment] = useState("");
  const { getComments, createComment, comments } = useProjectStore();

  useEffect(() => {
    if (projectId) {
      getComments(projectId);
    }
  }, [projectId, getComments]);

  const handleSubmitComment = async () => {
    if (newComment.trim()) {
      try {
        await createComment(projectId, newComment);
        setNewComment("");
      } catch (error) {
        console.error("Failed to create comment:", error);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-2 p-2">
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={comment.user.profileImage || "/api/placeholder/32/32"}
                  alt={comment.user.nickname}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{comment.user.nickname}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm">{comment.comment}</p>
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
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-4 py-2 rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSubmitComment();
              }
            }}
          />
          <button
            type="button"
            onClick={handleSubmitComment}
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
