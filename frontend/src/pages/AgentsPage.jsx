import "./AgentsPage.css";

export const AgentsPage = () => {
    return (
        <div className="agents_page">

            <div className="agents_header">
                <h1 className="agents_title">Агенти Kysk</h1>
                <div className="agents_line"></div>

                <p className="agents_intro">
                    Агенти Kysk — це люди, які допомагають нам створювати найкращий кіно-досвід
                    в Україні. Вони тестують новий функціонал, пропонують фільми, перевіряють
                    якість контенту та підтримують спільноту.
                </p>
            </div>

            <div className="agents_section">
                <h2 className="agents_subtitle">Хто такі Агенти?</h2>
                <div className="agents_line small"></div>

                <p className="agents_text">
                    Це команда ентузіастів та експертів, які мають доступ до ранніх оновлень,
                    закритих тестів та внутрішніх інструментів Kysk.
                    Кожен агент впливає на те, яким буде наш сервіс завтра.
                </p>
            </div>

            <div className="agents_section">
                <h2 className="agents_subtitle">Ролі агентів</h2>
                <div className="agents_line small"></div>

                <div className="agents_roles">

                    <div className="agent_card">
                        <h3 className="agent_title">Контент-скаут</h3>
                        <p className="agent_desc">
                            Шукає нові фільми, серіали та тренди. Пропонує контент для нашої платформи.
                        </p>
                    </div>

                    <div className="agent_card">
                        <h3 className="agent_title">Тестер продукту</h3>
                        <p className="agent_desc">
                            Перевіряє новий функціонал, шукає баги, оцінює юзабіліті та продуктивність.
                        </p>
                    </div>

                    <div className="agent_card">
                        <h3 className="agent_title">Аналітик рекомендацій</h3>
                        <p className="agent_desc">
                            Допомагає покращувати систему персональних рекомендацій
                            через зворотний зв’язок та аналітику.
                        </p>
                    </div>

                    <div className="agent_card">
                        <h3 className="agent_title">Модератор спільноти</h3>
                        <p className="agent_desc">
                            Підтримує здорову атмосферу, допомагає користувачам та відповідає на питання.
                        </p>
                    </div>

                </div>
            </div>

            <div className="agents_section">
                <h2 className="agents_subtitle">Як стати агентом?</h2>
                <div className="agents_line small"></div>

                <p className="agents_text">
                    Ми відбираємо найактивніших користувачів та людей з досвідом у медіа,
                    аналітиці, дизайні або розробці.
                    Хочеш приєднатися?
                </p>

                <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=kyskfilms@gmail.com"
                    className="agents_btn"
                    target="_blank"
                >
                    Подати заявку
                </a>
            </div>

        </div>
    );
};
