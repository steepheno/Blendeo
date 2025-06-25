package Blendeo.backend.notification.service;

import Blendeo.backend.comment.repository.CommentRepository;
import Blendeo.backend.exception.EntityNotFoundException;
import Blendeo.backend.global.error.ErrorCode;
import Blendeo.backend.infrastructure.redis.RedisPublisher;
import Blendeo.backend.infrastructure.redis.RedisSubscriber;
import Blendeo.backend.notification.dto.NotificationRedisDTO;
import Blendeo.backend.notification.dto.NotificationRes;
import Blendeo.backend.notification.entity.Notification;
import Blendeo.backend.notification.entity.Notification.NotificationType;
import Blendeo.backend.notification.repository.NotificationRepository;
import Blendeo.backend.project.repository.ProjectRepository;
import Blendeo.backend.user.entity.User;
import Blendeo.backend.user.repository.UserRepository;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Slf4j
@Service
@Transactional
public class NotificationService {

    private final RedisPublisher redisPublisher;
    private final RedisSubscriber redisSubscriber;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ProjectRepository projectRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    public NotificationService(RedisPublisher redisPublisher, RedisSubscriber redisSubscriber, @Qualifier("notificationRedisTemplate") RedisTemplate<String, Object> redisTemplate, ProjectRepository projectRepository, CommentRepository commentRepository, UserRepository userRepository, NotificationRepository notificationRepository) {
        this.redisPublisher = redisPublisher;
        this.redisSubscriber = redisSubscriber;
        this.redisTemplate = redisTemplate;
        this.projectRepository = projectRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    public User getProjectAuthor(Long projectId){
        User projectAuthor = projectRepository.findAuthorById(projectId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.USER_NOT_FOUND,
                        ErrorCode.USER_NOT_FOUND.getMessage()));
        return projectAuthor;
    }

    /**
     *
     * 댓글 알림
     */
    // 댓글 작성자가 본인 게시글인지 아닌지에 따라 알림 발송
    public void publishCommentNotification(Long projectId, User commenter) {

        User projectAuthor = getProjectAuthor(projectId);

        if (projectAuthor.getId() != commenter.getId()) {
            createAndPublishCommentNotification(
                    commenter,
                    projectAuthor
            );
        }
    }

    // 알림 데이터를 생성해서 redis에 저장, 특정 채널에 publish
    public void createAndPublishCommentNotification(User sender, User receiver) {
        String content = sender.getNickname() + "님이 새로운 댓글을 다셨습니다.";

        Boolean isRead = false;

        NotificationType notificationType = NotificationType.COMMENT;

        Notification notification = new Notification(receiver, sender, content, isRead, notificationType);

        createNotification(notification);

        NotificationRedisDTO notificationRedis = NotificationRedisDTO.from(notification);

        // 해당 프로젝트로 redirect하게 할까..?

        // redis key 지정
        String KEY_PREFIX = "notification:comment:";
        String notificationKey = KEY_PREFIX + notificationRedis.getId() + ":" + receiver.getId();

        // redis publishing
        // ttl : 3 -> 3일 뒤 redis에서 삭제
        redisPublisher.saveNotificationWithTTL(notificationKey, notificationRedis, 3, TimeUnit.DAYS);
        redisPublisher.publish("notification:comment", notificationRedis);
    }

    /**
     *
     * 좋아요 알림
     */

    public void publishLikeNotification(Long projectId, User liker){
        User projectAuthor = getProjectAuthor(projectId);

        if (projectAuthor.getId() != liker.getId()) {
            log.info("like 한 사람과 project owner는 다른 사람입니다.");
            createAndPublishLikeNotification(
                    liker,
                    projectAuthor
            );
        }
    }

    public void createAndPublishLikeNotification(User sender, User receiver){
        String content = sender.getNickname() + "님이 회원님의 게시물을 좋아합니다.";
        Boolean isRead = false;
        NotificationType notificationType = NotificationType.LIKE;
        Notification notification = new Notification(receiver, sender, content, isRead, notificationType);

        createNotification(notification);

        NotificationRedisDTO notificationRedis = NotificationRedisDTO.from(notification);

        String Key_Prefix = "notification:like:";
        String notificationKey = Key_Prefix + notificationRedis.getId() + ":" + receiver.getId();

        redisPublisher.saveNotificationWithTTL(notificationKey, notificationRedis, 3, TimeUnit.DAYS);
        log.info("Like :: redis에 저장됨");
        redisPublisher.publish("notification:like", notificationRedis);
        log.info("Like :: publish 완료");
    }


    // DB에 알림 저장
    public void createNotification(Notification notification) {
        log.debug("Notification entity before save: {}", notification);
        try {
            notificationRepository.save(notification);
        } catch (Exception e) {
            log.error("Cannot save notification: {}", notification, e);
        }
    }


    // SSE Emitter 생성
    public SseEmitter createEmitter(int userId) {
        log.info("createEmitter started");
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        redisSubscriber.addEmitter(userId, emitter);

        ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();
        executor.scheduleAtFixedRate(() -> sendHeartbeat(userId, emitter, executor), 0, 15, TimeUnit.SECONDS);

        setEmitterCallbacks(userId, emitter, executor);

        log.info("createEmitter end");
        return emitter;
    }
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

    public void readNotification(int userId, Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.NOTIFICATION_NOT_FOUND, ErrorCode.NOTIFICATION_NOT_FOUND.getMessage()));

        if (userId != notification.getReceiver().getId()) {
            throw new EntityNotFoundException(ErrorCode.UNAUTHORIZED_ACCESS, ErrorCode.UNAUTHORIZED_ACCESS.getMessage());
        }

        notification.readNotification(true);
    }

    public void readAllNotification(int userId) {
        List<Notification> notifications = notificationRepository.findAllByUserId(userId);

        for (Notification notification : notifications) {
            notification.readNotification(true);
        }
    }

    public List<NotificationRes> getWeekNotification(int userId) {
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusDays(7);
        List<Notification> notifications = notificationRepository.findAllByUserIdAWithWeek(startDate, endDate, userId);


        return notifications.stream()
                .map(notification -> NotificationRes.builder()
                        .notificationId(notification.getId())
                        .receiverId(notification.getReceiver().getId())
                        .senderId(notification.getSender().getId())
                        .isRead(notification.getIsRead())
                        .content(notification.getContent())
                        .profileImage(notification.getSender().getProfileImage())
                        .nickname(notification.getSender().getNickname())
                        .build())
                .collect(Collectors.toList());
    }
}
