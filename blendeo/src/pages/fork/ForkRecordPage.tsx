import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ForkVideoRecorder from '@/components/record/ForkVideoRecorder';
import useForkVideoStore from '@/stores/forkVideoStore';

function ForkRecordPage() {
  const navigate = useNavigate();
  const project = useForkVideoStore((state) => state.originalProjectData);
  const loopCnt = useForkVideoStore((state) => state.loopCnt);
  const setLoopCnt = useForkVideoStore((state) => state.setLoopCnt);

  useEffect(() => {
    if (!project) {
      alert('프로젝트를 찾을 수 없습니다.');
      navigate('/');
    }
  }, [project, navigate]);

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          프로젝트 영상 반복 재생
        </h1>

        <div className="mb-6">
          <label htmlFor="repeatCount" className="block text-sm font-medium text-gray-700 mb-2">
            반복 횟수
          </label>
          <input
            id="repeatCount"
            type="number"
            min="1"
            value={loopCnt}
            onChange={(e) => setLoopCnt(parseInt(e.target.value))}
            className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <ForkVideoRecorder 
          videoUrl={project.videoUrl} 
          repeatCount={loopCnt}
        />
      </div>
    </div>
  );
}

export default ForkRecordPage;