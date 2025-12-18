package com.kyskfilms.comment.controller

import com.kyskfilms.comment.dto.*
import com.kyskfilms.comment.service.CommentService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
class CommentController(private val commentService: CommentService) {

    @GetMapping("/public/titles/{titleId}/comments")
    fun getComments(@PathVariable titleId: Int): ResponseEntity<CommentsPageDto> {
        val commentsList = commentService.getCommentsForTitle(titleId) // Логика

        val ui = CommentsUiDto(
            writeCommentTitle = "Написати коментар",
            rateLabel = "Поставте оцінку",
            placeholderTitle = "Заголовок",
            placeholderText = "Мені дуже сподоба…",
            rules = listOf("• Будьте ввічливими", "• Не публікуйте спойлери", "• Заборонено спам і рекламу"),
            submitButton = "Надіслати коментар",
            deleteButton = "видалити"
        )
        return ResponseEntity.ok(CommentsPageDto(commentsList, ui))
    }

    @PostMapping("/comments")
    fun addComment(@RequestBody req: CreateCommentRequest): ResponseEntity<Any> {
        return try { ResponseEntity.ok(commentService.createComment(req)) }
        catch (e: Exception) { ResponseEntity.badRequest().body(mapOf("error" to e.message)) }
    }

    @DeleteMapping("/comments/{id}")
    fun deleteComment(@PathVariable id: Long): ResponseEntity<Void> {
        commentService.deleteComment(id)
        return ResponseEntity.noContent().build()
    }
}