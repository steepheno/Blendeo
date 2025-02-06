package Blendeo.backend.project.service;

import Blendeo.backend.exception.EntityNotFoundException;
import Blendeo.backend.global.error.ErrorCode;
import Blendeo.backend.notification.service.NotificationService;
import Blendeo.backend.project.entity.Likes;
import Blendeo.backend.project.entity.Project;
import Blendeo.backend.project.repository.LikeRepository;
import Blendeo.backend.project.repository.ProjectRepository;
import Blendeo.backend.user.entity.User;
import Blendeo.backend.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private final NotificationService notificationService;

    @Transactional
    public void addLike(long projectId, int userId) {
        if (likeRepository.existsByUserIdAndProjectId(userId, projectId)) {
            return;
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.USER_NOT_FOUND, ErrorCode.USER_NOT_FOUND.getMessage()));

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.PROJECT_NOT_FOUND, ErrorCode.PROJECT_NOT_FOUND.getMessage()));

        String likeSetKey = "like:set:" + projectId;
        String likeScoreKey = "like:score";

        redisTemplate.opsForSet().add(likeSetKey, String.valueOf(userId));
        redisTemplate.opsForZSet().incrementScore(likeScoreKey, String.valueOf(projectId), 1);

        likeRepository.save(new Likes(user, project));
        log.info("Added like " + user + " to project " + project);

        notificationService.publishLikeNotification(projectId, user);
        log.info("published like notification");

//        notificationService.publishNotification(commentRegisterReq.getProjectId(), user);
    }

    @Transactional
    public void removeLike(long projectId, int userId) {
        if (!likeRepository.existsByUserIdAndProjectId(userId, projectId)) {
            return;
        }

        String likeSetKey = "like:set:" + projectId;
        String likeScoreKey = "like:score";

        redisTemplate.opsForSet().remove(likeSetKey, String.valueOf(userId));
        redisTemplate.opsForZSet().incrementScore(likeScoreKey, String.valueOf(projectId), -1);

        likeRepository.deleteByUserIdAndProjectId(userId, projectId);
    }
}
