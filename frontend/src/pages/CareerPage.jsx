import "./CareerPage.css";

export const CareerPage = () => {
    return (
        <div className="career_page">

            <div className="career_header">
                <h1 className="career_title">Кар'єра в Kysk</h1>
                <div className="career_line"></div>

                <p className="career_intro">
                    Ми будуємо сучасний український стримінговий сервіс і шукаємо талановитих людей,
                    які хочуть створювати майбутнє кіноразваг разом із нами.
                </p>
            </div>

            <div className="career_section">
                <h2 className="career_subtitle">Чому Kysk?</h2>
                <div className="career_line small"></div>

                <ul className="career_list">
                    <li>Можливість впливати на ключові рішення продукту.</li>
                    <li>Команда, що надихає та підтримує.</li>
                    <li>Сучасний технологічний стек.</li>
                    <li>Гнучкий робочий графік та дистанційна робота.</li>
                    <li>Продукт, яким користуються тисячі людей.</li>
                </ul>
            </div>

            <div className="career_section">
                <h2 className="career_subtitle">Відкриті вакансії</h2>
                <div className="career_line small"></div>

                <div className="career_jobs">

                    <div className="job_card">
                        <h3 className="job_title">Frontend Developer (React)</h3>
                        <p className="job_desc">
                            Створення інтерфейсу, UI-компонентів, оптимізація продуктивності,
                            робота з відеоплеєром та рекомендаційним модулем.
                        </p>
                    </div>

                    <div className="job_card">
                        <h3 className="job_title">Backend Developer (Node.js)</h3>
                        <p className="job_desc">
                            Робота над API, системою рекомендацій, авторизацією, аналітикою та
                            масштабуванням сервісу.
                        </p>
                    </div>

                    <div className="job_card">
                        <h3 className="job_title">UI/UX Designer</h3>
                        <p className="job_desc">
                            Розробка інтерфейсів, покращення користувацького досвіду, створення
                            нової візуальної айдентики Kysk.
                        </p>
                    </div>

                </div>
            </div>

            <div className="career_section">
                <h2 className="career_subtitle">Не знайшли свою роль?</h2>
                <div className="career_line small"></div>

                <p className="career_intro">
                    Ми завжди відкриті до талановитих людей.
                    Надішліть резюме нам на пошту — і ми обов'язково розглянемо вашу кандидатуру.
                </p>
                <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=kyskfilms@gmail.com"
                    className="career_mail_btn"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Надіслати резюме
                </a>

            </div>

        </div>
    );
};
