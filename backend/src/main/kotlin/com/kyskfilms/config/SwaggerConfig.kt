package com.kyskfilms.config

import io.swagger.v3.oas.models.Components
import io.swagger.v3.oas.models.OpenAPI
import io.swagger.v3.oas.models.info.Info
import io.swagger.v3.oas.models.security.OAuthFlow
import io.swagger.v3.oas.models.security.OAuthFlows
import io.swagger.v3.oas.models.security.SecurityRequirement
import io.swagger.v3.oas.models.security.SecurityScheme
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class SwaggerConfig {

    @Value("\${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    private lateinit var issuerUri: String

    @Bean
    fun customOpenAPI(): OpenAPI {
        val securitySchemeName = "bearerAuth"

        return OpenAPI()
            .info(
                Info()
                    .title("KyskFilms API")
                    .version("v1.0")
                    .description("A Netflix-like streaming platform API")
            )
            .addSecurityItem(SecurityRequirement().addList(securitySchemeName))
            .components(
                Components()
                    .addSecuritySchemes(
                        securitySchemeName,
                        SecurityScheme()
                            .name(securitySchemeName)
                            .type(SecurityScheme.Type.OAUTH2)
                            .flows(
                                OAuthFlows()
                                    .authorizationCode(
                                        OAuthFlow()
                                            .authorizationUrl("$issuerUri/protocol/openid-connect/auth")
                                            .tokenUrl("$issuerUri/protocol/openid-connect/token")
                                            .scopes(null)
                                    )
                            )
                    )
            )
    }
}