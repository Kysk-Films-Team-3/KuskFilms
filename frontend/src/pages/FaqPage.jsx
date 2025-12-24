import { useState, useEffect } from "react";
import "./FaqPage.css";
import { fetchPageData } from "../services/api";

export const FaqPage = () => {
    const [open, setOpen] = useState(null);
    const [pageData, setPageData] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchPageData('faq');
                setPageData(data);
            } catch (error) {
                setPageData(null);
            }
        })();
    }, []);

    const toggle = (i) => {
        setOpen(open === i ? null : i);
    };

    return (
        <div className="faq_page">
            <h1 className="faq_title">{pageData?.title || ""}</h1>
            <div className="faq_line"></div>

            <div className="faq_list">
                {pageData?.items?.map((item, i) => (
                    <div className="faq_item" key={i}>
                        <div className="faq_question" onClick={() => toggle(i)}>
                            <span>{item.question || ""}</span>
                            <div className={`faq_icon ${open === i ? "open" : ""}`}></div>
                        </div>

                        <div className={`faq_answer ${open === i ? "show" : ""}`}>
                            {item.answer || ""}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
