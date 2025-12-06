import React from 'react';
import { useTranslation } from 'react-i18next';
import './RulesPage.css';

export const RulesPage = () => {
    const { t } = useTranslation();

    return (
        <div className="rules_page">
            <div className="rules_block">
                <h1 className="rules_title">{t('rulesPage.title')}</h1>

                <div className="rules_content">
                    <div className="rules_section">
                        <h2 className="rules_subtitle">{t('rulesPage.section1.title')}</h2>
                        <div className="rules_line small"></div>
                        <p className="rules_text">{t('rulesPage.section1.content')}</p>
                    </div>

                    <div className="rules_section">
                        <h2 className="rules_subtitle">{t('rulesPage.section2.title')}</h2>
                        <div className="rules_line small"></div>
                        <p className="rules_text">{t('rulesPage.section2.content')}</p>
                    </div>

                    <div className="rules_section">
                        <h2 className="rules_subtitle">{t('rulesPage.section3.title')}</h2>
                        <div className="rules_line small"></div>
                        <p className="rules_text">{t('rulesPage.section3.content')}</p>
                    </div>

                    <div className="rules_section">
                        <h2 className="rules_subtitle">{t('rulesPage.section4.title')}</h2>
                        <div className="rules_line small"></div>
                        <p className="rules_text">{t('rulesPage.section4.content')}</p>
                    </div>

                    <div className="rules_section">
                        <h2 className="rules_subtitle">{t('rulesPage.section5.title')}</h2>
                        <div className="rules_line small"></div>
                        <p className="rules_text">{t('rulesPage.section5.content')}</p>
                    </div>

                    <div className="rules_section">
                        <h2 className="rules_subtitle">{t('rulesPage.section6.title')}</h2>
                        <div className="rules_line small"></div>
                        <p className="rules_text">{t('rulesPage.section6.content')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


