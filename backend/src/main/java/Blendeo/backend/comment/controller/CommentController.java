package Blendeo.backend.comment.controller;

import Blendeo.backend.comment.dto.CommentRegisterReq;
import Blendeo.backend.comment.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/comment")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/")
    public ResponseEntity<?> registerComment(@RequestBody CommentRegisterReq commentRegisterReq) {

        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String userEmail = user.getUsername();

        commentService.registerComment(userEmail, commentRegisterReq);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("댓글이 성공적으로 등록되었습니다.");
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {

        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String userEmail = user.getUsername();

        commentService.deleteComment(userEmail, commentId);

        return ResponseEntity.status(HttpStatus.OK)
                .body("댓글이 성공적으로 삭제되었습니다.");
    }
}
