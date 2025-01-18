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
}
