package Blendeo.backend.notification.service;

import Blendeo.backend.comment.repository.CommentRepository;
import Blendeo.backend.exception.EntityNotFoundException;
import Blendeo.backend.global.error.ErrorCode;
import Blendeo.backend.infrastructure.redis.RedisPublisher;
import Blendeo.backend.infrastructure.redis.RedisSubscriber;
import Blendeo.backend.notification.dto.Notification;
import Blendeo.backend.notification.dto.Notification.NotificationType;
import Blendeo.backend.project.repository.ProjectRepository;
import Blendeo.backend.user.entity.User;
import Blendeo.backend.user.repository.UserRepository;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Slf4j
@Service
public class NotificationService {

    private final RedisPublisher redisPublisher;
    private final RedisSubscriber redisSubscriber;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ProjectRepository projectRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;


    public NotificationService(
            RedisPublisher redisPublisher,
            RedisSubscriber redisSubscriber,
            RedisTemplate<String, Object> redisTemplate,
            ProjectRepository projectRepository,
            CommentRepository commentRepository,
            UserRepository userRepository) {
        this.redisPublisher = redisPublisher;
        this.redisSubscriber = redisSubscriber;
        this.redisTemplate = redisTemplate;
        this.projectRepository = projectRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
    }

    // 댓글 작성자가 관리자 롤인지 일반 유저인지에 따라 알림 발송!
    public void publishNotification(Long projectId, Long savedCommentId, User commenter) {

        User projectAuthor = projectRepository.findAuthorByProjectId(projectId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.USER_NOT_FOUND,
                        ErrorCode.USER_NOT_FOUND.getMessage()));

        if (projectAuthor.getId() != commenter.getId()) {
            publishEventToRedis(
                    projectId,
                    savedCommentId,
                    commenter.getId(),
                    projectAuthor.getId()
            );
        }

    }

    // 알림 데이터를 생성해서 redis에 저장, 특정 채널에 publish
    public void publishEventToRedis(Long projectId, Long savedCommentId, int senderId, int receiverId) {
        String content = "새로운 댓글이 달렸습니다!";
        Boolean isRead = false;
        NotificationType notificationType = NotificationType.CHAT;
        LocalDateTime now = LocalDateTime.now();

        Notification notification = new Notification(receiverId, senderId, content, isRead, now, notificationType);

        // redis key 지정
        String KEY_PREFIX = "notification:comment:";
        String notificationKey = KEY_PREFIX + savedCommentId + ":" + receiverId;

        // redis publishing
        // ttl : 3 -> 3일 뒤 redis에서 삭제
        redisPublisher.saveNotificationWithTTL(notificationKey, notification, 3, TimeUnit.DAYS);
        redisPublisher.publish("commentNotification", notificationKey);
    }

    // SSE Emitter 생성
    public SseEmitter createEmitter(int userId) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        redisSubscriber.addEmitter(userId, emitter);

        ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();
        executor.scheduleAtFixedRate(() -> sendHeartbeat(userId, emitter, executor), 0, 15, TimeUnit.SECONDS);

        setEmitterCallbacks(userId, emitter, executor);
        return emitter;
    }

    // SSE 연결을 유지
    private void sendHeartbeat(int userId, SseEmitter emitter, ScheduledExecutorService executor) {
        try {
            emitter.send(SseEmitter.event()
                    .name("heartbear")
                    .data("heartbeat"));

        } catch (IOException e) {
            log.warn(
                    "Error sending heartbeat, connection might be closed.  Removing emitter and shutting down executor",
                    e);
            redisSubscriber.removeEmitter(userId, emitter);
            executor.shutdown();
        }
    }

    // Emitter의 콜백을 설정하여 완료, 타임아웃, 오류 시 Emitter를 제거
    private void setEmitterCallbacks(int userId, SseEmitter emitter, ScheduledExecutorService executor) {
        emitter.onCompletion(() -> {
            redisSubscriber.removeEmitter(userId, emitter);
            log.info("Emitter completed for user: {}", userId);
            executor.shutdown();
        });

        emitter.onTimeout(() -> {
            redisSubscriber.removeEmitter(userId, emitter);
            log.info("Emitter timed out for user: {}", userId);
            executor.shutdown();
        });

        emitter.onError((Throwable t) -> {
            redisSubscriber.removeEmitter(userId, emitter);
            log.info("Emitter error for user: {}", userId, t);
            executor.shutdown();
        });
    }

}
