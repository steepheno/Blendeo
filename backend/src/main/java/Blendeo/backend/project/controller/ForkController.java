package Blendeo.backend.project.controller;

import Blendeo.backend.project.dto.ProjectHierarchyRes;
import Blendeo.backend.project.service.ForkService;
import java.util.List;
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

    @GetMapping("/hierarchy/{projectId}")
    public ResponseEntity<ProjectHierarchyRes> getHierarchy(@PathVariable Long projectId) {
        return ResponseEntity.ok(forkService.getHierarchy(projectId));
    }
}
