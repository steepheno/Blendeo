package Blendeo.backend.project.service;

import Blendeo.backend.exception.EntityNotFoundException;
import Blendeo.backend.project.dto.ProjectCreateReq;
import Blendeo.backend.project.dto.ProjectInfoRes;
import Blendeo.backend.project.entity.Project;
import Blendeo.backend.project.repository.ProjectRepository;
import Blendeo.backend.project.util.VideoDurationExtractor;
import Blendeo.backend.user.entity.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final VideoService videoService;

    @Override
    public void createProject(ProjectCreateReq projectCreateReq) {

        MultipartFile videoFile = projectCreateReq.getVideoFile();
        String videoUrl = videoService.uploadVideo(videoFile);
        int duration = VideoDurationExtractor.extractVideoDuration(videoFile);

        Project project = Project.builder()
                .title(projectCreateReq.getTitle())
                .author(User.builder()
                        .id(1)
                        .email("ms9648@naver.com")
                        .nickname("민서김")
                        .password("12341234")
                        .build())
                .contents(projectCreateReq.getContent())
                .videoUrl(videoUrl)
                .runningTime(duration)
                .build();

        projectRepository.save(project);
    }

    @Override
    public ProjectInfoRes getProjectInfo(Long projectId) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("해당하는 프로젝트가 존재하지 않습니다."));

        String forkProjectName = "";
        return ProjectInfoRes.builder()
                .id(project.getId())
                .projectTitle(project.getTitle())
                .state(project.isState())
                .forkId(project.getForkId())
                .forkProjectName(forkProjectName)
                .contributorCnt(project.getContributorCnt())
                .runningTime(project.getRunningTime())
                .createdAt(project.getCreatedAt())
                .contents(project.getContents())
                .thumbnail(project.getThumbnail())
                .viewCnt(project.getViewCnt())
                .build();
    }

    @Override
    public void deleteProject(Long projectId) {
        projectRepository.deleteById(projectId);
    }
}
