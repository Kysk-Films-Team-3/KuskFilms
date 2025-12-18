package com.kyskfilms.comment.dto
import java.time.OffsetDateTime

data class CommentsPageDto(val comments: List<CommentResponse>, val ui: CommentsUiDto)
data class CommentsUiDto(
    val writeCommentTitle: String, val rateLabel: String,
    val placeholderTitle: String, val placeholderText: String,
    val rules: List<String>, val submitButton: String, val deleteButton: String
)
data class CreateCommentRequest(val titleId: Int, val text: String, val rating: Int?)
data class CommentResponse(val id: Long, val userId: String, val username: String?, val avatarUrl: String?, val text: String, val rating: Int?, val createdAt: OffsetDateTime, val isMyComment: Boolean)