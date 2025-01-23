package Blendeo.backend.project.service;

import Blendeo.backend.exception.EntityNotFoundException;
import Blendeo.backend.exception.ProjectNotFoundException;
import Blendeo.backend.project.entity.Like;
import Blendeo.backend.project.entity.Project;
import Blendeo.backend.project.repository.LikeRepository;
import Blendeo.backend.project.repository.ProjectRepository;
import Blendeo.backend.user.entity.User;
import Blendeo.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public void addLike(long projectId, String userEmail) {
        User user = userRepository.findByEmail(userEmail);
        if (user == null) {
            throw new EntityNotFoundException("유저 정보를 찾을 수 없습니다.");
        }

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException("프로젝트를 찾을 수 없습니다."));

        likeRepository.save(new Like(user, project));
    }
}
