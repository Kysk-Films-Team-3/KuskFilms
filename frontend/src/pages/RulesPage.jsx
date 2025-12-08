import React from 'react';
import { Trans } from 'react-i18next';
import './RulesPage.css';

export const RulesPage = () => {
    return (
        <div className="rules_page">
            <div className="rules_block">
                <h1 className="rules_title"><Trans i18nKey="rulesPage.title" /></h1>

                <div className="rules_content">
                    <div className="rules_section">
                        <h2 className="rules_subtitle"><Trans i18nKey="rulesPage.section1.title" /></h2>
                        <div className="rules_line small"></div>
                        <p className="rules_text"><Trans i18nKey="rulesPage.section1.content" /></p>
                    </div>

                    <div className="rules_section">
                        <h2 className="rules_subtitle"><Trans i18nKey="rulesPage.section2.title" /></h2>
                        <div className="rules_line small"></div>
                        <p className="rules_text"><Trans i18nKey="rulesPage.section2.content" /></p>
                    </div>

                    <div className="rules_section">
                        <h2 className="rules_subtitle"><Trans i18nKey="rulesPage.section3.title" /></h2>
                        <div className="rules_line small"></div>
                        <p className="rules_text"><Trans i18nKey="rulesPage.section3.content" /></p>
                    </div>

                    <div className="rules_section">
                        <h2 className="rules_subtitle"><Trans i18nKey="rulesPage.section4.title" /></h2>
                        <div className="rules_line small"></div>
                        <p className="rules_text"><Trans i18nKey="rulesPage.section4.content" /></p>
                    </div>

                    <div className="rules_section">
                        <h2 className="rules_subtitle"><Trans i18nKey="rulesPage.section5.title" /></h2>
                        <div className="rules_line small"></div>
                        <p className="rules_text"><Trans i18nKey="rulesPage.section5.content" /></p>
                    </div>

                    <div className="rules_section">
                        <h2 className="rules_subtitle"><Trans i18nKey="rulesPage.section6.title" /></h2>
                        <div className="rules_line small"></div>
                        <p className="rules_text"><Trans i18nKey="rulesPage.section6.content" /></p>
                    </div>
                </div>
            </div>
        </div>
    );
};


