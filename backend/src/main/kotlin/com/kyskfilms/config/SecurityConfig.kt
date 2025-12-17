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

    @Value("\${KEYCLOAK_CLIENT_ID}")
    private lateinit var keycloakClientId: String

    // --- 1. Публичный фильтр (Swagger, Actuator) ---
    @Bean
    fun publicFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .securityMatcher(
                "/swagger-ui/**",
                "/swagger-ui.html",
                "/v3/api-docs/**",
                "/actuator/**"
            )
            .authorizeHttpRequests { auth -> auth.anyRequest().permitAll() }
            .csrf { it.disable() }
            .cors { it.configurationSource(corsConfigurationSource()) }

        return http.build()
    }

    // --- 2. Основной API фильтр ---
    @Bean
    fun apiFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .securityMatcher("/api/**")
            .cors { it.configurationSource(corsConfigurationSource()) }
            .csrf { it.disable() }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .oauth2ResourceServer { it.jwt { jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()) } }
            .addFilterAfter(jitUserProvisioningFilter, BasicAuthenticationFilter::class.java)
            .authorizeHttpRequests { auth ->
                auth
                    // === ПУБЛИЧНЫЕ ЭНДПОИНТЫ ===
                    // Главная, Хедер, Футер, Поиск
                    .requestMatchers("/api/public/**").permitAll()
                    .requestMatchers("/api/public/layout/**").permitAll()
                    .requestMatchers("/api/home/**").permitAll()

                    // Каталог и фильмы (чтение)
                    .requestMatchers(HttpMethod.GET, "/api/titles/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/movies/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/genres/**").permitAll()

                    // Стриминг (если видео публичное)
                    .requestMatchers("/api/stream/**").permitAll()

                    // Тесты
                    .requestMatchers("/api/test/public").permitAll()


                    .requestMatchers("/api/payment/webhook").permitAll()


                    // === ВСЁ ОСТАЛЬНОЕ ТРЕБУЕТ ВХОДА ===
                    .anyRequest().authenticated()
            }
        return http.build()
    }

    @Bean
    fun jwtAuthenticationConverter(): JwtAuthenticationConverter {
        val converter = JwtAuthenticationConverter()
        converter.setJwtGrantedAuthoritiesConverter(KeycloakRoleConverter(keycloakClientId))
        return converter
    }

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration().apply {
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