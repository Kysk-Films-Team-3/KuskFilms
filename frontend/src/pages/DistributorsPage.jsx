import "./DistributorsPage.css";
import { Trans } from "react-i18next";

export const DistributorsPage = () => {
    return (
        <div className="dist_page">

            <h1 className="dist_title"><Trans i18nKey="distributorsPage.title" /></h1>
            <div className="dist_top_line"></div>

            <div className="dist_section">
                <div className="dist_line"></div>
                <div className="dist_text">
                    <h2 className="dist_heading"><Trans i18nKey="distributorsPage.cooperationTitle" /></h2>
                    <p className="dist_desc">
                        <Trans i18nKey="distributorsPage.cooperationDesc" />
                    </p>
                </div>
            </div>

            <div className="dist_section">
                <div className="dist_line"></div>
                <div className="dist_text">
                    <h2 className="dist_heading"><Trans i18nKey="distributorsPage.requirementsTitle" /></h2>
                    <p className="dist_desc">
                        <Trans i18nKey="distributorsPage.requirementsDesc" />
                    </p>
                </div>
            </div>

            <div className="dist_section">
                <div className="dist_line"></div>
                <div className="dist_text">
                    <h2 className="dist_heading"><Trans i18nKey="distributorsPage.offerTitle" /></h2>
                    <p className="dist_desc">
                        <Trans i18nKey="distributorsPage.offerDesc" />
                    </p>
                </div>
            </div>

            <div className="dist_section">
                <div className="dist_line"></div>
                <div className="dist_text">
                    <h2 className="dist_heading"><Trans i18nKey="distributorsPage.contactTitle" /></h2>
                    <p className="dist_desc">
                        <Trans i18nKey="distributorsPage.contactDesc" />
                    </p>
                    <a
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=kyskfilms@gmail.com"
                        className="career_mail_btn"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Trans i18nKey="distributorsPage.sendProposal" />
                    </a>
                </div>
            </div>

        </div>
    );
};
