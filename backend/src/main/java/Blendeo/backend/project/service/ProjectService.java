package Blendeo.backend.project.service;

import Blendeo.backend.instrument.dto.InstrumentGetRes;
import Blendeo.backend.project.dto.*;
import Blendeo.backend.project.entity.Project;

import java.util.List;

public interface ProjectService {

    Project createProject(ProjectCreateReq projectCreateReq);

    ProjectGetRes getProjectInfo(Long projectId);

    void deleteProject(Long projectId, int userId);

    void modifyProjectState(int userId, Long projectId, boolean state);

    void modifyProjectContents(int userId, Long projectId, String contents);

    void modifyProjectTitle(int userId, Long projectId, String title);

    List<ProjectListDto> getNewProjectList(int page, int size);

    List<InstrumentGetRes> saveProjectInstruments(long projectId, List<Integer> instrumentIds);

    List<InstrumentGetRes> saveEtcInstruments(Long id, List<String> etcInstrumentNames);

    List<ProjectListDto> getUserProjectList(int userId, int page, int size);

    List<ProjectListDto> getFollowingProjectList(int userId, int page, int size);

    ProjectInfoRes getSiblingProject(Long currentProjectId, String direction);

    List<ProjectNodeInfoRes> getContributorInfo(long projectId);

    ProjectInfoRes getParentInfo(long projectId);

    List<ProjectInfoRes> getChildrenInfo(long projectId);

    ProjectGetRes getRandomProjectInfo();

    ProjectLikeAndScrapRes getProjectStatusInfo(int userId, long projectId);
}