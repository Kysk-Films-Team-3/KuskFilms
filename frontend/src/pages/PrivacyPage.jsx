import React from 'react';
import { Trans } from 'react-i18next';
import './PrivacyPage.css';

export const PrivacyPage = () => {
    return (
        <div className="privacy_page">
            <div className="privacy_block">
                <h1 className="privacy_title"><Trans i18nKey="privacyPage.title" /></h1>

                <div className="privacy_content">
                    <div className="privacy_section">
                        <h2 className="privacy_subtitle"><Trans i18nKey="privacyPage.section1.title" /></h2>
                        <div className="privacy_line small"></div>
                        <p className="privacy_text"><Trans i18nKey="privacyPage.section1.content" /></p>
                    </div>

                    <div className="privacy_section">
                        <h2 className="privacy_subtitle"><Trans i18nKey="privacyPage.section2.title" /></h2>
                        <div className="privacy_line small"></div>
                        <p className="privacy_text"><Trans i18nKey="privacyPage.section2.content" /></p>
                    </div>

                    <div className="privacy_section">
                        <h2 className="privacy_subtitle"><Trans i18nKey="privacyPage.section3.title" /></h2>
                        <div className="privacy_line small"></div>
                        <p className="privacy_text"><Trans i18nKey="privacyPage.section3.content" /></p>
                    </div>

                    <div className="privacy_section">
                        <h2 className="privacy_subtitle"><Trans i18nKey="privacyPage.section4.title" /></h2>
                        <div className="privacy_line small"></div>
                        <p className="privacy_text"><Trans i18nKey="privacyPage.section4.content" /></p>
                    </div>

                    <div className="privacy_section">
                        <h2 className="privacy_subtitle"><Trans i18nKey="privacyPage.section5.title" /></h2>
                        <div className="privacy_line small"></div>
                        <p className="privacy_text"><Trans i18nKey="privacyPage.section5.content" /></p>
                    </div>

                    <div className="privacy_section">
                        <h2 className="privacy_subtitle"><Trans i18nKey="privacyPage.section6.title" /></h2>
                        <div className="privacy_line small"></div>
                        <p className="privacy_text"><Trans i18nKey="privacyPage.section6.content" /></p>
                    </div>
                </div>
            </div>
        </div>
    );
};


