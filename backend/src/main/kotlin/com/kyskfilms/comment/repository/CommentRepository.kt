package com.kyskfilms.comment.repository

import com.kyskfilms.comment.entity.Comment
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CommentRepository : JpaRepository<Comment, Long> {
    fun findAllByTitleIdOrderByCreatedAtDesc(titleId: Int, pageable: Pageable): List<Comment>
}