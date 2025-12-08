import "./AboutPage.css";
import { Trans } from 'react-i18next';

export const AboutPage = () => {
    return (
        <div className="about_page">

            <div className="about_block">
                <h1 className="about_title"><Trans i18nKey="aboutPage.title" /></h1>
                <div className="about_line"></div>

                <p className="about_text">
                    <Trans i18nKey="aboutPage.description" />
                </p>
            </div>

            <div className="about_block">
                <h2 className="about_subtitle"><Trans i18nKey="aboutPage.missionTitle" /></h2>
                <div className="about_line small"></div>

                <p className="about_text">
                    <Trans i18nKey="aboutPage.missionText" />
                </p>
            </div>

            <div className="about_block">
                <h2 className="about_subtitle"><Trans i18nKey="aboutPage.valuesTitle" /></h2>
                <div className="about_line small"></div>

                <ul className="about_list">
                    <li><Trans i18nKey="aboutPage.value1" /></li>
                    <li><Trans i18nKey="aboutPage.value2" /></li>
                    <li><Trans i18nKey="aboutPage.value3" /></li>
                    <li><Trans i18nKey="aboutPage.value4" /></li>
                    <li><Trans i18nKey="aboutPage.value5" /></li>
                </ul>
            </div>

            <div className="about_block">
                <h2 className="about_subtitle"><Trans i18nKey="aboutPage.teamTitle" /></h2>
                <div className="about_line small"></div>

                <p className="about_text">
                    <Trans i18nKey="aboutPage.teamText" />
                </p>
            </div>

        </div>
    );
};
