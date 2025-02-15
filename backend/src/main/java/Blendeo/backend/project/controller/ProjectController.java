package Blendeo.backend.project.controller;

import Blendeo.backend.instrument.dto.InstrumentGetRes;
import Blendeo.backend.instrument.service.InstrumentService;
import Blendeo.backend.project.dto.*;
import Blendeo.backend.project.entity.Project;
import Blendeo.backend.project.service.ProjectService;
import Blendeo.backend.project.service.VideoEditorService;
import io.swagger.v3.oas.annotations.Operation;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URL;

@RequestMapping("/api/v1/project")
@RestController
@RequiredArgsConstructor
@Slf4j
public class ProjectController {

    private final ProjectService projectService;
    private final VideoEditorService videoEditorService;
    private final InstrumentService instrumentService;

    @Operation(
            summary = "[STEP1] 영상 업로드 (* 한 개 영상 업로드 or 두 개 영상 합치고 업로드 *)",
            description = "forkedUrl == null || forkedUrl.isEmpty() 이라면, 첫 영상! \n" +
                    "합쳐지는 영상의 맞닿는 부분의 길이가 같아야만 blend에 성공!"
    )
    @PostMapping(
            value = "/create/video/blend/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> blendVideo(@ModelAttribute VideoBlendRequest request) {
        // startPoint이 0보다 크면 영상 자르기 로직 시도
        String uploadedUrl = null;

        // forkedUrl == null 이라면, 첫 영상!
        if (request.getForkedUrl() == null || request.getForkedUrl().isEmpty()) {
            uploadedUrl = videoEditorService.uploadVideo(request.getVideoFile(), request.getStartPoint(), request.getDuration());
        } else {
            // 두 영상 합치기
            uploadedUrl = videoEditorService.blendTwoVideo(request.getForkedUrl(), request.getVideoFile(), request.getLoopCnt());
        }

        return new ResponseEntity<>(uploadedUrl, HttpStatus.OK);
    }


