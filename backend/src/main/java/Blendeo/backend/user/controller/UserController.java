package Blendeo.backend.user.controller;

import Blendeo.backend.instrument.dto.InstrumentGetRes;
import Blendeo.backend.instrument.service.InstrumentService;
import Blendeo.backend.user.dto.*;
import Blendeo.backend.user.service.MailService;
import Blendeo.backend.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RequestMapping("/api/v1/user")
@RestController
@Slf4j
@RequiredArgsConstructor
public class UserController {

    private final String frontDomain = "localhost";
    private final UserService userService;
    private final MailService mailService;
    private final InstrumentService instrumentService;

    @Operation(summary = "회원가입")
    @PostMapping("/auth/signup")
    public ResponseEntity<?> register(@RequestBody UserRegisterPostReq userRegisterPostReq) {
        log.info("UserRegisterPostReq: {}", userRegisterPostReq);
        int userId = userService.register(userRegisterPostReq);
        return ResponseEntity.ok().body(userId);
    }

//    // 내가 좋아하는 악기 저장하기
    @Operation(summary = "내가 좋아하는 악기 저장하기")
    @PostMapping("/favorite/instrument/save")
    public ResponseEntity<?> saveFavoriteInstrument(@RequestParam("lists") List<Integer> instrumentIds) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        instrumentService.deleteInstrument(Integer.parseInt(user.getUsername()));

