import React, { useEffect, useState } from 'react';
import { projectTreeAPI } from '@/api/project';
import type { ProjectTreeData } from '@/types/components/project/project';
import Layout from '@/components/layout/Layout';
import ProjectNetwork from './ProjectNetwork'; // 기존의 네트워크 시각화 컴포넌트
import { useParams } from 'react-router-dom';

const ProjectTree: React.FC = () => {

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
                setError('프로젝트 트리를 불러오는데 실패했습니다.');
                console.error('Error fetching project tree:', err);
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
                <div>{error}</div>
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