    @Operation(
            summary = "[STEP2] 프로젝트 생성",
            description = "업로드된 영상 url로 create 요청"
    )
    @PostMapping(
            value = "/create"
    )
    @Transactional
    public ResponseEntity<?> createProject(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "forkProjectId", required = false) Long forkProjectId,
            @RequestParam("state") boolean state,
            @RequestParam(value = "instrumentIds", required = false) List<Integer> instrumentIds,
            @RequestParam(value = "etcName", required = false) List<String> etcInstrumentNames,
            @RequestParam("videoUrl") URL videoUrl
    ) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        int userId = Integer.parseInt(user.getUsername());

        int duration = videoEditorService.getLength(videoUrl.toString());
        URL thumbnailUrl = videoEditorService.getThumbnailUrl(videoUrl.toString());
        int ectInstrumentCnt = etcInstrumentNames == null ? 0 : etcInstrumentNames.size();
        int instrumentCnt = instrumentIds == null ? 0 : instrumentIds.size();
        int instrumentTotalCnt = instrumentCnt + ectInstrumentCnt;

        ProjectCreateReq projectCreateReq = ProjectCreateReq.builder()
                .title(title)
                .content(content)
                .userId(userId)
                .forkProjectId(forkProjectId)
                .state(state)
                .duration(duration)
                .thumbnailUrl(thumbnailUrl)
                .videoUrl(videoUrl)
                .instrumentCnt(instrumentTotalCnt)
                .build();

        log.info("영상 길이: " + duration);

        Project project = projectService.createProject(projectCreateReq);

        List<InstrumentGetRes> projectInstruments = null;
        if (instrumentIds!=null && !instrumentIds.isEmpty()) {
            projectInstruments = projectService.saveProjectInstruments(project.getId(), instrumentIds);
        }
        List<InstrumentGetRes> etcInstruments = null;
        if (etcInstrumentNames!=null && !etcInstrumentNames.isEmpty()) {
            etcInstruments = projectService.saveEtcInstruments(project.getId(), etcInstrumentNames);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(ProjectCreateRes.builder()
                .projectId(project.getId())
                .projectInstruments(projectInstruments)
                .etcInstruments(etcInstruments).build());
    }

    @Operation(
            summary = "프로젝트 조회"
    )
    @GetMapping("/get/info/{id}")
    public ResponseEntity<ProjectGetRes> getProject(@PathVariable("id") Long id) {
        ProjectGetRes projectGetRes = projectService.getProjectInfo(id);

        return ResponseEntity.ok(projectGetRes);
    }

    @Operation(
            summary = "프로젝트 삭제"
    )
    @DeleteMapping("/{projectId}")
    public ResponseEntity<?> deleteProject(@PathVariable("projectId") Long projectId){
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        int userId = Integer.parseInt(user.getUsername());

        projectService.deleteProject(projectId, userId);

        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "프로젝트 공개 여부 수정"
    )
    @PatchMapping("/state/{projectId}")
    public ResponseEntity<?> modifyProjectState(@PathVariable("projectId") Long projectId, boolean state){
        projectService.modifyProjectState(projectId, state);

        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "프로젝트 상세 설명 수정"
    )
    @PatchMapping("/contents/{projectId}")
    public ResponseEntity<?> modifyProjectContents(@PathVariable("projectId") Long projectId, String contents){
        projectService.modifyProjectContents(projectId, contents);

        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "최신 프로젝트 목록 조회"
    )
    @GetMapping("/get/new")
    public ResponseEntity<List<ProjectListDto>> getNewProjectList(
            @RequestParam(defaultValue = "0", value = "page") int page,
            @RequestParam(defaultValue = "10", value = "size") int size){
        return ResponseEntity.ok().body(projectService.getNewProjectList(page, size));
    }

    @Operation(
            summary = "유저의 프로젝트 목록 조회"
    )
    @GetMapping("user/{userId}")
    public ResponseEntity<List<ProjectListDto>> getUserProjectList(
            @PathVariable("userId") int userId,
            @RequestParam(defaultValue = "0", value="page") int page,
            @RequestParam(defaultValue = "10", value="size") int size){
        return ResponseEntity.ok().body(projectService.getUserProjectList(userId, page, size));
    }

    @Operation(
            summary = "팔로우중인 유저들의 프로젝트 목록 조회"
    )
    @GetMapping("/follow")
    public ResponseEntity<List<ProjectListDto>> getFollowProjectList(
            @RequestParam(defaultValue = "0", value="page") int page,
            @RequestParam(defaultValue = "10", value="size") int size){
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        int userId = Integer.parseInt(user.getUsername());
        return ResponseEntity.ok().body(projectService.getFollowingProjectList(userId, page, size));
    }

    @Operation(
            summary = "다음/이전 형제 프로젝트 조회",
            description = "현재 프로젝트의 다음 또는 이전 형제 프로젝트 반환"
                    + "next: 다음"
                    + "before: 이전"
    )
    @GetMapping("/get/sibling")
    public ResponseEntity<ProjectInfoRes> getSiblingProject(
            @RequestParam("currentProjectId") Long currentProjectId,
            @RequestParam(value = "direction", defaultValue = "next") String direction) {

        log.info("projectId: " + currentProjectId);
        return ResponseEntity.ok()
                .body(projectService.getSiblingProject(currentProjectId, direction));
    }

    // 프로젝트 기여자 목록 조회
    @Operation(summary = "프로젝트 기여자 목록 조회")
    @GetMapping("/get/contributor")
    public ResponseEntity<List<ProjectNodeInfoRes>> getContributorProjectList(@RequestParam("projectId") long projectId) {
        List<ProjectNodeInfoRes> projectNodeInfoRes = projectService.getContributorInfo(projectId);

        return ResponseEntity.ok().body(projectNodeInfoRes);
    }

    @Operation(summary = "프로젝트 부모 조회")
    @GetMapping("/get/parent")
    public ResponseEntity<ProjectInfoRes> getParentProjectList(@RequestParam("projectId") long projectId) {
        ProjectInfoRes projectInfoRes = projectService.getParentInfo(projectId);

        return ResponseEntity.ok().body(projectInfoRes);
    }

    @Operation(summary = "프로젝트 자식 목록 조회")
    @GetMapping("/get/children")
    public ResponseEntity<List<ProjectInfoRes>> getChildrenProjectList(@RequestParam("projectId") long projectId) {
        List<ProjectInfoRes> projectInfoRes = projectService.getChildrenInfo(projectId);

        return ResponseEntity.ok().body(projectInfoRes);
    }

}