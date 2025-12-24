import { useEffect, useState } from "react";
import "./ContactsPage.css";
import { fetchPageData } from "../services/api";

export const ContactsPage = () => {
    const [pageData, setPageData] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchPageData('contacts');
                setPageData(data);
            } catch (error) {
                setPageData(null);
            }
        })();
    }, []);

    return (
        <div className="contacts_page">
            <h1 className="contacts_title">{pageData?.title || ""}</h1>

            <div className="contact_center_block">
                <p className="contact_lead">
                    {pageData?.lead || ""}
                </p>

                <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=kyskfilms@gmail.com"
                    className="contact_main_btn"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {pageData?.writeQuestionBtn || ""}
                </a>

                <p className="contact_small_text">
                    {pageData?.responseTime || ""}
                </p>
            </div>
        </div>
    );
};
