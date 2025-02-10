package Blendeo.backend.config;

import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

import java.util.Arrays;
import java.util.List;

@Configuration // 스프링 설정 클래스임을 나타냅니다.
public class SwaggerConfig {
    @Bean // 스프링 빈으로 등록합니다.
    public OpenAPI openAPI() {

        SecurityScheme securityScheme = new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .scheme("Bearer")
                .bearerFormat("JWT")
                .in(SecurityScheme.In.HEADER)
                .name("Authorization");

        SecurityRequirement securityRequirement = new SecurityRequirement().addList("bearerAuth");

        return new OpenAPI().servers(List.of(
                        new Server().url("https://api.blendeo.shop"),  // HTTPS URL로 설정
                        new Server().url("http://localhost:8080"),
                        new Server().url("http://i12a602.p.ssafy.io:8080")
                ))
                        .components(new Components()
                        .addSecuritySchemes("bearerAuth", securityScheme)) // API 구성 요소를 설정합니다.
                .security(Arrays.asList(securityRequirement))
                .info(apiInfo()); // API 정보를 설정합니다.
    }

    private Info apiInfo() {
        return new Info().title("BLENDEO API 문서") // API 제목을 설정합니다.
                .description("<h3>REST API 문서입니다.</h3>") // API 설명을 설정합니다.
                .version("1.0.0"); // API 버전을 설정합니다.
    }
}