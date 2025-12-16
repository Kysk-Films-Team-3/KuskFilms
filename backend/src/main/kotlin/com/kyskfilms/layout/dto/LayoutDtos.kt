package com.kyskfilms.layout.dto

import com.fasterxml.jackson.annotation.JsonProperty

// --- HEADER ---
data class HeaderDataDto(
    val navigation: List<MenuItemDto>,
    val searchSuggestions: SearchSuggestionsDto
)

data class MenuItemDto(
    val id: Int,
    val label: String,
    val link: String,
    val icon: String? = null
)

data class SearchSuggestionsDto(
    val title: String, // "Часто шукають"
    val items: List<SearchItemDto>
)

data class SearchItemDto(
    val id: Long,
    val title: String,
    val subtitle: String?, // "Актор" или год фильма
    val imageUrl: String,
    val type: String // "MOVIE" or "ACTOR"
)

// --- FOOTER ---
data class FooterDataDto(
    val socialLinks: List<SocialLinkDto>,
    val columns: List<FooterColumnDto>,
    val bottomText: List<String>,
    val legalLinks: List<MenuItemDto>
)

data class SocialLinkDto(
    val network: String, // "tg", "fb", "ig", "x"
    val url: String
)

data class FooterColumnDto(
    val title: String,
    val links: List<MenuItemDto>
)