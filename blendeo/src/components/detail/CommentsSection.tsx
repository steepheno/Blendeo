import { useProjectStore } from "@/stores/projectStore";
import { useAuthStore } from "@/stores/authStore";
import { useEffect, useState, useCallback } from "react"; // useCallback 추가
import { Loader2, Trash2, AlertCircle } from "lucide-react";

interface CommentsSectionProps {
  projectId: number;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ projectId }) => {
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getComments, createComment, deleteComment, comments } =
    useProjectStore();
  const { user } = useAuthStore();

  // fetchComments를 useCallback으로 감싸기
  const fetchComments = useCallback(async () => {
    if (!projectId) return;

    try {
      setIsLoading(true);
      setError(null);
      await getComments(projectId);
    } catch (err) {
      setError("Failed to load comments");
      console.error("Error fetching comments:", err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, getComments]); // 의존성 배열에 필요한 값들 포함

  useEffect(() => {
    fetchComments();
  }, [fetchComments]); // fetchComments만 의존성으로 추가

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    if (!user) {
      setError("Please sign in to comment");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await createComment(projectId, newComment);
      setNewComment("");
    } catch (err) {
      setError("Failed to post comment");
      console.error("Error creating comment:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      await deleteComment(commentId, projectId);
    } catch (err) {
      setError("Failed to delete comment");
      console.error("Error deleting comment:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {isLoading && !comments.length ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {comments.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex space-x-2 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={
                        comment.user.profileImage || "/api/placeholder/32/32"
                      }
                      alt={comment.user.nickname}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">
                          {comment.user.nickname}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      {user?.id === comment.user.id && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Delete comment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-sm mt-1">{comment.comment}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img
              src={user?.profileImage || "/api/placeholder/32/32"}
              alt="Your profile"
              className="w-full h-full object-cover"
            />
          </div>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={
              user ? "Add a comment..." : "Please sign in to comment"
            }
            disabled={!user || isLoading}
            className="flex-1 px-4 py-2 rounded-full bg-gray-100 text-sm 
                     focus:outline-none focus:ring-2 focus:ring-purple-500 
                     focus:ring-opacity-50 disabled:opacity-50 
                     disabled:cursor-not-allowed"
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmitComment();
              }
            }}
          />
          <button
            type="button"
            onClick={handleSubmitComment}
            disabled={!user || isLoading || !newComment.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-full 
                     text-sm font-medium hover:bg-purple-700 
                     transition-colors disabled:opacity-50 
                     disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentsSection;
