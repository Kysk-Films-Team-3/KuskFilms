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
                <h1 className="hero_title">Акції та пропозиції</h1>
                <p className="hero_subtitle">
                    Вигідні преміум пропозиції та ексклюзивні промокоди.
                </p>
            </div>

            <div className="promo_banner medium">
                <h2 className="banner_title_small">Преміум зі знижкою</h2>

                <p className="banner_text_small">
                    Повний доступ до каталогу, 4K та перегляду без реклами.
                </p>
                <Link to="/Premium" className="banner_btn">Придбати преміум</Link>
            </div>

            <div className="promo_banner_row">

                <div className="promo_banner small promo_card">
                    {copied === "KYSK30" && (
                        <div className="copy_inside">Скопійовано ✔</div>
                    )}

                    <h3 className="banner_title_xs">Промокод KYSK25</h3>
                    <p className="banner_text_xs">-30% для нових користувачів</p>

                    <button
                        className="banner_btn_sm"
                        onClick={() => copyCode("KYSK30")}
                    >
                        Скопіювати
                    </button>
                </div>

                <div className="promo_banner small promo_card">
                    {copied === "FREEWEEK" && (
                        <div className="copy_inside">Скопійовано ✔</div>
                    )}

                    <h3 className="banner_title_xs">Промокод FREEWEEK</h3>
                    <p className="banner_text_xs">
                        7 днів безкоштовного преміуму
                    </p>

                    <button
                        className="banner_btn_sm"
                        onClick={() => copyCode("FREEWEEK")}
                    >
                        Скопіювати
                    </button>
                </div>

            </div>
        </div>
    );
};
