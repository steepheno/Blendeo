package Blendeo.backend.project.service;

import Blendeo.backend.exception.EntityNotFoundException;
import Blendeo.backend.global.error.ErrorCode;
import Blendeo.backend.instrument.repository.InstrumentRepository;
import Blendeo.backend.instrument.repository.ProjectInstrumentRepository;
import Blendeo.backend.project.dto.ProjectInfoRes;
import Blendeo.backend.project.dto.ProjectListDto;
import Blendeo.backend.project.dto.ProjectRankRes;
import Blendeo.backend.project.entity.Project;
import Blendeo.backend.project.repository.LikeRepository;
import Blendeo.backend.project.repository.ProjectRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    private final ProjectInstrumentRepository projectInstrumentRepository;

    @CircuitBreaker(name = "redisCircuitBreaker", fallbackMethod = "getProjectRankingFromDB")
    public List<ProjectListDto> getRankingByLikes(int size, int page) {
        try {
            int start = (page - 1) * size;
            int end = page * size - 1;

            Set<String> redisResult = redisTemplate.opsForZSet().reverseRange(RANKING_KEY, start, end);
            List<ProjectListDto> results = new ArrayList<>();

            for(String projectId : redisResult){
                System.out.println(projectId);
                Project project = projectRepository.findById(Long.parseLong(projectId))
                        .orElseThrow(() -> new EntityNotFoundException(ErrorCode.PROJECT_NOT_FOUND, ErrorCode.PROJECT_NOT_FOUND.getMessage()));

                ProjectListDto projectListDto = ProjectListDto.builder()
                        .projectId(Long.parseLong(projectId))
                        .title(project.getTitle())
                        .thumbnail(project.getThumbnail())
                        .viewCnt(project.getViewCnt())
                        .contributionCnt(project.getContributorCnt())
                        .duration(project.getRunningTime())
                        .authorId(project.getAuthor().getId())
                        .authorNickname(project.getAuthor().getNickname())
                        .authorProfileImage(project.getAuthor().getProfileImage())
                        .instruments(
                                projectInstrumentRepository.getAllByProjectId(project.getId()).stream()
                                        .map(projectInstrument ->
                                                projectInstrument.getInstrument() != null
                                                        ? projectInstrument.getInstrument().getName()
                                                        : projectInstrument.getEtcInstrument().getName()
                                        ).collect(Collectors.toList())
                        )
                        .createdAt(project.getCreatedAt())
                        .build();
                results.add(projectListDto);
            }
            return results;
        } catch (PoolException e) {
            log.error("Redis 연결 실패 ", e);
            throw e;
        }
    }

    public List<ProjectListDto> getProjectRankingFromDB(int size, int page, Throwable throwable) {
        log.info("Circuit Breaker 발동");
        log.warn("Fallback 메서드 호출! 예외 타입: {}", throwable.getClass().getName());

        List<Long> mysqlResult = likeRepository.getProjectRanking();
        Pageable pageable = PageRequest.of(page, size);
        Page<Project> projects = projectRepository.findAllByIdIn(mysqlResult, pageable);

        List<ProjectListDto> results = new ArrayList<>();

        for(Project project : projects){

            ProjectListDto projectListDto = ProjectListDto.builder()
                    .projectId(project.getId())
                    .title(project.getTitle())
                    .thumbnail(project.getThumbnail())
                    .viewCnt(project.getViewCnt())
                    .contributionCnt(project.getContributorCnt())
                    .duration(project.getRunningTime())
                    .authorId(project.getAuthor().getId())
                    .authorNickname(project.getAuthor().getNickname())
                    .authorProfileImage(project.getAuthor().getProfileImage())
                    .instruments(
                            projectInstrumentRepository.getAllByProjectId(project.getId()).stream()
                                    .map(projectInstrument ->
                                            projectInstrument.getInstrument() != null
                                                    ? projectInstrument.getInstrument().getName()
                                                    : projectInstrument.getEtcInstrument().getName()
                                    ).collect(Collectors.toList())
                    )
                    .createdAt(project.getCreatedAt())
                    .build();
            results.add(projectListDto);
        }

        return results;
    }

    private List<ProjectListDto> processRankingResult(Collection<Long> result, int size, int page) {
        if (result == null || result.isEmpty()) {
            return Collections.emptyList();
        }

        List<Long> projectIds = result.stream()
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        Pageable pageable = PageRequest.of(page, size);
        Page<Project> projects = projectRepository.findAllByIdIn(projectIds, pageable);

        List<ProjectListDto> results = new ArrayList<>();

        for(Project project : projects){

            ProjectListDto projectListDto = ProjectListDto.builder()
                    .projectId(project.getId())
                    .title(project.getTitle())
                    .thumbnail(project.getThumbnail())
                    .viewCnt(project.getViewCnt())
                    .contributionCnt(project.getContributorCnt())
                    .duration(project.getRunningTime())
                    .authorId(project.getAuthor().getId())
                    .authorNickname(project.getAuthor().getNickname())
                    .authorProfileImage(project.getAuthor().getProfileImage())
                    .instruments(
                            projectInstrumentRepository.getAllByProjectId(project.getId()).stream()
                                    .map(projectInstrument ->
                                            projectInstrument.getInstrument() != null
                                                    ? projectInstrument.getInstrument().getName()
                                                    : projectInstrument.getEtcInstrument().getName()
                                    ).collect(Collectors.toList())
                    )
                    .createdAt(project.getCreatedAt())
                    .build();
            results.add(projectListDto);
        }

        return results;
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
    public List<ProjectListDto> getRankingByViews(int size, int page) {
        try {
            int start = (page - 1) * size;
            int end = page * size - 1;

            Set<String> redisResult = redisTemplate.opsForZSet().reverseRange(VIEW_KEY, start, end);

            List<ProjectListDto> results = new ArrayList<>();

            for(String projectId : redisResult){
                Project project = projectRepository.findById(Long.parseLong(projectId))
                        .orElseThrow(() -> new EntityNotFoundException(ErrorCode.PROJECT_NOT_FOUND, ErrorCode.PROJECT_NOT_FOUND.getMessage()));

                ProjectListDto projectListDto = ProjectListDto.builder()
                        .projectId(Long.parseLong(projectId))
                        .title(project.getTitle())
                        .thumbnail(project.getThumbnail())
                        .viewCnt(project.getViewCnt())
                        .contributionCnt(project.getContributorCnt())
                        .duration(project.getRunningTime())
                        .authorId(project.getAuthor().getId())
                        .authorNickname(project.getAuthor().getNickname())
                        .authorProfileImage(project.getAuthor().getProfileImage())
                        .instruments(
                                projectInstrumentRepository.getAllByProjectId(project.getId()).stream()
                                        .map(projectInstrument ->
                                                projectInstrument.getInstrument() != null
                                                        ? projectInstrument.getInstrument().getName()
                                                        : projectInstrument.getEtcInstrument().getName()
                                        ).collect(Collectors.toList())
                        )
                        .createdAt(project.getCreatedAt())
                        .build();
                results.add(projectListDto);
            }
            return results;
        } catch (PoolException e) {
            log.error("Redis 연결 실패 (조회수 랭킹) ", e);
            throw e;
        }
    }

    public List<ProjectListDto> getProjectRankingByViewsFromDB(int size, int page, Throwable throwable) {
        log.info("조회수 랭킹 Circuit Breaker 발동");
        log.warn("Fallback 메서드 호출! 예외 타입: {}", throwable.getClass().getName());

        List<Long> mysqlResult = projectRepository.getProjectRankingByViews();
        return processRankingResult(mysqlResult, size, page);
    }
}