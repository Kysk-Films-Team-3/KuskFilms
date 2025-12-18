package com.kyskfilms.title.repository

import com.kyskfilms.title.entity.TitlePerson
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface TitlePersonRepository : JpaRepository<TitlePerson, Int> {

}