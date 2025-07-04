package Blendeo.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry){
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://localhost:5173",
                        "http:/i12a602.p.ssafy.io",
                        "http://i12a602.p.ssafy.io:5173",
                        "https://blendeo.shop",
                        "http://blendeo.shop",           // HTTP 버전 추가
                        "https://api.blendeo.shop",      // API 도메인 추가
                        "http://api.blendeo.shop",        // API 도메인 HTTP 버전 추가
                        "https://19b0-211-192-252-214.ngrok-free.app" // GPU 서버
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true) // 쿠키 전송을 위해 필수
                .maxAge(3600);
    }
}
