import { useProjectStore } from '@/stores/projectStore';
import { useNavigate } from 'react-router-dom';

interface SettingsSectionProps {
  projectId: number;
}

const SettingsSection = ( { projectId } : SettingsSectionProps) => {
  const navigate = useNavigate();
  const deletePjt = useProjectStore((state) => state.deleteProject);
  
  const deleteProject = async () => {
    try {
      // 삭제 전 대화상자
      const result = confirm("프로젝트를 정말 삭제하시겠습니까? 삭제 시 복구할 수 없습니다.")
      if (result) {
        // 확인 누르면 삭제
        await deletePjt(projectId);
        alert("프로젝트 삭제가 완료되었습니다.");
        navigate("/main")
      }
    } catch (error) {
      console.error("프로젝트 삭제 실패: ", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* 수정과 삭제 */}
          <div className='flex gap-10'>
            <a className='cursor-pointer'>수정</a>
            <a onClick={deleteProject} className='cursor-pointer'>삭제</a>
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