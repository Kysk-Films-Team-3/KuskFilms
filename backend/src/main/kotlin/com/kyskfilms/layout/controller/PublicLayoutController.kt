package com.kyskfilms.layout.controller

import com.kyskfilms.layout.dto.*
import com.kyskfilms.title.repository.TitleRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/public/layout")
class PublicLayoutController(
    private val titleRepository: TitleRepository,

    @Value("\${minio.public.url}")
    private val minioUrl: String,

    @Value("\${minio.bucket-name:images}")
    private val folderName: String
) {

    // --- HEADER ENDPOINT ---
    @GetMapping("/header")
    fun getHeaderData(): ResponseEntity<HeaderDataDto> {
        return ResponseEntity.ok(
            HeaderDataDto(
                navigation = getNavMenu(),
                searchSuggestions = getSearchSuggestions()
            )
        )
    }

    // --- FOOTER ENDPOINT ---
    @GetMapping("/footer")
    fun getFooterData(): ResponseEntity<FooterDataDto> {
        return ResponseEntity.ok(
            FooterDataDto(
                socialLinks = getSocials(),
                columns = getFooterColumns(),
                bottomText = listOf(
                    "© 2012-2025 ТОВ «Kysk»",
                    "Загальноукраїнські канали доступні для безкоштовного перегляду цілодобово",
                    "ПЗ ТОВ «Kysk» полягає у реєстрі вітчизняного ПЗ"
                ),
                legalLinks = listOf(
                    MenuItemDto(1, "Угода користувача", "/terms"),
                    MenuItemDto(2, "Політика конфіденційності", "/privacy"),
                    MenuItemDto(3, "Правила рекомендацій", "/rules")
                )
            )
        )
    }

    // === PRIVATES (Logic & Mocks) ===

    private fun resolveImageUrl(path: String?): String {
        if (path.isNullOrBlank()) return ""
        if (path.startsWith("http")) return path
        return "$minioUrl/$folderName/$path"
    }

    private fun getNavMenu(): List<MenuItemDto> {
        return listOf(
            MenuItemDto(1, "Головна", "/"),
            MenuItemDto(2, "Каталог", "/catalog"),
            MenuItemDto(3, "Нове і Популярне", "/new"),
            MenuItemDto(4, "Обране", "/favorites")
        )
    }

    private fun getSearchSuggestions(): SearchSuggestionsDto {
        // Берем 3 случайных фильма из базы для блока "Часто шукають"
        val titles = titleRepository.findAll().take(3)

        val items = titles.map { title ->
            SearchItemDto(
                id = title.id?.toLong() ?: 0L,
                title = title.title,
                subtitle = title.releaseDate?.year?.toString() ?: "Фільм",
                imageUrl = resolveImageUrl(title.posterUrl),
                type = "MOVIE"
            )
        }.toMutableList()

        // Добавляем фейкового актера (т.к. таблицы актеров пока нет)
        items.add(
            SearchItemDto(
                id = 55,
                title = "Кіану Рівз",
                subtitle = "Актор",
                imageUrl = "$minioUrl/$folderName/actors/keanu.jpg",
                type = "ACTOR"
            )
        )

        return SearchSuggestionsDto(
            title = "Часто шукають",
            items = items
        )
    }

    private fun getSocials(): List<SocialLinkDto> {
        return listOf(
            SocialLinkDto("tg", "https://t.me/kyskfilms"),
            SocialLinkDto("fb", "https://facebook.com/kyskfilms"),
            SocialLinkDto("ig", "https://instagram.com/kyskfilms"),
            SocialLinkDto("x", "https://twitter.com/kyskfilms")
        )
    }

    private fun getFooterColumns(): List<FooterColumnDto> {
        return listOf(
            FooterColumnDto("Kysk", listOf(
                MenuItemDto(1, "Про нас", "/about"),
                MenuItemDto(2, "Кар'єра в Kysk", "/careers"),
                MenuItemDto(3, "Агенти Kysk", "/agents")
            )),
            FooterColumnDto("Допомога", listOf(
                MenuItemDto(4, "Запитання та відповіді", "/faq"),
                MenuItemDto(5, "Список пристроїв", "/devices"),
                MenuItemDto(6, "Дистриб'юторам", "/distributors"),
                MenuItemDto(7, "Контакти", "/contacts")
            )),
            FooterColumnDto("Інше", listOf(
                MenuItemDto(8, "Акції та пропозиції", "/promo")
            ))
        )
    }
}