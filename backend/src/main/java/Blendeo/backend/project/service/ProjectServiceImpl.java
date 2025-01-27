package Blendeo.backend.project.service;

import Blendeo.backend.exception.EntityNotFoundException;
import Blendeo.backend.global.error.ErrorCode;
import Blendeo.backend.project.dto.ProjectCreateReq;
import Blendeo.backend.project.dto.ProjectInfoRes;
import Blendeo.backend.project.entity.Project;
import Blendeo.backend.project.entity.ProjectNode;
import Blendeo.backend.project.repository.ProjectNodeRepository;
import Blendeo.backend.project.repository.ProjectRepository;
import Blendeo.backend.project.util.VideoDurationExtractor;
import Blendeo.backend.user.entity.User;
import Blendeo.backend.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectNodeRepository projectNodeRepository;
    private final VideoService videoService;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void createProject(ProjectCreateReq projectCreateReq) {
        MultipartFile videoFile = projectCreateReq.getVideoFile();
        String videoUrl = videoService.uploadVideo(videoFile);
        int duration = VideoDurationExtractor.extractVideoDuration(videoFile);

        User user = userRepository.findById(projectCreateReq.getUserId())
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.USER_NOT_FOUND, ErrorCode.USER_NOT_FOUND.getMessage()));

        Project project = Project.builder()
                .title(projectCreateReq.getTitle())
                .author(user)
                .forkId(projectCreateReq.getForkProjectId())
                .contents(projectCreateReq.getContent())
                .videoUrl(videoUrl)
                .runningTime(duration)
                .build();

        projectRepository.save(project);

        ProjectNode projectNode = ProjectNode.builder()
                .projectId(project.getId())
                .build();

        projectNodeRepository.save(projectNode);
        if (projectCreateReq.getForkProjectId() != null) {
            ProjectNode parentNode = projectNodeRepository.findByProjectId(projectCreateReq.getForkProjectId())
                    .orElseThrow(() -> new EntityNotFoundException(ErrorCode.PROJECT_NOT_FOUND, ErrorCode.PROJECT_NOT_FOUND.getMessage()));

            projectNodeRepository.createForkRelation(projectNode.getProjectId(), parentNode.getProjectId());
        }
    }

    @Override
    public ProjectInfoRes getProjectInfo(Long projectId) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.PROJECT_NOT_FOUND, ErrorCode.PROJECT_NOT_FOUND.getMessage()));

        return ProjectInfoRes.builder()
                .id(project.getId())
                .projectTitle(project.getTitle())
                .state(project.isState())
                .forkId(project.getForkId())
                .contributorCnt(project.getContributorCnt())
                .runningTime(project.getRunningTime())
                .createdAt(project.getCreatedAt())
                .contents(project.getContents())
                .thumbnail(project.getThumbnail())
                .viewCnt(project.getViewCnt())
                .build();
    }

    @Override
    @Transactional
    public void deleteProject(Long projectId) {
        projectRepository.deleteById(projectId);
        projectNodeRepository.deleteByProjectIdIfNotForked(projectId);
    }


    @Override
    @Transactional
    public void modifyProjectState(Long projectId, boolean state) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.PROJECT_NOT_FOUND, ErrorCode.PROJECT_NOT_FOUND.getMessage()));

        project.updateState(state);
    }

    @Override
    @Transactional
    public void modifyProjectContents(Long projectId, String contents) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.PROJECT_NOT_FOUND, ErrorCode.PROJECT_NOT_FOUND.getMessage()));

        project.updateContents(contents);
    }
}
