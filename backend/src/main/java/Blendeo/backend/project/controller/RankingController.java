package Blendeo.backend.project.controller;

import Blendeo.backend.project.dto.ProjectRankRes;
import Blendeo.backend.project.service.RankingService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/rank")
@RequiredArgsConstructor
public class RankingController {

    private final RankingService rankingService;

    @GetMapping("/likes")
    public ResponseEntity<List<ProjectRankRes>> getRankingByLikes(){
        return ResponseEntity.ok(rankingService.getRankingByLikes());
    }

    @GetMapping("/views")
    public ResponseEntity<List<ProjectRankRes>> getRankingByViews(){
        return ResponseEntity.ok(rankingService.getRankingByViews());
    }
}
