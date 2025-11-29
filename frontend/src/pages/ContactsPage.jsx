import "./ContactsPage.css";

export const ContactsPage = () => {
    return (
        <div className="contacts_page">

            <h1 className="contacts_title">Контакти</h1>

            <div className="contact_center_block">
                <p className="contact_lead">
                    З будь-яких питань щодо сервісу, пропозицій чи
                    співпраці — ми завжди на зв’язку.
                </p>

                <a                 href="https://mail.google.com/mail/?view=cm&fs=1&to=kyskfilms@gmail.com"
                                   className="contact_main_btn"
                                   target="_blank"
                                   rel="noopener noreferrer">
                    Написати запитання
                </a>

                <p className="contact_small_text">
                    Ми відповідаємо протягом 24 годин.
                </p>
            </div>

        </div>
    );
};
