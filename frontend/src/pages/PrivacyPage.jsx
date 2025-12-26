import React, { useEffect, useState } from 'react';
import './PrivacyPage.css';
import { fetchPageData } from '../services/api';

export const PrivacyPage = () => {
    const [pageData, setPageData] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchPageData('privacy');
                setPageData(data);
            } catch (error) {
                setPageData(null);
            }
        })();
    }, []);

    if (!pageData) {
        return <div className="privacy_page"></div>;
    }

    return (
        <div className="privacy_page">
            <div className="privacy_block">
                <h1 className="privacy_title">{pageData.title}</h1>

                <div className="privacy_content">
                    {pageData.sections && pageData.sections.map((section, index) => (
                        <div key={index} className="privacy_section">
                            <h2 className="privacy_subtitle">{section.title}</h2>
                            <div className="privacy_line small"></div>
                            <p className="privacy_text">{section.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


