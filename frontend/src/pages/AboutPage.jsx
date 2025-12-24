import { useEffect, useState } from "react";
import "./AboutPage.css";
import { fetchPageData } from "../services/api";

export const AboutPage = () => {
    const [pageData, setPageData] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchPageData('about');
                setPageData(data);
            } catch (error) {
                setPageData(null);
            }
        })();
    }, []);

    return (
        <div className="about_page">
            <div className="about_block">
                <h1 className="about_title">{pageData?.title || ""}</h1>
                <div className="about_line"></div>
                <p className="about_text">
                    {pageData?.description || ""}
                </p>
            </div>

            <div className="about_block">
                <h2 className="about_subtitle">{pageData?.missionTitle || ""}</h2>
                <div className="about_line small"></div>
                <p className="about_text">
                    {pageData?.missionText || ""}
                </p>
            </div>

            <div className="about_block">
                <h2 className="about_subtitle">{pageData?.valuesTitle || ""}</h2>
                <div className="about_line small"></div>
                <ul className="about_list">
                    {pageData?.values?.map((value, i) => (
                        <li key={i}>{value || ""}</li>
                    ))}
                </ul>
            </div>

            <div className="about_block">
                <h2 className="about_subtitle">{pageData?.teamTitle || ""}</h2>
                <div className="about_line small"></div>
                <p className="about_text">
                    {pageData?.teamText || ""}
                </p>
            </div>
        </div>
    );
};
