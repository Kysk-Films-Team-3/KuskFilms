import "./CareerPage.css";
import { Trans } from "react-i18next";

export const CareerPage = () => {
    return (
        <div className="career_page">

            <div className="career_header">
                <h1 className="career_title"><Trans i18nKey="careerPage.title" /></h1>
                <div className="career_line"></div>

                <p className="career_intro">
                    <Trans i18nKey="careerPage.intro" />
                </p>
            </div>

            <div className="career_section">
                <h2 className="career_subtitle"><Trans i18nKey="careerPage.whyTitle" /></h2>
                <div className="career_line small"></div>

                <ul className="career_list">
                    <li><Trans i18nKey="careerPage.why1" /></li>
                    <li><Trans i18nKey="careerPage.why2" /></li>
                    <li><Trans i18nKey="careerPage.why3" /></li>
                    <li><Trans i18nKey="careerPage.why4" /></li>
                    <li><Trans i18nKey="careerPage.why5" /></li>
                </ul>
            </div>

            <div className="career_section">
                <h2 className="career_subtitle"><Trans i18nKey="careerPage.vacanciesTitle" /></h2>
                <div className="career_line small"></div>

                <div className="career_jobs">

                    <div className="job_card">
                        <h3 className="job_title"><Trans i18nKey="careerPage.job1Title" /></h3>
                        <p className="job_desc">
                            <Trans i18nKey="careerPage.job1Desc" />
                        </p>
                    </div>

                    <div className="job_card">
                        <h3 className="job_title"><Trans i18nKey="careerPage.job2Title" /></h3>
                        <p className="job_desc">
                            <Trans i18nKey="careerPage.job2Desc" />
                        </p>
                    </div>

                    <div className="job_card">
                        <h3 className="job_title"><Trans i18nKey="careerPage.job3Title" /></h3>
                        <p className="job_desc">
                            <Trans i18nKey="careerPage.job3Desc" />
                        </p>
                    </div>

                </div>
            </div>

            <div className="career_section">
                <h2 className="career_subtitle"><Trans i18nKey="careerPage.notFoundTitle" /></h2>
                <div className="career_line small"></div>

                <p className="career_intro">
                    <Trans i18nKey="careerPage.notFoundText" />
                </p>
                <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=kyskfilms@gmail.com"
                    className="career_mail_btn"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Trans i18nKey="careerPage.sendResume" />
                </a>

            </div>

        </div>
    );
};
