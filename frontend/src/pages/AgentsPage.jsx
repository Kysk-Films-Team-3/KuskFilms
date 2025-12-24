import { useEffect, useState } from "react";
import "./AgentsPage.css";
import { fetchPageData } from "../services/api";

export const AgentsPage = () => {
    const [pageData, setPageData] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchPageData('agents');
                setPageData(data);
            } catch (error) {
                setPageData(null);
            }
        })();
    }, []);

    return (
        <div className="agents_page">
            <div className="agents_header">
                <h1 className="agents_title">{pageData?.title || ""}</h1>
                <div className="agents_line"></div>
                <p className="agents_intro">
                    {pageData?.intro || ""}
                </p>
            </div>

            <div className="agents_section">
                <h2 className="agents_subtitle">{pageData?.whoAreAgentsTitle || ""}</h2>
                <div className="agents_line small"></div>
                <p className="agents_text">
                    {pageData?.whoAreAgentsText || ""}
                </p>
            </div>

            <div className="agents_section">
                <h2 className="agents_subtitle">{pageData?.rolesTitle || ""}</h2>
                <div className="agents_line small"></div>
                <div className="agents_roles">
                    {pageData?.roles?.map((role, i) => (
                        <div className="agent_card" key={i}>
                            <h3 className="agent_title">{role.title || ""}</h3>
                            <p className="agent_desc">
                                {role.description || ""}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="agents_section">
                <h2 className="agents_subtitle">{pageData?.howToTitle || ""}</h2>
                <div className="agents_line small"></div>
                <p className="agents_text">
                    {pageData?.howToText || ""}
                </p>
                <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=kyskfilms@gmail.com"
                    className="agents_btn"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {pageData?.applyButton || ""}
                </a>
            </div>
        </div>
    );
};
