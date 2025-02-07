package Blendeo.backend.project.service;

import Blendeo.backend.exception.EntityNotFoundException;
import Blendeo.backend.global.error.ErrorCode;
import Blendeo.backend.notification.service.NotificationService;
import Blendeo.backend.global.lock.RedisLockManager;
import Blendeo.backend.project.entity.Likes;
import Blendeo.backend.project.entity.Project;
import Blendeo.backend.project.repository.LikeRepository;
import Blendeo.backend.project.repository.ProjectRepository;
import Blendeo.backend.user.entity.User;
import Blendeo.backend.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.core.RedisOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SessionCallback;
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
    private final RedisLockManager redisLockManager;

    @Transactional
    public void addLike(long projectId, int userId) {
        String lockKey = "lock:project:" + projectId;

        try {
            // 락 획득 시도
            if (!redisLockManager.tryLock(lockKey)) {
                throw new RuntimeException("락 획득 실패");
            }

            // 중복 좋아요 체크
            if (likeRepository.existsByUserIdAndProjectId(userId, projectId)) {
                return;
            }

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException(ErrorCode.USER_NOT_FOUND, ErrorCode.USER_NOT_FOUND.getMessage()));

            Project project = projectRepository.findById(projectId)
                    .orElseThrow(() -> new EntityNotFoundException(ErrorCode.PROJECT_NOT_FOUND, ErrorCode.PROJECT_NOT_FOUND.getMessage()));

            String likeSetKey = "like:set:" + projectId;
            String likeScoreKey = "like:score";

            // Redis 트랜잭션 시작
            redisTemplate.execute(new SessionCallback<List<Object>>() {
                @Override
                public List<Object> execute(@NonNull RedisOperations operations) {
                    operations.multi();
                    redisTemplate.opsForSet().add(likeSetKey, String.valueOf(userId));
                    redisTemplate.opsForZSet().incrementScore(likeScoreKey, String.valueOf(projectId), 1);
                    return operations.exec();
                }
            });

            // MySQL 저장
            likeRepository.save(new Likes(user, project));

        } finally {
            // 락 해제
            redisLockManager.unlock(lockKey);
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

        notificationService.publishLikeNotification(projectId, user);
    }

    @Transactional
    public void removeLike(long projectId, int userId) {
        String lockKey = "lock:project:" + projectId;

        try {
            if (!redisLockManager.tryLock(lockKey)) {
                throw new RuntimeException("락 획득 실패");
            }

            if (!likeRepository.existsByUserIdAndProjectId(userId, projectId)) {
                return;
            }

            String likeSetKey = "like:set:" + projectId;
            String likeScoreKey = "like:score";

            redisTemplate.execute(new SessionCallback<List<Object>>() {
                @Override
                public List<Object> execute(@NonNull RedisOperations operations) {
                    operations.multi();
                    redisTemplate.opsForSet().remove(likeSetKey, String.valueOf(userId));
                    redisTemplate.opsForZSet().incrementScore(likeScoreKey, String.valueOf(projectId), -1);
                    return operations.exec();
                }
            });

            likeRepository.deleteByUserIdAndProjectId(userId, projectId);

        } finally {
            redisLockManager.unlock(lockKey);
        }
    }
}
