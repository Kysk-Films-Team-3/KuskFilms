import "./AboutPage.css";

export const AboutPage = () => {
    return (
        <div className="about_page">

            <div className="about_block">
                <h1 className="about_title">Про KyskFilms</h1>
                <div className="about_line"></div>

                <p className="about_text">
                    KyskFilms — це сучасний стримінговий сервіс, створений для людей,
                    які цінують якісний контент, зручний інтерфейс та високі стандарти
                    перегляду. Ми поєднуємо стильний дизайн, продуману навігацію та
                    рекомендації, що працюють саме для вас.
                </p>
            </div>

            <div className="about_block">
                <h2 className="about_subtitle">Наша місія</h2>
                <div className="about_line small"></div>

                <p className="about_text">
                    Ми прагнемо зробити кіно ближчим, доступнішим і приємнішим для
                    кожного глядача. Наша мета — забезпечити комфортне середовище для
                    перегляду улюблених фільмів та серіалів без зайвих перешкод.
                </p>
            </div>

            <div className="about_block">
                <h2 className="about_subtitle">Наші цінності</h2>
                <div className="about_line small"></div>

                <ul className="about_list">
                    <li>Якість — від інтерфейсу до стриму.</li>
                    <li>Простота використання.</li>
                    <li>Прозорість та відкритість.</li>
                    <li>Користувач у центрі уваги.</li>
                    <li>Повага до контенту та авторських прав.</li>
                </ul>
            </div>

            <div className="about_block">
                <h2 className="about_subtitle">Команда</h2>
                <div className="about_line small"></div>

                <p className="about_text">
                    Ми — молода команда розробників, дизайнерів та ентузіастів, які
                    прагнуть створити найкращий український платформер для перегляду
                    фільмів. Ваш комфорт — наше натхнення.
                </p>
            </div>

        </div>
    );
};
