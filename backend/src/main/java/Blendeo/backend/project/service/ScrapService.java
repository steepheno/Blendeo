package Blendeo.backend.project.service;

import Blendeo.backend.exception.EntityNotFoundException;
import Blendeo.backend.global.error.ErrorCode;
import Blendeo.backend.project.dto.ProjectScrapRes;
import Blendeo.backend.project.entity.Project;
import Blendeo.backend.project.entity.Scrap;
import Blendeo.backend.project.entity.ScrapId;
import Blendeo.backend.project.repository.ProjectRepository;
import Blendeo.backend.project.repository.ScrapRepository;
import Blendeo.backend.user.entity.User;
import Blendeo.backend.user.repository.UserRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ScrapService {
    private final ScrapRepository scrapRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    @Transactional
    public void scrapProject(int userId, long projectId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.USER_NOT_FOUND, ErrorCode.USER_NOT_FOUND.getMessage()));
        Project project = projectRepository.findById(projectId)
                        .orElseThrow(() -> new EntityNotFoundException(ErrorCode.PROJECT_NOT_FOUND, ErrorCode.PROJECT_NOT_FOUND.getMessage()));

        scrapRepository.save(new Scrap(project, user));
    }

    @Transactional
    public void deleteScrapProject(int userId, long projectId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.USER_NOT_FOUND, ErrorCode.USER_NOT_FOUND.getMessage()));

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.PROJECT_NOT_FOUND, ErrorCode.PROJECT_NOT_FOUND.getMessage()));

        if (project.getAuthor().getId() == user.getId()) {
            ScrapId scrapId = new ScrapId(projectId, userId);
            boolean exists = scrapRepository.existsById(scrapId);
            if (!exists) {
                throw new EntityNotFoundException(ErrorCode.SCRAP_NOT_FOUND, ErrorCode.SCRAP_NOT_FOUND.getMessage());
            }

            scrapRepository.deleteById(scrapId);
        }

    }

    public List<ProjectScrapRes> getScrapProject(int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.USER_NOT_FOUND, ErrorCode.USER_NOT_FOUND.getMessage()));

        List<Scrap> scraps = scrapRepository.findAllByUser(user)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.SCRAP_NOT_FOUND, ErrorCode.SCRAP_NOT_FOUND.getMessage()));

        return scraps.stream()
                .map(scrap -> {
                    Project project = projectRepository.findById(scrap.getProject().getId())
                            .orElseThrow(() -> new EntityNotFoundException(ErrorCode.PROJECT_NOT_FOUND, ErrorCode.PROJECT_NOT_FOUND.getMessage()));

                    User author = userRepository.findById(project.getAuthor().getId())
                            .orElseThrow(() -> new EntityNotFoundException(ErrorCode.USER_NOT_FOUND, ErrorCode.USER_NOT_FOUND.getMessage()));

                    return ProjectScrapRes.builder()
                            .projectId(project.getId())
                            .projectName(project.getTitle())
                            .authorId(author.getId())
                            .authorNickname(author.getNickname())
                            .viewCnt(project.getViewCnt())
                            .createdAt(project.getCreatedAt())
                            .build();
                })
                .collect(Collectors.toList());
    }


}
