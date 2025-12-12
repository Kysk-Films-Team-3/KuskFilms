import "./ContactsPage.css";
import { Trans } from "react-i18next";

export const ContactsPage = () => {
    return (
        <div className="contacts_page">

            <h1 className="contacts_title"><Trans i18nKey="contactsPage.title" /></h1>

            <div className="contact_center_block">
                <p className="contact_lead">
                    <Trans i18nKey="contactsPage.lead" />
                </p>

                <a                 href="https://mail.google.com/mail/?view=cm&fs=1&to=kyskfilms@gmail.com"
                                   className="contact_main_btn"
                                   target="_blank"
                                   rel="noopener noreferrer">
                    <Trans i18nKey="contactsPage.writeQuestion" />
                </a>

                <p className="contact_small_text">
                    <Trans i18nKey="contactsPage.responseTime" />
                </p>
            </div>

        </div>
    );
};
