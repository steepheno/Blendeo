package Blendeo.backend.project.service;

import Blendeo.backend.exception.EntityNotFoundException;
import Blendeo.backend.global.error.ErrorCode;
import Blendeo.backend.global.util.S3Utils;
import Blendeo.backend.instrument.dto.InstrumentGetRes;
import Blendeo.backend.instrument.entity.EtcInstrument;
import Blendeo.backend.instrument.entity.Instrument;
import Blendeo.backend.instrument.entity.ProjectInstrument;
import Blendeo.backend.instrument.repository.EtcInstrumentRepository;
import Blendeo.backend.instrument.repository.InstrumentRepository;
import Blendeo.backend.instrument.repository.ProjectInstrumentRepository;
import Blendeo.backend.project.dto.ProjectCreateReq;
import Blendeo.backend.project.dto.ProjectInfoRes;
import Blendeo.backend.project.dto.ProjectListDto;
import Blendeo.backend.project.entity.Project;
import Blendeo.backend.project.entity.ProjectNode;
import Blendeo.backend.project.repository.ProjectNodeRepository;
import Blendeo.backend.project.repository.ProjectRepository;
import Blendeo.backend.user.entity.User;
import Blendeo.backend.user.repository.UserRepository;
import jakarta.transaction.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
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

    @Override
    @Transactional
    public Project createProject(ProjectCreateReq projectCreateReq) {

        User user = userRepository.findById(projectCreateReq.getUserId())
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.USER_NOT_FOUND, ErrorCode.USER_NOT_FOUND.getMessage()));

        int contributorCnt = 1;

        if (projectCreateReq.getForkProjectId() != null) {
            long forkedId = projectCreateReq.getForkProjectId();
            contributorCnt = getProjectInfo(forkedId).getContributorCnt() + 1;
        }

        Project project = Project.builder()
                .title(projectCreateReq.getTitle())
                .author(user)
                .forkId(projectCreateReq.getForkProjectId())
                .contents(projectCreateReq.getContent())
                .runningTime(projectCreateReq.getDuration())
                .contributorCnt(contributorCnt)
                .videoUrl(projectCreateReq.getVideoUrl())
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
    public ProjectInfoRes getProjectInfo(Long projectId) {

        // 조회수 1 증가
        projectRepository.updateViewCount(projectId);
        rankingService.incrementScore(projectId);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.PROJECT_NOT_FOUND, ErrorCode.PROJECT_NOT_FOUND.getMessage()));

        List<ProjectInstrument> projectInstruments = projectInstrumentRepository.getAllByProjectId(projectId);

        return ProjectInfoRes.builder()
                .id(project.getId())
                .title(project.getTitle())
                .state(project.isState())
                .forkId(project.getForkId())
                .contributorCnt(project.getContributorCnt())
                .runningTime(project.getRunningTime())
                .createdAt(project.getCreatedAt())
                .contents(project.getContents())
                .thumbnail(project.getThumbnail())
                .videoUrl(project.getVideoUrl().toString())
                .viewCnt(project.getViewCnt())
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
    public void deleteProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.PROJECT_NOT_FOUND, ErrorCode.PROJECT_NOT_FOUND.getMessage()));
        projectRepository.deleteById(projectId);
        projectNodeRepository.deleteByProjectIdIfNotForked(projectId);

        s3Utils.deleteFromS3ByUrl(project.getVideoUrl().toString());
    }


    @Override
    @Transactional
    public void modifyProjectState(Long projectId, boolean state) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.PROJECT_NOT_FOUND, ErrorCode.PROJECT_NOT_FOUND.getMessage()));

        project.updateState(state);
    }

    @Override
    @Transactional
    public void modifyProjectContents(Long projectId, String contents) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.PROJECT_NOT_FOUND, ErrorCode.PROJECT_NOT_FOUND.getMessage()));

        project.updateContents(contents);
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
                        .forkCnt(projectRepository.findCountByForkId(project.getId()))
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
                        .forkCnt(projectRepository.findCountByForkId(project.getId()))
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
}
