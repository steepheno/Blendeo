package Blendeo.backend.project.service;

import Blendeo.backend.project.dto.ProjectCreateReq;
import Blendeo.backend.project.dto.ProjectInfoRes;
import Blendeo.backend.project.dto.ProjectListDto;
import java.util.List;

public interface ProjectService {
    int createProject(ProjectCreateReq projectCreateReq);
    ProjectInfoRes getProjectInfo(Long projectId);
    void deleteProject(Long projectId);
    void modifyProjectState(Long projectId, boolean state);
    void modifyProjectContents(Long projectId, String contents);
    List<ProjectListDto> getNewProjectList(int page, int size);
}