import React, { useState } from 'react';
import { useEditStore } from '@/stores/projectStore';
import { createProject } from '@/api/project';
import { useNavigate } from 'react-router-dom';

interface VideoFormData {
  title: string;
  content: string;
  state: boolean;
  forkProjectId?: number;
}

const VideoEditPage: React.FC = () => {
  const navigate = useNavigate();
  const url = useEditStore((state) => state.url);

  const [formData, setFormData] = useState<VideoFormData>({
    title: '',
    content: '',
    state: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      console.error('비디오 URL이 없습니다.');
      return;
    }

    setIsSubmitting(true);

    try {
      const projectData = {
        ...formData,
        videoUrl: url
      };
      const response = await createProject(projectData);
      alert('프로젝트가 성공적으로 생성되었습니다.');
      navigate("/project/"+response);
    } catch (error) {
      alert('프로젝트 생성에 실패했습니다. 다시 시도해주세요.');
      console.error('프로젝트 생성 중 오류가 발생했습니다:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!url) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-600">URL이 없습니다. 먼저 비디오를 업로드해주세요.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">비디오 편집</h1>

        <div className="mb-8">
          <video
            className="w-full rounded-lg shadow-lg"
            controls
            src={url}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              value={formData.title}
              onChange={handleInputChange}
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
              value={formData.content}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="비디오 설명을 입력하세요"
              required
            />
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="state"
                checked={formData.state}
                onChange={handleCheckboxChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">프로젝트 공개</span>
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
            >
              {isSubmitting ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VideoEditPage;