package Blendeo.backend.project.controller;

import Blendeo.backend.project.dto.ProjectScrapRes;
import Blendeo.backend.project.service.ScrapService;
import io.swagger.v3.oas.annotations.Operation;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/project/scrap")
@RequiredArgsConstructor
public class ScrapController {

    private final ScrapService scrapService;

    @Operation(
            summary = "프로젝트 스크랩",
            description = "특정 프로젝트를 '구독'한다."
    )
    @PostMapping("/")
    public ResponseEntity<?> scrapProject(@RequestBody Long projectId){
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        int userId = Integer.parseInt(user.getUsername());

        scrapService.scrapProject(userId, projectId);

        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "프로젝트 스크랩 취소",
            description = "특정 프로젝트의 스크랩을 취소한다."
    )
    @DeleteMapping("/{projectId}")
    public ResponseEntity<?> deleteScrapProject(@PathVariable Long projectId){
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        int userId = Integer.parseInt(user.getUsername());

        scrapService.deleteScrapProject(userId, projectId);

        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "스크랩 목록 불러오기",
            description = "스크랩한 프로젝트 목록을 불러온다."
    )
    @GetMapping("/")
    public ResponseEntity<List<ProjectScrapRes>> getScrapProject(){
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        int userId = Integer.parseInt(user.getUsername());

        return ResponseEntity.status(HttpStatus.OK).body(scrapService.getScrapProject(userId));
    }
}
