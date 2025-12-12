import { useEffect } from "react";
import { Trans } from "react-i18next";
import "./ErrorPage.css";

export const ErrorPage = () => {

    useEffect(() => {
        document.body.classList.add("no-layout");

        return () => {
            document.body.classList.remove("no-layout");
        };
    }, []);

    return (
        <div className="error_page">
            <div className="error_image"></div>
            <h1 className="error_title"><Trans i18nKey="errorPage.title" /></h1>
            <p className="error_text">
                <Trans i18nKey="errorPage.text" />
            </p>
        </div>
    );
};
