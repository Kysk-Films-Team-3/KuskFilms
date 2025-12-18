package com.kyskfilms.promo.repository

import com.kyskfilms.promo.entity.PromoCode
import org.springframework.data.jpa.repository.JpaRepository
import java.util.Optional

interface PromoCodeRepository : JpaRepository<PromoCode, Int> {
    fun findByCode(code: String): Optional<PromoCode>
}