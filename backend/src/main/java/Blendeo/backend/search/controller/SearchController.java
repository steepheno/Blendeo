package Blendeo.backend.search.controller;

import Blendeo.backend.project.dto.ProjectListDto;
import Blendeo.backend.search.service.SearchService;
import Blendeo.backend.user.dto.UserInfoGetRes;
import io.swagger.v3.oas.annotations.Operation;
import java.util.List;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/search")
@RequiredArgsConstructor
@Slf4j
public class SearchController {

    private final SearchService searchService;

    @Operation(
            summary =  "게시글 검색"
    )
    @GetMapping("/project/title")
    public ResponseEntity<List<ProjectListDto>> searchTitle(@RequestParam(value="title", required=false) String title,
                                                            @RequestParam(defaultValue = "0", value = "page") int page,
                                                            @RequestParam(defaultValue = "10", value = "size") int size){

        return ResponseEntity.ok().body(searchService.searchByProjectTitle(title, page, size));
    }

    @Operation(
            summary = "유저의 프로젝트 검색"
    )
    @GetMapping("/user/project")
    public ResponseEntity<List<ProjectListDto>> searchProjectByNickname(@RequestParam(value="nickname", required=false) String nickname,
                                                                        @RequestParam(defaultValue = "0", value = "page") int page,
                                                                        @RequestParam(defaultValue = "10", value = "size") int size){
        return ResponseEntity.ok().body(searchService.searchProjectByNickname(nickname, page, size));
    }

    @Operation(
            summary = "악기 종류로 프로젝트 검색"
    )
    @GetMapping("/project/instrument")
    public ResponseEntity<List<ProjectListDto>> searchProjectByInstrumentType(@RequestParam(value="keyword", required=false) String keyword,
                                                                              @RequestParam(defaultValue = "0", value = "page") int page,
                                                                              @RequestParam(defaultValue = "10", value = "size") int size){
        return ResponseEntity.ok().body(searchService.searchProjectByInstrumentName(keyword, page, size));
    }

    @Operation(
            summary = "닉네임으로 유저 검색"
    )
    @GetMapping("/user/nickname")
    public ResponseEntity<List<UserInfoGetRes>> searchUserByNickname(@RequestParam(value="nickname", required=false) String nickname,
                                                                     @RequestParam(defaultValue = "0", value = "page") int page,
                                                                     @RequestParam(defaultValue = "10", value = "size") int size){
        return ResponseEntity.ok().body(searchService.searchUserByNickname(nickname, page, size));
    }

    @Operation(
            summary = "이메일로 유저 검색"
    )
    @GetMapping("/user/email")
    public ResponseEntity<List<UserInfoGetRes>> searchUserByEmail(@RequestParam(value="email", required=false) String email,
                                                                  @RequestParam(defaultValue = "0", value = "page") int page,
                                                                  @RequestParam(defaultValue = "10", value = "size") int size){
        return ResponseEntity.ok().body(searchService.searchUserByEmail(email, page, size));
    }

}
