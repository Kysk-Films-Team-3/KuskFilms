import "./DistributorsPage.css";

export const DistributorsPage = () => {
    return (
        <div className="dist_page">

            <h1 className="dist_title">Дистриб’юторам</h1>
            <div className="dist_top_line"></div>

            <div className="dist_section">
                <div className="dist_line"></div>
                <div className="dist_text">
                    <h2 className="dist_heading">Співпраця з Kysk</h2>
                    <p className="dist_desc">
                        Ми відкриті до партнерства з дистриб’юторами та правовласниками,
                        які хочуть розмістити свій контент на нашій платформі.
                    </p>
                </div>
            </div>

            <div className="dist_section">
                <div className="dist_line"></div>
                <div className="dist_text">
                    <h2 className="dist_heading">Наші вимоги</h2>
                    <p className="dist_desc">
                        Ми працюємо тільки з легальним контентом, на який є всі необхідні права.
                        Перевага надається матеріалам у високій якості (FullHD / UHD),
                        а також наявності метаданих та локалізації.
                    </p>
                </div>
            </div>

            <div className="dist_section">
                <div className="dist_line"></div>
                <div className="dist_text">
                    <h2 className="dist_heading">Що ми пропонуємо</h2>
                    <p className="dist_desc">
                        Розміщення контенту на сучасній платформі з прозорою аналітикою,
                        захистом від піратства та доступом до широкої української аудиторії.
                    </p>
                </div>
            </div>

            <div className="dist_section">
                <div className="dist_line"></div>
                <div className="dist_text">
                    <h2 className="dist_heading">Зв’яжіться з нами</h2>
                    <p className="dist_desc">
                        Напишіть нам на корпоративну адресу — і ми оперативно відповімо,
                        обговоримо умови співпраці та допоможемо розмістити ваш контент.
                    </p>
                    <a
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=kyskfilms@gmail.com"
                        className="career_mail_btn"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Надіслати пропозицію
                    </a>
                </div>
            </div>

        </div>
    );
};
