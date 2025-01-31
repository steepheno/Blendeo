package Blendeo.backend.project.service;

import Blendeo.backend.project.dto.ProjectCreateReq;
import Blendeo.backend.project.dto.ProjectInfoRes;

public interface ProjectService {
    int createProject(ProjectCreateReq projectCreateReq);
    ProjectInfoRes getProjectInfo(Long projectId);
    void deleteProject(Long projectId);
    void modifyProjectState(Long projectId, boolean state);
    void modifyProjectContents(Long projectId, String contents);
}