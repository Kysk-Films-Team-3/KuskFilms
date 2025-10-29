package com.kyskfilms.config

import com.kyskfilms.service.UserProfileService
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JitUserProvisioningFilter(
    private val userProfileService: UserProfileService
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val authentication = SecurityContextHolder.getContext().authentication

        if (authentication != null && authentication.isAuthenticated && authentication.principal is Jwt) {
            val jwt = authentication.principal as Jwt

            userProfileService.findOrCreateUserProfile(jwt)
        }

        filterChain.doFilter(request, response)
    }
}