package Blendeo.backend.project.controller;

import Blendeo.backend.project.dto.ProjectHierarchyDto;
import Blendeo.backend.project.dto.ProjectHierarchyRes;
import Blendeo.backend.project.dto.ProjectHierarchyRes2;
import Blendeo.backend.project.dto.ProjectNodeInfoRes;
import Blendeo.backend.project.entity.Project;
import Blendeo.backend.project.service.ForkService;
import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/fork")
@RequiredArgsConstructor
public class ForkController {

    private final ForkService forkService;

    @Operation(summary = "해당 프로젝트와 연관된 모든 노드들 조회")
    @GetMapping("/hierarchy/{projectId}")
    public ResponseEntity<ProjectHierarchyRes> getHierarchy(@PathVariable Long projectId) {
        return ResponseEntity.ok(forkService.getHierarchy(projectId));
    }

    @Operation(summary = "해당 프로젝트와 연관된 모든 노드들 조회-MySQL")
    @GetMapping("/hierarchy2/{projectId}")
    public ResponseEntity<List<ProjectHierarchyDto>> getHierarchy2(@PathVariable Long projectId) {
        return ResponseEntity.ok(forkService.getHierarchy2(projectId));
    }

    @Operation(summary = "프로젝트 노드의 관계 전체 조회")
    @GetMapping("/all/nodes")
    public ResponseEntity<List<ProjectHierarchyRes>> getAllNodes() {
        List<ProjectHierarchyRes> projectHierarchyResList = forkService.getAllNodes();

        return ResponseEntity.ok().body(projectHierarchyResList);
    }
}
