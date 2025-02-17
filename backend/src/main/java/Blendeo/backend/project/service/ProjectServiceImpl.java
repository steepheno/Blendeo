package Blendeo.backend.project.service;

import Blendeo.backend.comment.repository.CommentRepository;
import Blendeo.backend.exception.EntityNotFoundException;
import Blendeo.backend.exception.UnauthorizedAccessException;
import Blendeo.backend.global.error.ErrorCode;
import Blendeo.backend.global.util.S3Utils;
import Blendeo.backend.instrument.dto.InstrumentGetRes;
import Blendeo.backend.instrument.entity.EtcInstrument;
import Blendeo.backend.instrument.entity.Instrument;
import Blendeo.backend.instrument.entity.ProjectInstrument;
import Blendeo.backend.instrument.repository.EtcInstrumentRepository;
import Blendeo.backend.instrument.repository.InstrumentRepository;
import Blendeo.backend.instrument.repository.ProjectInstrumentRepository;
import Blendeo.backend.project.dto.*;
import Blendeo.backend.project.entity.Project;
import Blendeo.backend.project.entity.ProjectNode;
import Blendeo.backend.project.repository.LikeRepository;
import Blendeo.backend.project.repository.ProjectNodeRepository;
import Blendeo.backend.project.repository.ProjectRepository;
import Blendeo.backend.user.entity.User;
import Blendeo.backend.user.repository.UserRepository;
import jakarta.transaction.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectNodeRepository projectNodeRepository;
    private final UserRepository userRepository;
    private final S3Utils s3Utils;
    private final RankingService rankingService;
    private final ProjectInstrumentRepository projectInstrumentRepository;
    private final EtcInstrumentRepository etcInstrumentRepository;
    private final InstrumentRepository instrumentRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;

    @Override
    @Transactional
    public Project createProject(ProjectCreateReq projectCreateReq) {

        User user = userRepository.findById(projectCreateReq.getUserId())
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.USER_NOT_FOUND, ErrorCode.USER_NOT_FOUND.getMessage()));

        int contributorCnt = 1;
        int instrumentCnt = projectCreateReq.getInstrumentCnt();
        if (projectCreateReq.getForkProjectId() != null) {
            long forkedId = projectCreateReq.getForkProjectId();
            contributorCnt = getProjectInfo(forkedId).getContributorCnt() + 1;
            instrumentCnt = getProjectInfo(forkedId).getInstrumentCnt() + projectCreateReq.getInstrumentCnt();
        }

        Project project = Project.builder()
                .title(projectCreateReq.getTitle())
                .contents(projectCreateReq.getContent())
                .author(user)
                .forkId(projectCreateReq.getForkProjectId())
                .runningTime(projectCreateReq.getDuration())
                .contributorCnt(contributorCnt)
                .thumbnail(projectCreateReq.getThumbnailUrl())
                .videoUrl(projectCreateReq.getVideoUrl())
                .contributorCnt(projectCreateReq.getInstrumentCnt())
                .instrumentCnt(instrumentCnt)
                .build();

        project = projectRepository.save(project);

        ProjectNode projectNode = ProjectNode.builder()
                .projectId(project.getId())
                .build();

        projectNodeRepository.save(projectNode);

        if (projectCreateReq.getForkProjectId() != null) {
            projectNodeRepository.createForkRelation(project.getId(), projectCreateReq.getForkProjectId());
        }

        return project;
    }

    @Override
    @Transactional
    public ProjectGetRes getProjectInfo(Long projectId) {

        // 조회수 1 증가
        projectRepository.updateViewCount(projectId);
        rankingService.incrementScore(projectId);


        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.PROJECT_NOT_FOUND, ErrorCode.PROJECT_NOT_FOUND.getMessage()));

        // 전체 악기
        List<ProjectInstrument> allProjectInstruments = new ArrayList<>();

        // 기여자들의 악기 조회하기
        List<ProjectNode> nodes = projectNodeRepository.getContributorInfo(projectId);

        // projectInstruments에 기여자들의 악기 추가하기.
        for (ProjectNode projectNode : nodes) {
            List<ProjectInstrument> projectInstruments = projectInstrumentRepository.getAllByProjectId(projectNode.getProjectId());

            for (ProjectInstrument projectInstrument : projectInstruments) {
                allProjectInstruments.add(projectInstrument);
            }
        }
        
        // 현재 나의 악기 조회하기
        List<ProjectInstrument> projectInstruments = projectInstrumentRepository.getAllByProjectId(projectId);
        for (ProjectInstrument projectInstrument : projectInstruments) {
            allProjectInstruments.add(projectInstrument);
        }

        return ProjectGetRes.builder()
                .id(project.getId())
                .title(project.getTitle())
                .state(project.isState())
                .forkId(project.getForkId())
                .contributorCnt(project.getContributorCnt())
                .authorId(project.getAuthor().getId())
                .authorNickname(project.getAuthor().getNickname())
                .authorProfileImage(project.getAuthor().getProfileImage())
                .runningTime(project.getRunningTime())
                .createdAt(project.getCreatedAt())
                .contents(project.getContents())
                .likeCnt(likeRepository.countByProjectId(projectId))
                .commentCnt(commentRepository.countByProjectId(projectId))
                .thumbnail(project.getThumbnail())
                .videoUrl(project.getVideoUrl())
                .viewCnt(project.getViewCnt())
                .instrumentCnt(project.getInstrumentCnt())
                .projectInstruments(allProjectInstruments.stream()
                        .filter(projectInstrument -> projectInstrument.getInstrument() != null) // Instrument가 널이면!
                        .map(projectInstrument-> InstrumentGetRes.builder()
                                .instrument_id(projectInstrument.getInstrument().getId())
                                .instrument_name(projectInstrument.getInstrument().getName())
                                .build()).collect(Collectors.toList()))
                .etcInstruments(allProjectInstruments.stream()
                        .filter(projectInstrument -> projectInstrument.getEtcInstrument() != null) // EtcInstrument가 null 이 아니면!
                        .map(etcInstrument -> InstrumentGetRes.builder()
                                .instrument_id(etcInstrument.getEtcInstrument().getId())
                                .instrument_name(etcInstrument.getEtcInstrument().getName())
                        .build()).collect(Collectors.toList()))
                .build();
    }


    @Override
    public ProjectGetRes getRandomProjectInfo() {
        Project project = projectRepository.findRandomProject()
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.PROJECT_NOT_FOUND, ErrorCode.PROJECT_NOT_FOUND.getMessage()));
        long projectId = project.getId();

        // 조회수 1 증가
        projectRepository.updateViewCount(projectId);
        rankingService.incrementScore(projectId);

        List<ProjectInstrument> projectInstruments = projectInstrumentRepository.getAllByProjectId(projectId);

        return ProjectGetRes.builder()
                .id(project.getId())
                .title(project.getTitle())
                .state(project.isState())
                .forkId(project.getForkId())
                .contributorCnt(project.getContributorCnt())
                .authorId(project.getAuthor().getId())
                .authorNickname(project.getAuthor().getNickname())
                .authorProfileImage(project.getAuthor().getProfileImage())
                .runningTime(project.getRunningTime())
                .createdAt(project.getCreatedAt())
                .contents(project.getContents())
                .likeCnt(likeRepository.countByProjectId(projectId))
                .commentCnt(commentRepository.countByProjectId(projectId))
                .thumbnail(project.getThumbnail())
                .videoUrl(project.getVideoUrl())
                .viewCnt(project.getViewCnt())
                .instrumentCnt(project.getInstrumentCnt())
                .projectInstruments(projectInstruments.stream()
                        .filter(projectInstrument -> projectInstrument.getInstrument() != null) // Instrument가 널이면!
                        .map(projectInstrument-> InstrumentGetRes.builder()
                                .instrument_id(projectInstrument.getInstrument().getId())
                                .instrument_name(projectInstrument.getInstrument().getName())
                                .build()).collect(Collectors.toList()))
                .etcInstruments(projectInstruments.stream()
                        .filter(projectInstrument -> projectInstrument.getEtcInstrument() != null) // EtcInstrument가 null 이 아니면!
                        .map(etcInstrument -> InstrumentGetRes.builder()
                                .instrument_id(etcInstrument.getEtcInstrument().getId())
                                .instrument_name(etcInstrument.getEtcInstrument().getName())
                                .build()).collect(Collectors.toList()))
                .build();

    }

    @Override
    @Transactional
    public void deleteProject(Long projectId, int userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.PROJECT_NOT_FOUND, ErrorCode.PROJECT_NOT_FOUND.getMessage()));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.USER_NOT_FOUND, ErrorCode.USER_NOT_FOUND.getMessage()));

        if(project.getAuthor().getId() != user.getId())
            throw new UnauthorizedAccessException(ErrorCode.UNAUTHORIZED_ACCESS,ErrorCode.UNAUTHORIZED_ACCESS.getMessage());

        projectRepository.deleteById(projectId);
        projectNodeRepository.deleteByProjectIdIfNotForked(projectId);

        s3Utils.deleteFromS3ByUrl(project.getVideoUrl().toString());
    }


    @Override
    @Transactional
    public void modifyProjectState(int userId, Long projectId, boolean state) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.PROJECT_NOT_FOUND, ErrorCode.PROJECT_NOT_FOUND.getMessage()));
        if (userId != project.getAuthor().getId()){
            throw new UnauthorizedAccessException(ErrorCode.UNAUTHORIZED_ACCESS,ErrorCode.UNAUTHORIZED_ACCESS.getMessage());
        }

        project.updateState(state);
    }

    @Override
    @Transactional
    public void modifyProjectContents(int userId, Long projectId, String contents) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.PROJECT_NOT_FOUND, ErrorCode.PROJECT_NOT_FOUND.getMessage()));

        if (userId != project.getAuthor().getId()){
            throw new UnauthorizedAccessException(ErrorCode.UNAUTHORIZED_ACCESS,ErrorCode.UNAUTHORIZED_ACCESS.getMessage());
        }

        project.updateContents(contents);
    }

    @Override
    @Transactional
    public void modifyProjectTitle(int userId, Long projectId, String title) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.PROJECT_NOT_FOUND, ErrorCode.PROJECT_NOT_FOUND.getMessage()));

        if (userId != project.getAuthor().getId()){
            throw new UnauthorizedAccessException(ErrorCode.UNAUTHORIZED_ACCESS,ErrorCode.UNAUTHORIZED_ACCESS.getMessage());
        }

        project.updateTitle(title);
    }

    @Override
    public List<ProjectListDto> getNewProjectList(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Project> projectPage = projectRepository.findAllByOrderByCreatedAtDesc(pageRequest);

        List<Project> projects = projectPage.getContent();

        return projects.stream()
                .map(project -> ProjectListDto.builder()
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
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<ProjectListDto> getUserProjectList(int userId, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Project> projectPage = projectRepository.findByAuthorId(userId, pageRequest);
        List<Project> projects = projectPage.getContent();

        return projects.stream()
                .map(project -> ProjectListDto.builder()
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
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<ProjectListDto> getFollowingProjectList(int userId, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Project> projectPage = projectRepository.findByFollowingUserAtDesc(userId, pageRequest);
        List<Project> projects = projectPage.getContent();

        return projects.stream()
                .map(project -> ProjectListDto.builder()
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
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<InstrumentGetRes> saveProjectInstruments(long projectId, List<Integer> instrumentIds) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.PROJECT_NOT_FOUND, ErrorCode.PROJECT_NOT_FOUND.getMessage()));

        log.info(String.valueOf(project.getId()));
        List<ProjectInstrument> projectInstruments = new ArrayList<>();
        for (Integer instrumentId : instrumentIds) {
            ProjectInstrument projectInstrument = projectInstrumentRepository.save(ProjectInstrument.builder()
                    .projectId(projectId)
                    .instrument(Instrument.builder()
                            .id(instrumentId).build()).build());

            projectInstruments.add(projectInstrument);
        }

        return projectInstruments.stream()
                .map(projectInstrument -> InstrumentGetRes.builder()
                        .instrument_id(projectInstrument.getInstrument().getId())
                        .instrument_name(instrumentRepository.getById(projectInstrument.getInstrument().getId()).getName()).build()
                )
                .collect(Collectors.toList());
    }

    @Override
    public List<InstrumentGetRes> saveEtcInstruments(Long projectId, List<String> etcInstrumentNames) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.PROJECT_NOT_FOUND, ErrorCode.PROJECT_NOT_FOUND.getMessage()));

        List<EtcInstrument> etcInstruments = new ArrayList<>();

        for (String name : etcInstrumentNames) {
            // etc 악기 저장
            EtcInstrument etcInstrument = etcInstrumentRepository.save(EtcInstrument.builder().instrument_name(name).build());

            etcInstruments.add(etcInstrument);
        }

        // projectInstrument에 저장
        List<ProjectInstrument> projectInstruments = new ArrayList<>();
        for (EtcInstrument etcInstrument : etcInstruments) {
            ProjectInstrument projectInstrument = projectInstrumentRepository.save(ProjectInstrument.builder()
                    .projectId(projectId)
                    .etcInstrument(EtcInstrument.builder()
                            .id(etcInstrument.getId())
                            .instrument_name(etcInstrument.getName())
                    .build()).build());
            projectInstruments.add(projectInstrument);
        }


        return projectInstruments.stream()
                .map(projectInstrument -> InstrumentGetRes.builder()
                        .instrument_id(projectInstrument.getEtcInstrument().getId())
                        .instrument_name(projectInstrument.getEtcInstrument().getName()).build()
                )
                .collect(Collectors.toList());
    }

    @Override
    public ProjectInfoRes getSiblingProject(Long currentProjectId, String direction) {
        log.info(direction);
        if ("next".equalsIgnoreCase(direction)) {
            return projectNodeRepository.findNextSibling(currentProjectId)
                    .or(() -> projectNodeRepository.findFirstSibling(currentProjectId))
                    .map(this::convertToDto)
                    .orElseThrow(() -> new EntityNotFoundException(ErrorCode.PROJECT_NOT_FOUND, ErrorCode.PROJECT_NOT_FOUND.getMessage()));
        } else {
            return projectNodeRepository.findPreviousSibling(currentProjectId)
                    .or(() -> projectNodeRepository.findLastSibling(currentProjectId))
                    .map(this::convertToDto)
                    .orElseThrow(() -> new EntityNotFoundException(ErrorCode.PROJECT_NOT_FOUND, ErrorCode.PROJECT_NOT_FOUND.getMessage()));
        }
    }

    @Override
    public List<ProjectNodeInfoRes> getContributorInfo(long projectId) {
        List<ProjectNode> nodes = projectNodeRepository.getContributorInfo(projectId);

        List<Project> projects = new ArrayList<>();

        for (ProjectNode node : nodes) {
            projects.add(projectRepository.findById(node.getProjectId())
                    .orElse(null));
        }

        projects.add(projectRepository.findById(projectId).orElseThrow(() -> new EntityNotFoundException(ErrorCode.PROJECT_NOT_FOUND, ErrorCode.PROJECT_NOT_FOUND.getMessage())));

        return projects.stream()
                .map(project -> ProjectNodeInfoRes.builder()
                        .userId(project.getAuthor().getId())
                        .nickname(project.getAuthor().getNickname())
                        .profileImage(project.getAuthor().getProfileImage())
                        .instruments(projectInstrumentRepository.getAllByProjectId(project.getId()).stream()
                                .filter(instrument -> instrument.getInstrument() != null)
                                .map(instrument -> InstrumentGetRes.builder()
                                        .instrument_id(instrument.getInstrument().getId())
                                        .instrument_name(instrument.getInstrument().getName())
                                        .build())
                                .collect(Collectors.toList())
                        )
                        .etcInstruments(projectInstrumentRepository.getAllByProjectId(project.getId()).stream()
                                .filter(etcInstrument -> etcInstrument.getEtcInstrument() != null)
                                .map(etcInstrument -> InstrumentGetRes.builder()
                                        .instrument_id(etcInstrument.getEtcInstrument().getId())
                                        .instrument_name(etcInstrument.getEtcInstrument().getName())
                                        .build())
                                .collect(Collectors.toList())
                        ).build())
                .collect(Collectors.toList());
    }

    @Override
    public ProjectInfoRes getParentInfo(long projectId) {
        ProjectNode projectNode = projectNodeRepository.getParentInfo(projectId);

        Project project = projectRepository.findById(projectNode.getProjectId())
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.PROJECT_NOT_FOUND, ErrorCode.PROJECT_NOT_FOUND.getMessage()));

        return ProjectInfoRes.builder()
                .id(project.getId())
                .forkId(project.getForkId())
                .title(project.getTitle())
                .contents(project.getContents())
                .contributorCnt(project.getContributorCnt()) // state 반영 안됨.
                .thumbnail(project.getThumbnail())
                .videoUrl(project.getThumbnail())
                .runningTime(project.getRunningTime())
                .viewCnt(project.getViewCnt())
                .projectInstruments(projectInstrumentRepository.getAllByProjectId(project.getId()).stream()
                        .filter(projectInstrument -> projectInstrument.getInstrument() != null)
                        .map(projectInstrument -> InstrumentGetRes.builder()
                                .instrument_id(projectInstrument.getInstrument().getId())
                                .instrument_name(projectInstrument.getInstrument().getName())
                                .build()
                        ).collect(Collectors.toList()))
                .etcInstruments(projectInstrumentRepository.getAllByProjectId(project.getId()).stream()
                        .filter(projectInstrument -> projectInstrument.getEtcInstrument() != null)
                        .map(projectInstrument -> InstrumentGetRes.builder()
                                .instrument_id(projectInstrument.getEtcInstrument().getId())
                                .instrument_name(projectInstrument.getEtcInstrument().getName())
                                .build()
                        ).collect(Collectors.toList()))
                .createdAt(project.getCreatedAt())
                .build();
    }

    @Override
    public List<ProjectInfoRes> getChildrenInfo(long projectId) {
        List<ProjectNode> nodes = projectNodeRepository.getChildrenInfo(projectId);

        List<Project> projects = new ArrayList<>();

        for (ProjectNode node : nodes) {
            projects.add(projectRepository.findById(node.getProjectId())
                    .orElse(null));
        }

        return projects.stream()
                        .map(project -> ProjectInfoRes.builder()
                                .id(project.getId())
                                .forkId(project.getForkId())
                                .title(project.getTitle())
                                .contents(project.getContents())
                                .contributorCnt(project.getContributorCnt()) // state 반영 안됨.
                                .thumbnail(project.getThumbnail())
                                .videoUrl(project.getThumbnail())
                                .runningTime(project.getRunningTime())
                                .viewCnt(project.getViewCnt())
                                .projectInstruments(projectInstrumentRepository.getAllByProjectId(project.getId()).stream()
                                        .filter(projectInstrument -> projectInstrument.getInstrument() != null)
                                        .map(projectInstrument -> InstrumentGetRes.builder()
                                                .instrument_id(projectInstrument.getInstrument().getId())
                                                .instrument_name(projectInstrument.getInstrument().getName())
                                                .build()
                                        ).collect(Collectors.toList()))
                                .etcInstruments(projectInstrumentRepository.getAllByProjectId(project.getId()).stream()
                                        .filter(projectInstrument -> projectInstrument.getEtcInstrument() != null)
                                        .map(projectInstrument -> InstrumentGetRes.builder()
                                                .instrument_id(projectInstrument.getEtcInstrument().getId())
                                                .instrument_name(projectInstrument.getEtcInstrument().getName())
                                                .build()
                                        ).collect(Collectors.toList()))
                                .createdAt(project.getCreatedAt())
                                .build())
                .collect(Collectors.toList());

    }


    private ProjectInfoRes convertToDto(ProjectNode projectNode) {
        Project project = projectRepository.findById(projectNode.getProjectId())
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.PROJECT_NOT_FOUND, ErrorCode.PROJECT_NOT_FOUND.getMessage()));

        return ProjectInfoRes.builder()
                .id(project.getId())
                .title(project.getTitle())
                .thumbnail(project.getThumbnail())
                .viewCnt(project.getViewCnt())
                .contributorCnt(project.getContributorCnt())
                .runningTime(project.getRunningTime())
                .createdAt(project.getCreatedAt())
                .contents(project.getContents())
                .thumbnail(project.getThumbnail())
                .videoUrl(project.getVideoUrl())
                .state(project.isState())
                .build();
    }

}
