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
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final String frontDomain = "localhost";
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

        response.setHeader("Set-Cookie", "AccessToken=" + accessToken
                + "; Max-Age=" + (15 * 60) // 15분
                + "; Path=/"
                + "; Domain=" + frontDomain
                + "; HttpOnly" // JavaScript에서 쿠키에 접근할 수 없게 하여 XSS 공격 방지
                + "; SameSite=None"
                + "; Secure"); // CSRF 공격 방지를 위해 같은 도메인의 요청에서만 쿠키 전송
        // https: 이거 필요함 -> + "; Secure"
        response.addHeader("Set-Cookie", "RefreshToken=" + refreshToken
                + "; Max-Age=" + (60 * 60 * 24 * 7) // 7일
                + "; Path=/"
                + "; Domain=" + frontDomain
                + "; HttpOnly" // JavaScript에서 쿠키에 접근할 수 없게 하여 XSS 공격 방지
                + "; SameSite=None"
                + "; Secure"); // CSRF 공격 방지를 위해 같은 도메인의 요청에서만 쿠키 전송
        // https: 이거 필요함 -> + "; Secure"

        log.info("accessToken: " + accessToken);
        log.info("refreshToken: " + refreshToken);

        response.sendRedirect("http://127.0.0.1:5173"); // 또는 프론트엔드 URL
    }
}
