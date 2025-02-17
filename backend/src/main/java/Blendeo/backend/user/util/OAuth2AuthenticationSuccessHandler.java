package Blendeo.backend.user.util;

import Blendeo.backend.user.dto.UserLoginPostRes;
import Blendeo.backend.user.dto.UserLoginPostResWithToken;
import Blendeo.backend.user.entity.Token;
import Blendeo.backend.user.entity.User;
import Blendeo.backend.user.repository.RefreshTokenRepository;
import Blendeo.backend.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final String frontDomain = "localhost"; // 프론트 배포할 때 변경!
    private final String frontendUrl = "http://localhost:5173"; // 프론트 배포할 때 변경!
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        User user = userRepository.findByEmail(email).orElseThrow();

        String accessToken = jwtUtil.generateAccessToken(user.getId());
        String refreshToken = jwtUtil.generateRefreshToken();

        refreshTokenRepository.save(new Token(user.getId(), accessToken, refreshToken));
        // 쿠키 설정 로직은 기존 로그인과 동일하게 적용

        // CORS 헤더 설정
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        response.setHeader("Access-Control-Allow-Credentials", "true");

        // Cookie 설정
        ResponseCookie accessTokenCookie = ResponseCookie.from("AccessToken", accessToken)
                .maxAge(15 * 60) // 15분
                .path("/")
                .sameSite("Lax")
//                .secure(true)
                .httpOnly(true)
                .domain(frontDomain)
                .build();

        ResponseCookie refreshTokenCookie = ResponseCookie.from("RefreshToken", refreshToken)
                .maxAge(60 * 60 * 24 * 7) // 7일
                .path("/")
                .sameSite("Lax")
//                .secure(true)
                .httpOnly(true)
                .domain(frontDomain)
                .build();

        response.addHeader("Set-Cookie", accessTokenCookie.toString());
        response.addHeader("Set-Cookie", refreshTokenCookie.toString());

        log.info("Access Token Cookie: {}", accessTokenCookie.toString());
        log.info("Refresh Token Cookie: {}", refreshTokenCookie.toString());

        response.sendRedirect(frontendUrl);
    }
}
