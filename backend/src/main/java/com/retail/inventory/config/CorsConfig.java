package com.retail.inventory.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;
import java.util.stream.Stream;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter(
            @org.springframework.beans.factory.annotation.Value("${app.cors.allowed-origins:http://localhost:4200,http://127.0.0.1:4200}") String allowedOrigins,
            @org.springframework.beans.factory.annotation.Value("${app.cors.allowed-origin-patterns:https://*.vercel.app}") String allowedOriginPatterns) {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(split(allowedOrigins));
        config.setAllowedOriginPatterns(split(allowedOriginPatterns));
        config.setAllowedHeaders(List.of("Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

    private List<String> split(String values) {
        return Stream.of(values.split(",")).map(String::trim).filter(value -> !value.isBlank()).toList();
    }
}
