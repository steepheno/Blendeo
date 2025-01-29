package Blendeo.backend.project.controller;

import Blendeo.backend.project.dto.ProjectCreateReq;
import Blendeo.backend.project.dto.ProjectInfoRes;
import Blendeo.backend.project.service.ProjectService;
import Blendeo.backend.project.service.VideoEditorService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RequestMapping("/api/v1/project")
@RestController
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final VideoEditorService videoEditorService;

    @Operation(
            summary = "프로젝트 생성",
            description = "forkedUrl == null || forkedUrl.isEmpty() 이라면, 첫 영상!"
    )
    @PostMapping(
            value = "/create",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Void> createProject(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "forkProjectId", required = false) Long forkProjectId,
            @RequestParam("state") boolean state,
            @RequestParam("forkedUrl") MultipartFile forkedUrl,
            @RequestParam("videoFile") MultipartFile videoFile
    ) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        int userId = Integer.parseInt(user.getUsername());

        String uploadedUrl = null;
        // forkedUrl == null 이라면, 첫 영상!
        if (forkedUrl == null || forkedUrl.isEmpty()) {
            uploadedUrl = videoEditorService.uploadVideo(videoFile);
        } else {
            // 두 영상 합치기
            uploadedUrl = videoEditorService.blendTwoVideo(forkedUrl, videoFile);
        }

        ProjectCreateReq projectCreateReq = ProjectCreateReq.builder()
                .title(title)
                .content(content)
                .userId(userId)
                .forkProjectId(forkProjectId)
                .state(state)
                .videoFile(videoFile)
                .build();

        projectService.createProject(projectCreateReq, uploadedUrl);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Operation(
            summary = "프로젝트 조회"
    )
    @GetMapping("/{id}")
    public ResponseEntity<ProjectInfoRes> getProject(@PathVariable Long id) {
        ProjectInfoRes projectInfo = projectService.getProjectInfo(id);

        return ResponseEntity.ok(projectInfo);
    }

    @Operation(
            summary = "프로젝트 삭제"
    )
    @DeleteMapping("/{projectId}")
    public ResponseEntity<?> deleteProject(@PathVariable Long projectId){
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
}