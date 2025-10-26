import React from "react";
import { Link } from "react-router-dom";
import { getAuthUser } from '../services/api';
import { useTranslation, Trans } from 'react-i18next';
import "./Premium.css";

export const Premium = () => {
    const user = getAuthUser();
    const isLoggedIn = !!user;

    useTranslation();

    return (
        <div className="premium_page">
            <div className="premium_header">
                <Link
                    to={isLoggedIn ? "/settings" : "/"}
                    className="premium_back"
                >
                    <div className="premium_back_icon"></div>
                    <Trans i18nKey={isLoggedIn ? 'premium.backToSettings' : 'premium.backToHome'} />
                </Link>
            </div>

            <div className="premium_row">
                <div className="premium_title_line">
                    <div className="premium_title">
                        <Trans i18nKey="premium.confirmSelection" />
                    </div>
                    <div className="premium_title">
                        Kysk + <Trans i18nKey="premium.premium" />
                        <div className="premium_price">15€</div>
                    </div>
                </div>

                <div className="premium_left">
                    <div className="premium_line">
                        <span className="premium_feature_text">
                            <Trans i18nKey="premium.features.moviesCount" /> <span className="premium_price">70 000</span> <Trans i18nKey="premium.features.movies" />
                        </span>
                        <div className="premium_line_icon"></div>
                    </div>

                    <div className="premium_line">
                        <span className="premium_feature_text">
                            <Trans i18nKey="premium.features.catalog" />
                        </span>
                        <div className="premium_line_icon"></div>
                    </div>

                    <div className="premium_line">
                        <span className="premium_feature_text">
                            <Trans i18nKey="premium.features.parentControl" />
                        </span>
                        <div className="premium_line_icon"></div>
                    </div>

                    <div className="premium_line">
                        <span className="premium_feature_text">
                            <Trans i18nKey="premium.features.offline" />
                        </span>
                        <div className="premium_line_icon"></div>
                    </div>
                </div>
            </div>

            <div className="premium_button_container">
                <button className="premium_button">
                    <Trans i18nKey="premium.subscribe" />
                </button>
            </div>
        </div>
    );
};
