package com.kyskfilms.layout.controller

import com.kyskfilms.layout.dto.*
import com.kyskfilms.title.repository.TitleRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/public/layout")
class PublicLayoutController(
    private val titleRepository: TitleRepository,
    @Value("\${minio.public.url}") private val minioUrl: String,
    @Value("\${minio.bucket-name:images}") private val folderName: String
) {

    // --- HEADER ---
    @GetMapping("/header")
    fun getHeaderData(): ResponseEntity<HeaderDataDto> {
        return ResponseEntity.ok(
            HeaderDataDto(
                navigation = getNavMenu(),
                searchSuggestions = getSearchSuggestions(),
                // Новые тексты для хедера
                ui = HeaderUiDto(
                    premiumBtn = "Преміум",
                    promoCodeBtn = "Промокод",
                    manageProfile = "Керувати профілем",
                    switchLang = "Перемкнути на українську",
                    adminPanel = "Адмін панель",
                    logout = "Вийти"
                )
            )
        )
    }

    // --- FOOTER ---
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
                    MenuItemDto(1, "Угода користувача", "/pages/terms"), // Ссылка на slug
                    MenuItemDto(2, "Політика конфіденційності", "/pages/privacy"),
                    MenuItemDto(3, "Правила рекомендацій", "/pages/rules")
                )
            )
        )
    }

    // --- STATIC PAGES ENDPOINT (Server-Driven Content) ---
    // Пример вызова: GET /api/public/layout/pages/devices
    @GetMapping("/pages/{slug}")
    fun getPageContent(@PathVariable slug: String): ResponseEntity<Any> {
        val content: Any? = when (slug) {
            "devices" -> DevicesPageDto(
                title = "Список пристроїв",
                items = listOf(
                    DeviceItemDto("Смартфони", "Платформа підтримує сучасні смартфони на iOS та Android."),
                    DeviceItemDto("Комп’ютери та ноутбуки", "Працює в будь-якому сучасному браузері: Windows, macOS, Linux."),
                    DeviceItemDto("Smart TV", "Підтримуються телевізори з браузером або Android TV.")
                )
            )
            "faq" -> FaqPageDto(
                title = "Питання та відповіді",
                items = listOf(
                    FaqItemDto("Що таке Kysk?", "Kysk — це сучасний український стримінговий сервіс для перегляду фільмів і серіалів у зручному та високоякісному форматі."),
                    FaqItemDto("Як оформити підписку?", "Перейдіть у розділ «Преміум», оберіть тариф та здійсніть оплату. Підписка активується миттєво."),
                    FaqItemDto("Чи можна користуватися Kysk без підписки?", "Так, частина контенту доступна безкоштовно. Але преміум-підписка відкриває додаткові можливості, ексклюзиви та перегляд без реклами."),
                    FaqItemDto("Чи безпечно зберігати платіжні дані в Kysk?", "Так. Дані зашифровані, не зберігаються у відкритому вигляді та обробляються виключно сертифікованими міжнародними платіжними системами."),
                    FaqItemDto("Чи є субтитри та різні аудіодоріжки?", "Так. Багато фільмів мають українську та оригінальну аудіодоріжки, а також субтитри. Ми постійно розширюємо доступність контенту."),
                    FaqItemDto("Як скасувати підписку?", "У вашому профілі є розділ «Керування підпискою», де ви можете вимкнути автоматичне поновлення в будь-який час.")
                )
            )
            "about" -> AboutPageDto(
                title = "Про KyskFilms",
                description = "KyskFilms — це сучасний стримінговий сервіс, створений для людей, які цінують якісний контент, зручний інтерфейс та високі стандарти перегляду. Ми поєднуємо стильний дизайн, продуману навігацію та рекомендації, що працюють саме для вас.",
                missionTitle = "Наша місія",
                missionText = "Ми прагнемо зробити кіно ближчим, доступнішим і приємнішим для кожного глядача. Наша мета — забезпечити комфортне середовище для перегляду улюблених фільмів і серіалів без зайвих перешкод.",
                valuesTitle = "Наші цінності",
                values = listOf(
                    "Якість — від інтерфейсу до стриму.",
                    "Зручність використання.",
                    "Прозорість та відкритість.",
                    "Користувач у центрі уваги.",
                    "Повага до контенту та авторського права."
                ),
                teamTitle = "Команда",
                teamText = "Ми — молода команда розробників, дизайнерів та ентузіастів, яка прагне створити найкращу українську платформу для перегляду фільмів. Ваш комфорт — наше натхнення."
            )
            "careers" -> CareersPageDto(
                title = "Кар’єра в Kysk",
                intro = "Ми створюємо сучасний український стримінговий сервіс і шукаємо талановитих людей, які хочуть разом з нами формувати майбутнє кінорозваг.",
                whyTitle = "Чому Kysk?",
                reasons = listOf(
                    "Можливість впливати на ключові рішення продукту.",
                    "Надихаюча та підтримуюча команда.",
                    "Сучасний технологічний стек.",
                    "Гнучкий графік та віддалена робота.",
                    "Продукт, яким користуються тисячі людей."
                ),
                vacanciesTitle = "Відкриті вакансії",
                vacancies = listOf(
                    VacancyDto("Frontend-розробник (React)", "Створення інтерфейсу, UI-компонентів, оптимізація продуктивності, робота з відеоплеєром та модулем рекомендацій."),
                    VacancyDto("Backend-розробник (Node.js/Kotlin)", "Робота над API, системою рекомендацій, авторизацією, аналітикою та масштабуванням сервісу."),
                    VacancyDto("UI/UX дизайнер", "Розробка інтерфейсів, покращення користувацького досвіду, створення нової візуальної айдентики Kysk.")
                ),
                notFoundTitle = "Не знайшли свою роль?",
                notFoundText = "Ми завжди відкриті до талановитих людей. Надішліть своє резюме на нашу пошту — і ми обов’язково розглянемо вашу кандидатуру.",
                sendResumeBtn = "Надіслати резюме"
            )
            "distributors" -> DistributorsPageDto(
                title = "Для дистриб’юторів",
                cooperationTitle = "Співпраця з Kysk",
                cooperationDesc = "Ми відкриті до партнерства з дистриб’юторами та правовласниками, які бажають розмістити свій контент на нашій платформі.",
                requirementsTitle = "Наші вимоги",
                requirementsDesc = "Ми працюємо виключно з легальним контентом, на який наявні всі необхідні права. Перевага надається матеріалам у високій якості (FullHD / UHD), а також за наявності метаданих та локалізації.",
                offerTitle = "Що ми пропонуємо",
                offerDesc = "Розміщення контенту на сучасній платформі з прозорою аналітикою, захистом від піратства та доступом до широкої української аудиторії.",
                contactTitle = "Зв’яжіться з нами",
                contactDesc = "Напишіть нам на корпоративну адресу — і ми оперативно відповімо, обговоримо умови співпраці та допоможемо розмістити ваш контент.",
                sendProposalBtn = "Надіслати пропозицію"
            )
            "contacts" -> ContactsPageDto(
                title = "Контакти",
                lead = "З будь-яких питань щодо сервісу, пропозицій або співпраці — ми завжди на зв’язку.",
                writeQuestionBtn = "Написати запитання",
                responseTime = "Відповідаємо протягом 24 годин."
            )
            "promo" -> PromoOffersPageDto(
                title = "Акції та пропозиції",
                subtitle = "Вигідні преміум-пропозиції та ексклюзивні промокоди.",
                premiumTitle = "Преміум зі знижкою",
                premiumText = "Повний доступ до каталогу, 4K та перегляд без реклами.",
                buyPremiumBtn = "Купити Преміум",
                copiedMsg = "Скопійовано ✔️",
                copyBtn = "Скопіювати",
                promos = listOf(
                    PromoItemDto("KYSK25", "-30% для нових користувачів"),
                    PromoItemDto("FREEWEEK", "7 днів преміум безкоштовно")
                )
            )
            "agents" -> AgentsPageDto(
                title = "Агенти Kysk",
                intro = "Агенти Kysk — це люди, які допомагають нам створювати найкращий кіно-досвід в Україні. Вони тестують новий функціонал, пропонують фільми, перевіряють якість контенту та підтримують спільноту.",
                whoAreAgentsTitle = "Хто такі агенти?",
                whoAreAgentsText = "Це команда ентузіастів та експертів, які мають доступ до ранніх оновлень, закритих тестувань та внутрішніх інструментів Kysk. Кожен агент впливає на те, яким буде наш сервіс завтра.",
                rolesTitle = "Ролі агентів",
                roles = listOf(
                    AgentRoleDto("Контент-скаут", "Шукає нові фільми, серіали та тренди. Пропонує контент для платформи."),
                    AgentRoleDto("Тестер продукту", "Перевіряє новий функціонал, знаходить помилки та оцінює зручність і продуктивність."),
                    AgentRoleDto("Аналітик рекомендацій", "Допомагає покращувати систему персональних рекомендацій через зворотний зв’язок та аналітику."),
                    AgentRoleDto("Модератор спільноти", "Підтримує здорову атмосферу, допомагає користувачам і відповідає на запитання.")
                ),
                howToTitle = "Як стати агентом?",
                howToText = "Ми відбираємо найактивніших користувачів та людей з досвідом у медіа, аналітиці, дизайні або розробці. Хочеш приєднатися?",
                applyButton = "Подати заявку"
            )
            else -> null
        }

        return if (content != null) ResponseEntity.ok(content) else ResponseEntity.notFound().build()
    }

    // === PRIVATES ===

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

        items.add(
            SearchItemDto(
                id = 55,
                title = "Кіану Рівз",
                subtitle = "Актор",
                imageUrl = "$minioUrl/$folderName/actors/keanu.jpg",
                type = "ACTOR"
            )
        )

        return SearchSuggestionsDto("Часто шукають", items)
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
                MenuItemDto(1, "Про нас", "/pages/about"),
                MenuItemDto(2, "Кар'єра в Kysk", "/pages/careers"),
                MenuItemDto(3, "Агенти Kysk", "/pages/agents")
            )),
            FooterColumnDto("Допомога", listOf(
                MenuItemDto(4, "Запитання та відповіді", "/pages/faq"),
                MenuItemDto(5, "Список пристроїв", "/pages/devices"),
                MenuItemDto(6, "Дистриб'юторам", "/pages/distributors"),
                MenuItemDto(7, "Контакти", "/pages/contacts")
            )),
            FooterColumnDto("Інше", listOf(
                MenuItemDto(8, "Акції та пропозиції", "/pages/promo")
            ))
        )
    }
}