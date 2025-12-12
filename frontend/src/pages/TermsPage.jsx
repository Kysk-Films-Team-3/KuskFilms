import React from 'react';
import { Trans } from 'react-i18next';
import './TermsPage.css';

export const TermsPage = () => {
    return (
        <div className="terms_page">
            <div className="terms_block">
                <h1 className="terms_title"><Trans i18nKey="termsPage.title" /></h1>

                <div className="terms_content">
                    <div className="terms_section">
                        <h2 className="terms_subtitle"><Trans i18nKey="termsPage.section1.title" /></h2>
                        <div className="terms_line small"></div>
                        <p className="terms_text"><Trans i18nKey="termsPage.section1.content" /></p>
                    </div>

                    <div className="terms_section">
                        <h2 className="terms_subtitle"><Trans i18nKey="termsPage.section2.title" /></h2>
                        <div className="terms_line small"></div>
                        <p className="terms_text"><Trans i18nKey="termsPage.section2.content" /></p>
                    </div>

                    <div className="terms_section">
                        <h2 className="terms_subtitle"><Trans i18nKey="termsPage.section3.title" /></h2>
                        <div className="terms_line small"></div>
                        <p className="terms_text"><Trans i18nKey="termsPage.section3.content" /></p>
                    </div>

                    <div className="terms_section">
                        <h2 className="terms_subtitle"><Trans i18nKey="termsPage.section4.title" /></h2>
                        <div className="terms_line small"></div>
                        <p className="terms_text"><Trans i18nKey="termsPage.section4.content" /></p>
                    </div>

                    <div className="terms_section">
                        <h2 className="terms_subtitle"><Trans i18nKey="termsPage.section5.title" /></h2>
                        <div className="terms_line small"></div>
                        <p className="terms_text"><Trans i18nKey="termsPage.section5.content" /></p>
                    </div>

                    <div className="terms_section">
                        <h2 className="terms_subtitle"><Trans i18nKey="termsPage.section6.title" /></h2>
                        <div className="terms_line small"></div>
                        <p className="terms_text"><Trans i18nKey="termsPage.section6.content" /></p>
                    </div>
                </div>
            </div>
        </div>
    );
};


