package com.kyskfilms.title.repository

import com.kyskfilms.title.entity.Title
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface TitleRepository : JpaRepository<Title, Int> {

}