package com.kyskfilms.layout.dto

// --- HEADER ---
data class HeaderDataDto(
    val navigation: List<MenuItemDto>,
    val searchSuggestions: SearchSuggestionsDto,
    val ui: HeaderUiDto
)

data class HeaderUiDto(
    val premiumBtn: String,
    val promoCodeBtn: String,
    val manageProfile: String,
    val switchLang: String,
    val adminPanel: String,
    val logout: String,
    val loginBtn: String,

    val searchPlaceholder: String
)

data class MenuItemDto(
    val id: Int,
    val label: String,
    val link: String,
    val icon: String? = null
)

data class SearchSuggestionsDto(
    val title: String,
    val items: List<SearchItemDto>
)

data class SearchItemDto(
    val id: Long,
    val title: String,
    val subtitle: String?,
    val imageUrl: String,
    val type: String
)

// --- FOOTER ---
data class FooterDataDto(
    val socialLinks: List<SocialLinkDto>,
    val columns: List<FooterColumnDto>,
    val bottomText: List<String>,
    val legalLinks: List<MenuItemDto>
)

data class SocialLinkDto(val network: String, val url: String)
data class FooterColumnDto(val title: String, val links: List<MenuItemDto>)

// --- STATIC PAGES DTOs ---

interface PageContentDto

// 0. Юридические страницы (Угода, Політика, Правила) - ДОБАВЛЕНО
data class LegalPageDto(
    val title: String,
    val sections: List<LegalSectionDto>
) : PageContentDto

data class LegalSectionDto(
    val title: String,
    val content: String
)

// 1. Список устройств
data class DevicesPageDto(
    val title: String,
    val items: List<DeviceItemDto>
) : PageContentDto

data class DeviceItemDto(val name: String, val description: String)

// 2. FAQ
data class FaqPageDto(
    val title: String,
    val items: List<FaqItemDto>
) : PageContentDto

data class FaqItemDto(val question: String, val answer: String)

// 3. О нас
data class AboutPageDto(
    val title: String,
    val description: String,
    val missionTitle: String,
    val missionText: String,
    val valuesTitle: String,
    val values: List<String>,
    val teamTitle: String,
    val teamText: String
) : PageContentDto

// 4. Карьера
data class CareersPageDto(
    val title: String,
    val intro: String,
    val whyTitle: String,
    val reasons: List<String>,
    val vacanciesTitle: String,
    val vacancies: List<VacancyDto>,
    val notFoundTitle: String,
    val notFoundText: String,
    val sendResumeBtn: String
) : PageContentDto

data class VacancyDto(val title: String, val description: String)

// 5. Дистрибьюторам
data class DistributorsPageDto(
    val title: String,
    val cooperationTitle: String,
    val cooperationDesc: String,
    val requirementsTitle: String,
    val requirementsDesc: String,
    val offerTitle: String,
    val offerDesc: String,
    val contactTitle: String,
    val contactDesc: String,
    val sendProposalBtn: String
) : PageContentDto

// 6. Контакты
data class ContactsPageDto(
    val title: String,
    val lead: String,
    val writeQuestionBtn: String,
    val responseTime: String
) : PageContentDto

// 7. Акции (Promo)
data class PromoOffersPageDto(
    val title: String,
    val subtitle: String,
    val premiumTitle: String,
    val premiumText: String,
    val buyPremiumBtn: String,
    val copiedMsg: String,
    val copyBtn: String,
    val promos: List<PromoItemDto>
) : PageContentDto

data class PromoItemDto(val code: String, val description: String)

// 8. Агенты
data class AgentsPageDto(
    val title: String,
    val intro: String,
    val whoAreAgentsTitle: String,
    val whoAreAgentsText: String,
    val rolesTitle: String,
    val roles: List<AgentRoleDto>,
    val howToTitle: String,
    val howToText: String,
    val applyButton: String
) : PageContentDto

data class AgentRoleDto(val title: String, val description: String)