import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronUp, ChevronDown} from "lucide-react";
import ForkVideoRecorder from '@/components/record/ForkVideoRecorder';
import useForkVideoStore from '@/stores/forkVideoStore';
import { toast } from "sonner";



function ForkRecordPage() {
  const navigate = useNavigate();
  const project = useForkVideoStore((state) => state.originalProjectData);
  const loopCnt = useForkVideoStore((state) => state.loopCnt);
  const setLoopCnt = useForkVideoStore((state) => state.setLoopCnt);


  const increaseCount = () => {
    setLoopCnt(loopCnt + 1);
  };

  const decreaseCount = () => {
    if (loopCnt > 1) {
      setLoopCnt(loopCnt - 1);
    }
  };


  useEffect(() => {
    if (!project) {
      toast.error('프로젝트를 찾을 수 없습니다.');
      navigate('/');
    }
  }, [project, navigate]);

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen bg-darkblue overflow-hidden relative">
      {/* 이미지 오버레이 */}
      <div
        className="flex justify-center absolute left-0 right-0 bottom-0 z-0 mx-auto"
      >
        <img
          src="/images/purplelight.png"
          alt="Purple Light"
          className='flex w- h-80'
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 scale-90 z-10">
        <ForkVideoRecorder videoUrl={project.videoUrl} repeatCount={loopCnt} />
      </div>

      <div className="flex flex-col z-10">
        <div className="flex justify-center text-white font-orbitron font-extrabold text-[44px]">
          BLENDIT!
        </div>
        <div className="flex justify-center pt-2 text-center text-[#7F8490] text-lg">
          원본 동영상의 반복 횟수를 지정하고 해당 시간만큼<br />
          영상을 촬영해주세요!
        </div>

        {/* 반복횟수 */}
        <div className="mb-6 mt-6 flex justify-center z-10">
          <div className="flex flex-row items-center gap-3">
            <button onClick={increaseCount} className="text-white hover:text-[#7c3aed]">
              <ChevronUp className="h-6 w-6" />
            </button>
            <span className="text-xl font-medium text-white">{loopCnt}</span>
            <button onClick={decreaseCount} className="text-white hover:text-[#7c3aed]">
              <ChevronDown className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForkRecordPage;
