package com.kyskfilms.comment.service

import com.kyskfilms.comment.dto.CommentResponse
import com.kyskfilms.comment.dto.CreateCommentRequest
import com.kyskfilms.comment.entity.Comment
import com.kyskfilms.comment.repository.CommentRepository
import com.kyskfilms.title.repository.TitleRepository
import com.kyskfilms.user.repository.UserProfileRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class CommentService(
    private val commentRepository: CommentRepository,
    private val titleRepository: TitleRepository,
    private val userProfileRepository: UserProfileRepository
) {

    private fun getCurrentUserId(): String {
        val auth = SecurityContextHolder.getContext().authentication
        return (auth.principal as Jwt).subject
    }

    @Transactional
    fun createComment(req: CreateCommentRequest): Comment {
        val userId = getCurrentUserId()
        val title = titleRepository.findById(req.titleId)
            .orElseThrow { EntityNotFoundException("Title not found") }

        val comment = Comment(
            userId = userId,
            title = title,
            text = req.text,
            rating = req.rating
        )

        return commentRepository.save(comment)
    }

    @Transactional(readOnly = true)
    fun getCommentsForTitle(titleId: Int): List<CommentResponse> {
        val currentUserId = try { getCurrentUserId() } catch (e: Exception) { null }
        val comments = commentRepository.findAllByTitleId(titleId)

        // Маппим в DTO, подтягивая данные юзеров (имена и аватарки)
        return comments.map { c ->
            val user = userProfileRepository.findById(UUID.fromString(c.userId)).orElse(null)
            CommentResponse(
                id = c.id!!,
                userId = c.userId,
                username = user?.username ?: "Гість",
                avatarUrl = user?.avatarUrl,
                text = c.text,
                rating = c.rating,
                createdAt = c.createdAt,
                isMyComment = c.userId == currentUserId
            )
        }
    }

    @Transactional
    fun deleteComment(commentId: Long) {
        val userId = getCurrentUserId()
        val comment = commentRepository.findById(commentId)
            .orElseThrow { EntityNotFoundException("Comment not found") }

        if (comment.userId != userId) {
            throw IllegalAccessException("Ви не можете видалити чужий коментар")
        }

        commentRepository.delete(comment)
    }
}