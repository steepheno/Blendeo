package Blendeo.backend.project.service;

import Blendeo.backend.project.dto.ProjectRankRes;
import Blendeo.backend.project.repository.LikeRepository;
import Blendeo.backend.project.repository.ProjectRepository;
import org.springframework.data.redis.connection.PoolException;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RankingService {
    private final RedisTemplate<String, String> redisTemplate;
    private final ProjectRepository projectRepository;
    private final LikeRepository likeRepository;

    private static final String RANKING_KEY = "like:score";
    private static final String VIEW_KEY = "viewcount:score";

    @CircuitBreaker(name = "redisCircuitBreaker", fallbackMethod = "getProjectRankingFromDB")
    public List<ProjectRankRes> getRankingByLikes() {
        try {
            Set<String> redisResult = redisTemplate.opsForZSet().reverseRange(RANKING_KEY, 0, 9);

            return processRankingResult(redisResult.stream()
                    .filter(Objects::nonNull)
                    .map(this::parseProjectId)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList()));
        } catch (PoolException e) {
            log.error("Redis 연결 실패 ", e);
            throw e;
        }
    }

    public List<ProjectRankRes> getProjectRankingFromDB(Throwable throwable) {
        log.info("Circuit Breaker 발동");
        log.warn("Fallback 메서드 호출! 예외 타입: {}", throwable.getClass().getName());

        List<Long> mysqlResult = likeRepository.getProjectRanking();
        return processRankingResult(mysqlResult);
    }

    private List<ProjectRankRes> processRankingResult(Collection<Long> result) {
        if (result == null || result.isEmpty()) {
            return Collections.emptyList();
        }

        List<Long> projectIds = result.stream()
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        return projectRepository.findProjectsWithAuthorByIds(projectIds);
    }

    private Long parseProjectId(String str) {
        try {
            return Long.parseLong(str);
        } catch (NumberFormatException e) {
            log.error("ProjectIds에 숫자가 아닌 다른 값이 포함되었습니다. {}", str);
            return null;
        }
    }

    public void incrementScore(Long projectId) {
        redisTemplate.opsForZSet().incrementScore(VIEW_KEY, String.valueOf(projectId), 1);
    }

    public Set<String> getTopProjects(int limit) {
        return redisTemplate.opsForZSet().reverseRange(VIEW_KEY, 0, limit - 1);
    }

    @CircuitBreaker(name = "redisCircuitBreaker", fallbackMethod = "getProjectRankingByViewsFromDB")
    public List<ProjectRankRes> getRankingByViews() {
        try {
            Set<String> redisResult = redisTemplate.opsForZSet().reverseRange(VIEW_KEY, 0, 9);

            return processRankingResult(redisResult.stream()
                    .filter(Objects::nonNull)
                    .map(this::parseProjectId)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList()));
        } catch (PoolException e) {
            log.error("Redis 연결 실패 (조회수 랭킹) ", e);
            throw e;
        }
    }

    public List<ProjectRankRes> getProjectRankingByViewsFromDB(Throwable throwable) {
        log.info("조회수 랭킹 Circuit Breaker 발동");
        log.warn("Fallback 메서드 호출! 예외 타입: {}", throwable.getClass().getName());

        List<Long> mysqlResult = projectRepository.getProjectRankingByViews();
        return processRankingResult(mysqlResult);
    }
}