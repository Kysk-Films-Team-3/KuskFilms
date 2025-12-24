import React, { useEffect, useState } from 'react';
import './TermsPage.css';
import { fetchPageData } from '../services/api';

export const TermsPage = () => {
    const [pageData, setPageData] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchPageData('terms');
                setPageData(data);
            } catch (error) {
                setPageData(null);
            }
        })();
    }, []);

    if (!pageData) {
        return <div className="terms_page">Завантаження...</div>;
    }

    return (
        <div className="terms_page">
            <div className="terms_block">
                <h1 className="terms_title">{pageData.title}</h1>

                <div className="terms_content">
                    {pageData.sections && pageData.sections.map((section, index) => (
                        <div key={index} className="terms_section">
                            <h2 className="terms_subtitle">{section.title}</h2>
                            <div className="terms_line small"></div>
                            <p className="terms_text">{section.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


