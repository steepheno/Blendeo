package Blendeo.backend.project.controller;

import Blendeo.backend.project.dto.ProjectInfoRes;
import Blendeo.backend.project.dto.ProjectListDto;
import Blendeo.backend.project.dto.ProjectRankRes;
import Blendeo.backend.project.service.RankingService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/rank")
@RequiredArgsConstructor
public class RankingController {

    private final RankingService rankingService;

    @GetMapping("/likes")
    public ResponseEntity<List<ProjectListDto>> getRankingByLikes(@RequestParam("size") int size, @RequestParam("page") int page){
        return ResponseEntity.ok(rankingService.getRankingByLikes(size, page));
    }

    @GetMapping("/views")
    public ResponseEntity<List<ProjectListDto>> getRankingByViews(@RequestParam("size") int size, @RequestParam("page") int page){
        return ResponseEntity.ok(rankingService.getRankingByViews(size, page));
    }
}
