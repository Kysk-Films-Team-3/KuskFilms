import React, { useEffect, useState } from 'react';
import './RulesPage.css';
import { fetchPageData } from '../services/api';

export const RulesPage = () => {
    const [pageData, setPageData] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchPageData('rules');
                setPageData(data);
            } catch (error) {
                setPageData(null);
            }
        })();
    }, []);

    if (!pageData) {
        return <div className="rules_page">Завантаження...</div>;
    }

    return (
        <div className="rules_page">
            <div className="rules_block">
                <h1 className="rules_title">{pageData.title}</h1>

                <div className="rules_content">
                    {pageData.sections && pageData.sections.map((section, index) => (
                        <div key={index} className="rules_section">
                            <h2 className="rules_subtitle">{section.title}</h2>
                            <div className="rules_line small"></div>
                            <p className="rules_text">{section.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


