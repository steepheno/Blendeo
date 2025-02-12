package Blendeo.backend.project.service;

import Blendeo.backend.instrument.dto.InstrumentGetRes;
import Blendeo.backend.project.dto.*;
import Blendeo.backend.project.entity.Project;

import java.util.List;

public interface ProjectService {

    Project createProject(ProjectCreateReq projectCreateReq);

    ProjectGetRes getProjectInfo(Long projectId);

    void deleteProject(Long projectId);

    void modifyProjectState(Long projectId, boolean state);

    void modifyProjectContents(Long projectId, String contents);

    List<ProjectListDto> getNewProjectList(int page, int size);

    List<InstrumentGetRes> saveProjectInstruments(long projectId, List<Integer> instrumentIds);

    List<InstrumentGetRes> saveEtcInstruments(Long id, List<String> etcInstrumentNames);

    List<ProjectListDto> getUserProjectList(int userId, int page, int size);

    List<ProjectListDto> getFollowingProjectList(int userId, int page, int size);

    ProjectInfoRes getSiblingProject(Long currentProjectId, String direction);

    List<ProjectContributeInfoRes> getContributorInfo(int projectId);
}