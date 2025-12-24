import { useEffect, useState } from "react";
import "./CareerPage.css";
import { fetchPageData } from "../services/api";

export const CareerPage = () => {
    const [pageData, setPageData] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchPageData('careers');
                setPageData(data);
            } catch (error) {
                setPageData(null);
            }
        })();
    }, []);

    return (
        <div className="career_page">
            <div className="career_header">
                <h1 className="career_title">{pageData?.title || ""}</h1>
                <div className="career_line"></div>
                <p className="career_intro">
                    {pageData?.intro || ""}
                </p>
            </div>

            <div className="career_section">
                <h2 className="career_subtitle">{pageData?.whyTitle || ""}</h2>
                <div className="career_line small"></div>
                <ul className="career_list">
                    {pageData?.reasons?.map((reason, i) => (
                        <li key={i}>{reason || ""}</li>
                    ))}
                </ul>
            </div>

            <div className="career_section">
                <h2 className="career_subtitle">{pageData?.vacanciesTitle || ""}</h2>
                <div className="career_line small"></div>
                <div className="career_jobs">
                    {pageData?.vacancies?.map((vacancy, i) => (
                        <div className="job_card" key={i}>
                            <h3 className="job_title">{vacancy.title || ""}</h3>
                            <p className="job_desc">
                                {vacancy.description || ""}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="career_section">
                <h2 className="career_subtitle">{pageData?.notFoundTitle || ""}</h2>
                <div className="career_line small"></div>
                <p className="career_intro">
                    {pageData?.notFoundText || ""}
                </p>
                <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=kyskfilms@gmail.com"
                    className="career_mail_btn"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {pageData?.sendResumeBtn || ""}
                </a>
            </div>
        </div>
    );
};
