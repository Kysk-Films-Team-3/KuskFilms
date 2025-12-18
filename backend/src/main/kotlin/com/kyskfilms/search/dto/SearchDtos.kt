package com.kyskfilms.search.dto

data class GlobalSearchResponse(
    val query: String,
    val persons: List<SearchPersonDto>,
    val titles: List<SearchTitleDto>,
    val ui: SearchUiDto
)
data class SearchUiDto(
    val resultsTitlePrefix: String,
    val personsSection: String,
    val titlesSection: String,
    val emptyTitle: String,
    val emptyDescription: String
)
data class SearchPersonDto(val id: Long, val name: String, val photoUrl: String?, val activityType: String?)
data class SearchTitleDto(val id: Int, val title: String, val posterUrl: String?, val rating: Double?, val year: Int?, val type: String)