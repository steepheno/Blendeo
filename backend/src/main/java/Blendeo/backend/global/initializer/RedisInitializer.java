package Blendeo.backend.global.initializer;

import Blendeo.backend.project.entity.Likes;
import Blendeo.backend.project.repository.LikeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class RedisInitializer {
    private final LikeRepository likeRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private static final int PAGE_SIZE = 1000;

    @PostConstruct
    public void initializeRedisFromDB() {
        try {
            log.info("DB로부터 필요한 내용을 Redis에 반영합니다.");

            int pageNumber = 0;
            Page<Likes> likesPage;
            Map<Long, Integer> projectLikeCount = new HashMap<>();

            do {
                Pageable pageable = PageRequest.of(pageNumber, PAGE_SIZE);
                likesPage = likeRepository.findAll(pageable);

                processBatch(likesPage.getContent(), projectLikeCount);

                log.info("진행 페이지: {}, 데이터 수: {}개", pageNumber, likesPage.getNumberOfElements());
                pageNumber++;
            } while (likesPage.hasNext());

            updateLikeScores(projectLikeCount);

            log.info("레디스 초기화 완료! 총 페이지 수: {}", pageNumber);
        } catch (Exception e) {
            log.error("DB로부터 데이터를 불러오지 못했습니다.", e);
            throw new RuntimeException("Redis 초기화 실패", e);
        }
    }

    private void processBatch(List<Likes> likes, Map<Long, Integer> projectLikeCount) {
        try {
            for (Likes like : likes) {
                long projectId = like.getProject().getId();
                int userId = like.getUser().getId();

                String likeSetKey = "like:set:" + projectId;
                redisTemplate.opsForSet().add(likeSetKey, String.valueOf(userId));

                projectLikeCount.merge(projectId, 1, Integer::sum);
            }
        } catch (Exception e) {
            log.error("배치 작업을 실패하였습니다.", e);
            throw new RuntimeException("배치 작업을 실패하였습니다.", e);
        }
    }

    private void updateLikeScores(Map<Long, Integer> projectLikeCount) {
        try {
            String likeScoreKey = "like:score";
            for (Map.Entry<Long, Integer> entry : projectLikeCount.entrySet()) {
                redisTemplate.opsForZSet().add(
                        likeScoreKey,
                        String.valueOf(entry.getKey()),
                        entry.getValue()
                );
            }
        } catch (Exception e) {
            log.error("랭킹 점수 로딩 실패", e);
            throw new RuntimeException("랭킹 점수 로딩 실패", e);
        }
    }
}
