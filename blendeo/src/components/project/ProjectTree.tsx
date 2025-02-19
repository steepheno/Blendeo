import { useEffect, useState } from 'react';
import { projectTreeAPI } from '@/api/project';
import type { ProjectTreeData } from '@/types/components/project/project';
import Layout from '@/components/layout/Layout';
import ProjectNetwork from './ProjectNetwork'; // 기존의 네트워크 시각화 컴포넌트
import { useParams } from 'react-router-dom';
import ErrorPage from '@/pages/error/ErrorMessage';

const ProjectTree = () => {

    const { projectId } = useParams();   // URL에서 projectId 읽기
    const projectIdNum = projectId ? Number(projectId) : undefined;

    const [treeData, setTreeData] = useState<ProjectTreeData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTreeData = async () => {
            if (!projectIdNum) return;  // projectId가 없으면 리턴
            try {
                setIsLoading(true);
                const response = await projectTreeAPI.getProjectTree(projectIdNum);
                setTreeData(response);
              } catch (err) {
                setError('지금 바로 음악을 만들어보는 건 어때요?');
                console.log(err);
              } finally {
                setIsLoading(false);
              }
        };

        fetchTreeData();
    }, [projectIdNum]);

    const handleNodeClick = (nodeId: number) => {
        // 노드 클릭 시 처리할 로직
        console.log('Node clicked:', nodeId);
    };

    if (isLoading) {
        return (
            <Layout showRightSidebar={false}>
                <div>로딩 중...</div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout showRightSidebar={false}>
                <div> <ErrorPage title="이 프로젝트에게는 아직 가족이 없어요." message={error}/></div>
            </Layout>
        );
    }

    if (!treeData) {
        return (
            <Layout showRightSidebar={false}>
                <div>데이터가 없습니다.</div>
            </Layout>
        );
    }

    return (
        <Layout showRightSidebar={false}>
          <ProjectNetwork 
            data={treeData} 
            onNodeClick={handleNodeClick}
            initialFocusNode={projectIdNum}  // 추가: URL의 projectId를 초기 포커스 노드로 전달
          />
        </Layout>
      );
};

export default ProjectTree;