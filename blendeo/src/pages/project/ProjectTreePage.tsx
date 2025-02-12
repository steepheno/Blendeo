import React from 'react';
import { useParams } from 'react-router-dom';
import ProjectTree from '@/components/project/ProjectTree';

const ProjectTreePage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    return <div>잘못된 접근입니다.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">프로젝트 트리</h1>
      <ProjectTree />
    </div>
  );
};

export default ProjectTreePage;