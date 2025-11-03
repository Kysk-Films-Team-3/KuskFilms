package com.kyskfilms.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
class SecurityConfig(
    private val jitUserProvisioningFilter: JitUserProvisioningFilter
) {

    @Value("\${app.frontend.allowed-origins}")
    private lateinit var allowedOrigins: List<String>


    @Value("\${keycloak.client-id}")
    private lateinit var keycloakClientId: String

    @Bean
    fun publicFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .securityMatcher(
                "/swagger-ui/**",
                "/swagger-ui.html",
                "/v3/api-docs/**",
                "/actuator/**" // Разрешаем доступ ко всем actuator эндпоинтам
            )
            .authorizeHttpRequests { auth -> auth.anyRequest().permitAll() }
            .csrf { it.disable() }
            .cors { it.configurationSource(corsConfigurationSource()) }

        return http.build()
    }

    @Bean
    fun apiFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .securityMatcher("/api/**")
            .cors { it.configurationSource(corsConfigurationSource()) }
            .csrf { it.disable() }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            // Spring Boot автоматически настроит JWT, используя свойства из application.yml
            .oauth2ResourceServer { it.jwt { jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()) } }
            .addFilterAfter(jitUserProvisioningFilter, BasicAuthenticationFilter::class.java)
            .authorizeHttpRequests { auth ->
                auth
                    // Public
                    .requestMatchers(HttpMethod.GET, "/api/movies/**", "/api/genres/**").permitAll()
                    // Admin
                    .requestMatchers("/api/admin/**", "/api/movies/**").hasRole("ADMIN")
                    // Authenticated
                    .anyRequest().authenticated()
            }
        return http.build()
    }

    @Bean
    fun jwtAuthenticationConverter(): JwtAuthenticationConverter {
        val converter = JwtAuthenticationConverter()
        // Используем ID клиента, полученный из application.yml
        converter.setJwtGrantedAuthoritiesConverter(KeycloakRoleConverter(keycloakClientId))
        return converter
    }

    // БИН jwtDecoder() УДАЛЕН. Spring Boot создаст его сам.

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration().apply {
            // Берем разрешенные домены из application.yml
            allowedOriginPatterns = allowedOrigins
            allowedMethods = listOf("POST", "PUT", "DELETE", "GET", "OPTIONS", "PATCH")
            allowedHeaders = listOf("*")
            allowCredentials = true
            maxAge = 3600
        }
        return UrlBasedCorsConfigurationSource().apply {
            registerCorsConfiguration("/**", configuration)
        }
    }
}