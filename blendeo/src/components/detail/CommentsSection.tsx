import { useState, useEffect } from 'react';
import useCommentStore from '@/stores/commentStore';

interface CommentsSectionProps {
  projectId: number;
}

const CommentsSection = ( { projectId } : CommentsSectionProps) => {
  const [newComment, setNewComment] = useState('');
  const { comments, loading, error, fetchComments, addComment } =
    useCommentStore();

  useEffect(() => {
    console.log("herrrrr,",projectId);
    
    fetchComments(projectId);
  }, [fetchComments, projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      await addComment(projectId, newComment.trim());
      setNewComment('');
    }
  };

  if (loading) {
    return <div>Loading comments...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-2 p-2">
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={comment.userProfile}
                  alt={comment.userNickname}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{comment.userNickname}</span>
                  <span className="text-xs text-gray-500">
                    {comment.createdAt}
                  </span>
                </div>
                <p className="text-sm">{comment.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-4 py-2 rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentsSection;