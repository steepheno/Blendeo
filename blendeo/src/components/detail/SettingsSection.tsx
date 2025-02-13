import { useState, useEffect } from 'react';
import useCommentStore from '@/stores/commentStore';

interface SettingsSectionProps {
  projectId: number;
}

const SettingsSection = ( { projectId } : SettingsSectionProps) => {
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
          {/* 수정과 삭제 */}
          <div className='flex gap-10'>
            <a className='cursor-pointer'>수정</a>
            <a className='cursor-pointer'>삭제</a>
          </div>
          {/* 제목과 타이틀 */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              제목
            </label>
            <input
              type="text"
              id="title"
              name="title"
              // value={formData.title}
              // onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="비디오 제목을 입력하세요"
              required
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              내용
            </label>
            <textarea
              id="content"
              name="content"
              // value={formData.content}
              // onChange={handleInputChange}
              rows={19}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="비디오 설명을 입력하세요"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;