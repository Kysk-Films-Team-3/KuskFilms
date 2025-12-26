import { useEffect } from "react";
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
            <h1 className="error_title"></h1>
            <p className="error_text">
            </p>
        </div>
    );
};
