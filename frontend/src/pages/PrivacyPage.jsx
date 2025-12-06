import React from 'react';
import { useTranslation } from 'react-i18next';
import './PrivacyPage.css';

export const PrivacyPage = () => {
    const { t } = useTranslation();

    return (
        <div className="privacy_page">
            <div className="privacy_block">
                <h1 className="privacy_title">{t('privacyPage.title')}</h1>

                <div className="privacy_content">
                    <div className="privacy_section">
                        <h2 className="privacy_subtitle">{t('privacyPage.section1.title')}</h2>
                        <div className="privacy_line small"></div>
                        <p className="privacy_text">{t('privacyPage.section1.content')}</p>
                    </div>

                    <div className="privacy_section">
                        <h2 className="privacy_subtitle">{t('privacyPage.section2.title')}</h2>
                        <div className="privacy_line small"></div>
                        <p className="privacy_text">{t('privacyPage.section2.content')}</p>
                    </div>

                    <div className="privacy_section">
                        <h2 className="privacy_subtitle">{t('privacyPage.section3.title')}</h2>
                        <div className="privacy_line small"></div>
                        <p className="privacy_text">{t('privacyPage.section3.content')}</p>
                    </div>

                    <div className="privacy_section">
                        <h2 className="privacy_subtitle">{t('privacyPage.section4.title')}</h2>
                        <div className="privacy_line small"></div>
                        <p className="privacy_text">{t('privacyPage.section4.content')}</p>
                    </div>

                    <div className="privacy_section">
                        <h2 className="privacy_subtitle">{t('privacyPage.section5.title')}</h2>
                        <div className="privacy_line small"></div>
                        <p className="privacy_text">{t('privacyPage.section5.content')}</p>
                    </div>

                    <div className="privacy_section">
                        <h2 className="privacy_subtitle">{t('privacyPage.section6.title')}</h2>
                        <div className="privacy_line small"></div>
                        <p className="privacy_text">{t('privacyPage.section6.content')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


