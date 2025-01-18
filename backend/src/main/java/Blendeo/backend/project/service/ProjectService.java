package Blendeo.backend.project.service;

import Blendeo.backend.project.dto.ProjectCreateReq;
import Blendeo.backend.project.dto.ProjectInfoRes;

public interface ProjectService {
    void createProject(ProjectCreateReq projectCreateReq);
}