        instrumentService.saveInstrument(Integer.parseInt(user.getUsername()), instrumentIds);
        return ResponseEntity.ok().build();
    }


    @Operation(summary = "[STEP1] : 이메일 존재 유무 확인 / 인증번호 발송")
    @PostMapping("/auth/mail/check")
    public ResponseEntity<?> MailSend(@RequestParam("email") String email) {
        String authCode = null;
        log.warn("컨트롤러 시작");
        userService.emailExist(email);
        try {
            log.warn("mail 서비스 시작");
            authCode = mailService.sendMail(email);
            log.info(authCode);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok().body("인증번호가 발급되었습니다.");
    }

    @Operation(summary = "[STEP2] : 이메일 존재 유무 확인 / 인증번호 일치 확인")
    @PostMapping("/auth/code/check")
    public ResponseEntity<?> authCodeCheck(@RequestParam("email") String email, @RequestParam("authCode") String authCode) {
        userService.emailExist(email);
        log.warn("mail 서비스 시작");
        if (mailService.checkAuthCode(email, authCode)) {
            return ResponseEntity.ok().body("인증번호가 일치합니다.");
        }
        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
    }

    /**
     * 주요 변경사항:
     *
     * SameSite=Lax를 SameSite=None으로 변경
     * Secure 옵션 추가 (SameSite=None 사용 시 필수)
     * response.addHeader 사용 (두 번째 쿠키 설정 시)
     *
     * 주의사항:
     *
     * SameSite=None과 Secure 옵션을 사용하려면 HTTPS가 필수입니다
     * 프론트엔드와 백엔드의 도메인이 다른 경우 CORS 설정도 확인해야 합니다
     *
     * 이렇게 수정하면 새로고침 시에도 두 토큰이 모두 유지될 것입니다.
     * @param userLoginPostReq
     * @param response
     * @param session
     * @return
     */
    @Operation(summary = "로그인",
    description = "쿠키에 만료시간 포함하여 accessToken, refreshToken 반환.")
    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody UserLoginPostReq userLoginPostReq, HttpServletResponse response, HttpSession session) {
        UserLoginPostResWithToken userLoginPostResWithToken = userService.login(userLoginPostReq);
        UserLoginPostRes userLoginPostRes = UserLoginPostRes.builder()
                .id(userLoginPostResWithToken.getId())
                .email(userLoginPostResWithToken.getEmail())
                .nickname(userLoginPostResWithToken.getNickname())
                .profileImage(userLoginPostResWithToken.getProfileImage())
                .accessToken(userLoginPostResWithToken.getAccessToken())
                .refreshToken(userLoginPostResWithToken.getRefreshToken()).build();

        response.setHeader("Set-Cookie", "AccessToken=" + userLoginPostResWithToken.getAccessToken()
                + "; Max-Age=" + (15 * 60) // 15분
                + "; Path=/"
                + "; Domain=" + frontDomain
                + "; HttpOnly" // JavaScript에서 쿠키에 접근할 수 없게 하여 XSS 공격 방지
                + "; SameSite=Lax"); // CSRF 공격 방지를 위해 같은 도메인의 요청에서만 쿠키 전송
        // https: 이거 필요함 -> + "; Secure"
        response.addHeader("Set-Cookie", "RefreshToken=" + userLoginPostResWithToken.getRefreshToken()
                + "; Max-Age=" + (60 * 60 * 24 * 7) // 7일
                + "; Path=/"
                + "; Domain=" + frontDomain
                + "; HttpOnly" // JavaScript에서 쿠키에 접근할 수 없게 하여 XSS 공격 방지
                + "; SameSite=Lax"); // CSRF 공격 방지를 위해 같은 도메인의 요청에서만 쿠키 전송
        // https: 이거 필요함 -> + "; Secure"

        return ResponseEntity.ok().body(userLoginPostRes);
    }

    @Operation(summary = "refreshToken으로 accessToken 갱신",
        description = "Bearer + refreshToken 보내기, [반환값] 새로 갱신된 accessToken 반환")
    @PostMapping("/auth/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request, HttpServletResponse response) {
        Cookie[] cookies = request.getCookies();
        String newAccessToken = null;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("RefreshToken".equals(cookie.getName())) {
                    String token = cookie.getValue();
                    log.info(token);
                    newAccessToken = userService.findByRefreshToken(token);
                }
            }
        }

        response.setHeader("Set-Cookie", "AccessToken=" + newAccessToken
                + "; Max-Age=" + (15 * 60) // 15분
                + "; Path=/"
                + "; Domain=" + frontDomain
                + "; HttpOnly" // JavaScript에서 쿠키에 접근할 수 없게 하여 XSS 공격 방지
                + "; SameSite=Lax"); // CSRF 공격 방지를 위해 같은 도메인의 요청에서만 쿠키 전송
        // https: 이거 필요함 -> + "; Secure"
        return ResponseEntity.ok()
                .body("accessToken이 재생되었습니다.");
    }

    @Operation(summary = "로그아웃", description = "accessToken, refreshToken 제거됩니다.")
    @PostMapping("/auth/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("AccessToken".equals(cookie.getName())) {
                    String token = cookie.getValue();
                    // 토큰 검증 로직
                    log.info(token);
                    userService.logout(token);
                }
            }
        }
        response.setHeader("Set-Cookie", "AccessToken="
                + "; Max-Age=0"  // 즉시 만료
                + "; Path=/"
                + "; Domain=" + frontDomain
                + "; HttpOnly"
                + "; SameSite=Lax");
        response.addHeader("Set-Cookie", "RefreshToken="
                + "; Max-Age=0"  // 즉시 만료
                + "; Path=/"
                + "; Domain=" + frontDomain
                + "; HttpOnly"
                + "; SameSite=Lax");
        return ResponseEntity.ok().body("로그아웃 되었습니다");
    }

    @Operation(summary = "회원정보 단일건 조회")
    @GetMapping("/get-user/{id}")
    public ResponseEntity<?> getUser(@PathVariable("id") int id) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        // 해당 유저가 아니라면
        if (Integer.parseInt(user.getUsername()) != id) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UserInfoGetRes userInfoGetRes = userService.getUser(id);
        List<InstrumentGetRes> userInstrumentRes = instrumentService.getMyFavoriteInstruments(Integer.parseInt(user.getUsername()));
        userInfoGetRes.setInstruments(userInstrumentRes);
        return ResponseEntity.ok().body(userInfoGetRes);
    }

    // 전체 조회?

    @Operation(summary = "회원정보 수정")
    @PutMapping(value = "/update-user",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateUser(@RequestParam("nickname") String nickname,
                                        @RequestParam("profileImage") MultipartFile profileImage) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        userService.updateUser(Integer.parseInt(user.getUsername()), nickname, profileImage);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "회원 탈퇴")
    @DeleteMapping("/delete-user")
    public ResponseEntity<?> deleteUser() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        userService.deleteUser(Integer.parseInt(user.getUsername()));
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "팔로우")
    @PostMapping("/following/{targetId}")
    public ResponseEntity<?> follow(@PathVariable("targetId") int targetId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String strUserId = user.getUsername();
        int userId = Integer.parseInt(strUserId);
        userService.follow(userId, targetId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "언팔로우")
    @DeleteMapping("/following/{targetId}")
    public ResponseEntity<?> unfollow(@PathVariable("targetId") int targetId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String strUserId = user.getUsername();
        int userId = Integer.parseInt(strUserId);
        userService.unfollow(userId, targetId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "유저의 팔로우 목록 조회")
    @GetMapping("/get-followings/{userId}")
    public ResponseEntity<FollowingListRes> getFollowings(@PathVariable("userId") int userId) {
        FollowingListRes followingList = userService.getFollowings(userId);
        return ResponseEntity.ok().body(followingList);
    }

    @Operation(summary = "유저의 팔로워 목록 조회")
    @GetMapping("/get-followers/{userId}")
    public ResponseEntity<FollowerListRes> getFollowers(@PathVariable("userId") int userId) {
        FollowerListRes followerList = userService.getFollowers(userId);
        return ResponseEntity.ok().body(followerList);
    }

}
