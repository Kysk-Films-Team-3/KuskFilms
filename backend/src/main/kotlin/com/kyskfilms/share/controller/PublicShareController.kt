package com.kyskfilms.share.controller

import com.kyskfilms.share.dto.*
import com.kyskfilms.title.repository.PersonRepository
import com.kyskfilms.title.repository.TitleRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

@RestController
@RequestMapping("/api/public/share")
class PublicShareController(
    private val titleRepository: TitleRepository,
    private val personRepository: PersonRepository,
    @Value("\${APP_FRONTEND_URL:http://localhost}") private val frontendUrl: String
) {
    private val ui = ShareUiLabelsDto(
        modalTitle = "Поделиться", copyButton = "Копировать", copiedState = "Скопировано",
        shareToLabel = "Поделиться в", telegramLabel = "Телеграм", twitterLabel = "Твитер", facebookLabel = "Фейсбук"
    )

    @GetMapping("/title/{id}")
    fun getTitleShareData(@PathVariable id: Int): ResponseEntity<ShareDataDto> {
        val title = titleRepository.findById(id).orElseThrow { EntityNotFoundException("Title not found") }
        val url = "$frontendUrl/movie/${title.id}"
        val msg = "Дивись «${title.title}» на KyskFilms!"
        return ResponseEntity.ok(ShareDataDto(title.title, url, msg, generateLinks(url, msg), ui))
    }

    @GetMapping("/person/{id}")
    fun getPersonShareData(@PathVariable id: Long): ResponseEntity<ShareDataDto> {
        val person = personRepository.findById(id).orElseThrow { EntityNotFoundException("Person not found") }
        val url = "$frontendUrl/person/${person.id}"
        val msg = "Актор ${person.name} на KyskFilms"
        return ResponseEntity.ok(ShareDataDto(person.name, url, msg, generateLinks(url, msg), ui))
    }

    private fun generateLinks(url: String, text: String): SocialLinksDto {
        val u = URLEncoder.encode(url, StandardCharsets.UTF_8)
        val t = URLEncoder.encode(text, StandardCharsets.UTF_8)
        return SocialLinksDto(
            "https://t.me/share/url?url=$u&text=$t",
            "https://twitter.com/intent/tweet?url=$u&text=$t",
            "https://www.facebook.com/sharer/sharer.php?u=$u"
        )
    }
}