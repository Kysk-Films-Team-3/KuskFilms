import { useEffect, useState } from "react";
import "./DistributorsPage.css";
import { fetchPageData } from "../services/api";

export const DistributorsPage = () => {
    const [pageData, setPageData] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchPageData('distributors');
                setPageData(data);
            } catch (error) {
                setPageData(null);
            }
        })();
    }, []);

    return (
        <div className="dist_page">
            <h1 className="dist_title">{pageData?.title || ""}</h1>
            <div className="dist_top_line"></div>

            <div className="dist_section">
                <div className="dist_line"></div>
                <div className="dist_text">
                    <h2 className="dist_heading">{pageData?.cooperationTitle || ""}</h2>
                    <p className="dist_desc">
                        {pageData?.cooperationDesc || ""}
                    </p>
                </div>
            </div>

            <div className="dist_section">
                <div className="dist_line"></div>
                <div className="dist_text">
                    <h2 className="dist_heading">{pageData?.requirementsTitle || ""}</h2>
                    <p className="dist_desc">
                        {pageData?.requirementsDesc || ""}
                    </p>
                </div>
            </div>

            <div className="dist_section">
                <div className="dist_line"></div>
                <div className="dist_text">
                    <h2 className="dist_heading">{pageData?.offerTitle || ""}</h2>
                    <p className="dist_desc">
                        {pageData?.offerDesc || ""}
                    </p>
                </div>
            </div>

            <div className="dist_section">
                <div className="dist_line"></div>
                <div className="dist_text">
                    <h2 className="dist_heading">{pageData?.contactTitle || ""}</h2>
                    <p className="dist_desc">
                        {pageData?.contactDesc || ""}
                    </p>
                    <a
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=kyskfilms@gmail.com"
                        className="career_mail_btn"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {pageData?.sendProposalBtn || ""}
                    </a>
                </div>
            </div>
        </div>
    );
};
