package Blendeo.backend.user.util;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        // Filter에 걸리면 안되는 url(로그아웃, 토큰 재발급)
        return request.getRequestURI().startsWith("/swagger-ui/index.html")
                || request.getRequestURI().startsWith("/swagger-ui")
                || request.getRequestURI().startsWith("/v3/api-docs")
                || request.getRequestURI().startsWith("/swagger-resources")
                || request.getRequestURI().startsWith("/api/v1/user/auth")
                || request.getRequestURI().startsWith("/api/v1/user/get-user")
                || request.getRequestURI().startsWith("/webjars")
                || request.getRequestURI().startsWith("/configuration")
                || request.getRequestURI().startsWith("/api/v1/project/new")
                || request.getRequestURI().startsWith("/api/v1/project/info")
                || request.getRequestURI().startsWith("/api/v1/rank")
                || request.getRequestURI().startsWith("/api/v1/instrument")
                || request.getRequestURI().startsWith("/ws-stomp")
                || request.getRequestURI().startsWith("/api/v1/comment/get-all")
                || request.getRequestURI().startsWith("/api/v1/user/follow/")
                || request.getRequestURI().startsWith("/api/v1/fork/hierarchy")
                || request.getRequestURI().startsWith("/api/v1/project/create/video/blend/upload");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        System.out.println("doFilterInternal");
        String authorization = request.getHeader("Authorization");

        if (authorization != null && authorization.startsWith("Bearer ")) {
            String accessToken = authorization.substring(7);
            if (accessToken != null) {

                if (!jwtUtil.validateToken(accessToken)) {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token");
                    return; // 토큰이 유효하지 않다면 요청 중단
                }

                int id = jwtUtil.getIdFromToken(accessToken);

                // 인증 객체 생성
                User principal = new User(String.valueOf(id), "", new ArrayList<>());
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(principal, null, new ArrayList<>());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // SecurityContext에 인증 객체 설정
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } else {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authorization header is missing");
            return; // 토큰이 유효하지 않다면 요청 중단
        }

        filterChain.doFilter(request, response);
    }
}
