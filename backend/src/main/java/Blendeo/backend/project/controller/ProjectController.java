package Blendeo.backend.project.controller;

import Blendeo.backend.instrument.dto.InstrumentGetRes;
import Blendeo.backend.instrument.entity.EtcInstrument;
import Blendeo.backend.instrument.entity.ProjectInstrument;
import Blendeo.backend.instrument.service.InstrumentService;
import Blendeo.backend.project.dto.ProjectCreateReq;
import Blendeo.backend.project.dto.ProjectInfoRes;
import Blendeo.backend.project.dto.ProjectListDto;
import Blendeo.backend.project.dto.ProjectPostRes;
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
    public ResponseEntity<?> blendVideo(
            @RequestParam(value = "forkedUrl", required = false) String forkedUrl,
            @RequestParam("videoFile") MultipartFile videoFile
    ) {
        String uploadedUrl = null;

        // forkedUrl == null 이라면, 첫 영상!
        if (forkedUrl == null || forkedUrl.isEmpty()) {
            uploadedUrl = videoEditorService.uploadVideo(videoFile);
        } else {
            // 두 영상 합치기
            uploadedUrl = videoEditorService.blendTwoVideo(forkedUrl, videoFile);
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
    public ResponseEntity<?> createProject(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "forkProjectId", required = false) Long forkProjectId,
            @RequestParam("state") boolean state,
            @RequestParam("instrumentIds") List<Integer> instrumentIds,
            @RequestParam("etcName") List<String> etcInstrumentNames,
            @RequestParam("videoUrl") URL videoUrl
    ) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        int userId = Integer.parseInt(user.getUsername());

        int duration = videoEditorService.getLength(videoUrl.toString());

        ProjectCreateReq projectCreateReq = ProjectCreateReq.builder()
                .title(title)
                .content(content)
                .userId(userId)
                .forkProjectId(forkProjectId)
                .state(state)
                .duration(duration)
                .videoUrl(videoUrl)
                .etcInstrumentNames(etcInstrumentNames)
                .build();

        log.info("영상 길이: " + duration);

        Project project = projectService.createProject(projectCreateReq);

        List<InstrumentGetRes> projectInstruments = projectService.saveProjectInstruments(project.getId(), instrumentIds);

        List<InstrumentGetRes> etcInstruments = projectService.saveEtcInstruments(project.getId(), etcInstrumentNames);

        return ResponseEntity.status(HttpStatus.CREATED).body(ProjectPostRes.builder()
                .projectId(project.getId())
                .projectInstruments(projectInstruments)
                .etcInstruments(etcInstruments).build());
    }

    @Operation(
            summary = "프로젝트 조회"
    )
    @GetMapping("/info/{id}")
    public ResponseEntity<ProjectInfoRes> getProject(@PathVariable("id") Long id) {
        ProjectInfoRes projectInfo = projectService.getProjectInfo(id);

        return ResponseEntity.ok(projectInfo);
    }



    @Operation(
            summary = "프로젝트 삭제"
    )
    @DeleteMapping("/{projectId}")
    public ResponseEntity<?> deleteProject(@PathVariable("projectId") Long projectId){
        projectService.deleteProject(projectId);

        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "프로젝트 공개 여부 수정"
    )
    @PatchMapping("/state/{projectId}")
    public ResponseEntity<?> modifyProjectState(@PathVariable Long projectId, boolean state){
        projectService.modifyProjectState(projectId, state);

        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "프로젝트 상세 설명 수정"
    )
    @PatchMapping("/contents/{projectId}")
    public ResponseEntity<?> modifyProjectContents(@PathVariable Long projectId, String contents){
        projectService.modifyProjectContents(projectId, contents);

        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "최신 프로젝트 목록 조회"
    )
    @GetMapping("/new")
    public ResponseEntity<List<ProjectListDto>> getNewProjectList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size){
        return ResponseEntity.ok().body(projectService.getNewProjectList(page, size));
    }

    @Operation(
            summary = "유저의 프로젝트 목록 조회"
    )
    @GetMapping("user/{userId}")
    public ResponseEntity<List<ProjectListDto>> getUserProjectList(
            @PathVariable int userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size){
        return ResponseEntity.ok().body(projectService.getUserProjectList(userId, page, size));
    }

    @Operation(
            summary = "팔로우중인 유저들의 프로젝트 목록 조회"
    )
    @GetMapping("/follow")
    public ResponseEntity<List<ProjectListDto>> getFollowProjectList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size){
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        int userId = Integer.parseInt(user.getUsername());
        return ResponseEntity.ok().body(projectService.getFollowingProjectList(userId, page, size));
    }

}