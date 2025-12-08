import "./PromotionsPage.css";
import React, { useState } from "react";
import {Link} from "react-router-dom";
import {Trans} from "react-i18next";

export const PromotionsPage = () => {
    const [copied, setCopied] = useState(null);

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
                <h1 className="hero_title"><Trans i18nKey="promotionsPage.title" /></h1>
                <p className="hero_subtitle">
                    <Trans i18nKey="promotionsPage.subtitle" />
                </p>
            </div>

            <div className="promo_banner medium">
                <h2 className="banner_title_small"><Trans i18nKey="promotionsPage.premiumTitle" /></h2>

                <p className="banner_text_small">
                    <Trans i18nKey="promotionsPage.premiumText" />
                </p>
                <Link to="/Premium" className="banner_btn"><Trans i18nKey="promotionsPage.buyPremium" /></Link>
            </div>

            <div className="promo_banner_row">

                <div className="promo_banner small promo_card">
                    {copied === "KYSK30" && (
                        <div className="copy_inside"><Trans i18nKey="promotionsPage.copied" /></div>
                    )}

                    <h3 className="banner_title_xs"><Trans i18nKey="promotionsPage.promo1" /></h3>
                    <p className="banner_text_xs"><Trans i18nKey="promotionsPage.promo1Desc" /></p>

                    <button
                        className="banner_btn_sm"
                        onClick={() => copyCode("KYSK30")}
                    >
                        <Trans i18nKey="promotionsPage.copy" />
                    </button>
                </div>

                <div className="promo_banner small promo_card">
                    {copied === "FREEWEEK" && (
                        <div className="copy_inside"><Trans i18nKey="promotionsPage.copied" /></div>
                    )}

                    <h3 className="banner_title_xs"><Trans i18nKey="promotionsPage.promo2" /></h3>
                    <p className="banner_text_xs">
                        <Trans i18nKey="promotionsPage.promo2Desc" />
                    </p>

                    <button
                        className="banner_btn_sm"
                        onClick={() => copyCode("FREEWEEK")}
                    >
                        <Trans i18nKey="promotionsPage.copy" />
                    </button>
                </div>

            </div>
        </div>
    );
};
