package Blendeo.backend.project.controller;

import Blendeo.backend.project.dto.ProjectCreateReq;
import Blendeo.backend.project.dto.ProjectInfoRes;
import Blendeo.backend.project.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RequestMapping("/api/v1/project")
@RestController
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @Operation(
            summary = "프로젝트 생성"
    )
    @PostMapping(
            value = "/create",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Void> createProject(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("state") boolean state,
            @RequestParam("videoFile") MultipartFile videoFile
    ) {
        ProjectCreateReq projectCreateReq = ProjectCreateReq.builder()
                .title(title)
                .content(content)
                .state(state)
                .videoFile(videoFile)
                .build();

        projectService.createProject(projectCreateReq);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Operation(
            summary = "프로젝트 조회"
    )
    @GetMapping("/{id}")
    public ResponseEntity<ProjectInfoRes> getProject(@PathVariable Long id) {
        ProjectInfoRes projectInfo = projectService.getProjectInfo(id);
        System.out.println(projectInfo);

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
}