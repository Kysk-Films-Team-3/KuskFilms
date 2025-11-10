package com.kyskfilms.config

import org.springframework.core.convert.converter.Converter
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.oauth2.jwt.Jwt

class KeycloakRoleConverter(
    private val clientId: String
) : Converter<Jwt, Collection<GrantedAuthority>> {

    override fun convert(jwt: Jwt): Collection<GrantedAuthority> {
        val authorities = mutableSetOf<GrantedAuthority>()

        val realmRoles = extractRealmRoles(jwt)
        authorities.addAll(realmRoles.map { SimpleGrantedAuthority("ROLE_${it.uppercase()}") })

        val clientRoles = extractClientRoles(jwt, clientId)
        authorities.addAll(clientRoles.map { SimpleGrantedAuthority("ROLE_${it.uppercase()}") })

        return authorities
    }

    private fun extractRealmRoles(jwt: Jwt): Collection<String> {
        val realmAccess = jwt.getClaim<Map<String, Any>>("realm_access") ?: return emptyList()

        @Suppress("UNCHECKED_CAST")
        val roles = realmAccess["roles"] as? List<String> ?: return emptyList()

        return roles
    }

    private fun extractClientRoles(jwt: Jwt, clientId: String): Collection<String> {
        val resourceAccess = jwt.getClaim<Map<String, Any>>("resource_access") ?: return emptyList()

        @Suppress("UNCHECKED_CAST")
        val clientAccess = resourceAccess[clientId] as? Map<String, Any> ?: return emptyList()

        @Suppress("UNCHECKED_CAST")
        val roles = clientAccess["roles"] as? List<String> ?: return emptyList()

        return roles
    }
}