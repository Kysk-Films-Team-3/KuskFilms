import { useState } from "react";
import "./FaqPage.css";
import { Trans } from "react-i18next";

export const FaqPage = () => {
    const [open, setOpen] = useState(null);

    const toggle = (i) => {
        setOpen(open === i ? null : i);
    };

    const data = [
        {
            q: "faqPage.q1",
            a: "faqPage.a1"
        },
        {
            q: "faqPage.q2",
            a: "faqPage.a2"
        },
        {
            q: "faqPage.q3",
            a: "faqPage.a3"
        },
        {
            q: "faqPage.q4",
            a: "faqPage.a4"
        },
        {
            q: "faqPage.q5",
            a: "faqPage.a5"
        },
        {
            q: "faqPage.q6",
            a: "faqPage.a6"
        }
    ];


    return (
        <div className="faq_page">

            <h1 className="faq_title"><Trans i18nKey="faqPage.title" /></h1>
            <div className="faq_line"></div>

            <div className="faq_list">
                {data.map((item, i) => (
                    <div className="faq_item" key={i}>
                        <div className="faq_question" onClick={() => toggle(i)}>
                            <span><Trans i18nKey={item.q} /></span>
                            <div className={`faq_icon ${open === i ? "open" : ""}`}></div>
                        </div>

                        <div className={`faq_answer ${open === i ? "show" : ""}`}>
                            <Trans i18nKey={item.a} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
