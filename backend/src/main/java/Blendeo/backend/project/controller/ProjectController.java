package Blendeo.backend.project.controller;

import Blendeo.backend.project.dto.ProjectCreateReq;
import Blendeo.backend.project.dto.ProjectInfoRes;
import Blendeo.backend.project.dto.ProjectListDto;
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
                .build();

        log.info("영상 길이: " + duration);

        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createProject(projectCreateReq));
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
}