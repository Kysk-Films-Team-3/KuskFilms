import { useState, useEffect } from "react";
import "./PromotionsPage.css";
import {Link} from "react-router-dom";
import { fetchPageData } from "../services/api";

export const PromotionsPage = () => {
    const [copied, setCopied] = useState(null);
    const [pageData, setPageData] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchPageData('promo');
                setPageData(data);
            } catch (error) {
                setPageData(null);
            }
        })();
    }, []);

    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopied(code);

        setTimeout(() => {
            setCopied(null);
        }, 1300);
    };

    return (
        <div className="promo_page">
            <div className="hero_no_block">
                <h1 className="hero_title">{pageData?.title || ""}</h1>
                <p className="hero_subtitle">
                    {pageData?.subtitle || ""}
                </p>
            </div>

            <div className="promo_banner medium">
                <h2 className="banner_title_small">{pageData?.premiumTitle || ""}</h2>
                <p className="banner_text_small">
                    {pageData?.premiumText || ""}
                </p>
                <Link to="/Premium" className="banner_btn">{pageData?.buyPremiumBtn || ""}</Link>
            </div>

            <div className="promo_banner_row">
                {pageData?.promos?.map((promo, i) => (
                    <div className="promo_banner small promo_card" key={i}>
                        {copied === promo.code && (
                            <div className="copy_inside">{pageData?.copiedMsg || ""}</div>
                        )}
                        <h3 className="banner_title_xs">{promo.code || ""}</h3>
                        <p className="banner_text_xs">{promo.description || ""}</p>
                        <button
                            className="banner_btn_sm"
                            onClick={() => copyCode(promo.code)}
                        >
                            {pageData?.copyBtn || ""}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
