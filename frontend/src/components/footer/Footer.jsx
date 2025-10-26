import React, { } from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';

export const Footer = () => {
    useTranslation();


    return (
        <footer className="footer">
            <div className="footer_block">
                <div className="footer_divider"></div>
                <div className="footer_container">
                    <div className="footer_top">
                        <div className="footer_left">
                            <div className="footer_icons">
                                <div className="footer_telegram_icon"></div>
                                <div className="footer_facebook_icon"></div>
                                <div className="footer_instagram_icon"></div>
                                <div className="footer_x_icon"></div>
                            </div>

                            <div className="footer_help">
                                <button><Trans i18nKey="footer.needHelp" /></button>
                            </div>

                        </div>

                        <div className="footer_columns">
                            <div className="footer_col">
                                <div className="footer_col_title"><Trans i18nKey="footer.kysk" /></div>
                                <div className="footer_col_links">
                                    <Link to="/about" className="footer_col_link"><Trans i18nKey="footer.aboutUs" /></Link>
                                    <Link to="/careers" className="footer_col_link"><Trans i18nKey="footer.careers" /></Link>
                                    <Link to="/agents" className="footer_col_link"><Trans i18nKey="footer.agents" /></Link>
                                </div>
                            </div>
                            <div className="footer_col">
                                <div className="footer_col_title"><Trans i18nKey="footer.help" /></div>
                                <div className="footer_col_links">
                                    <Link to="/faq" className="footer_col_link"><Trans i18nKey="footer.faq" /></Link>
                                    <Link to="/devices" className="footer_col_link"><Trans i18nKey="footer.devices" /></Link>
                                    <Link to="/distributors" className="footer_col_link"><Trans i18nKey="footer.distributors" /></Link>
                                    <Link to="/contacts" className="footer_col_link"><Trans i18nKey="footer.contacts" /></Link>
                                </div>
                            </div>
                            <div className="footer_col">
                                <div className="footer_col_title"><Trans i18nKey="footer.other" /></div>
                                <div className="footer_col_links">
                                    <Link to="/offers" className="footer_col_link"><Trans i18nKey="footer.offers" /></Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="footer_bottom">
                        <Link to="/" className="logo">
                            <img
                                src="https://res.cloudinary.com/da9jqs8yq/image/upload/v1754083133/Logo.png"
                                className="footer_logo"
                                alt="footer_logo"
                            />
                        </Link>
                        <div className="footer_text">
                            <div className="footer_main_text">
                                <span className="footer_main_date">© 2012-2025</span> <Trans i18nKey="footer.companyName" />
                                <br />
                                <Trans i18nKey="footer.freeChannels" />
                                <br />
                                <Trans i18nKey="footer.softwareRegistry" />
                            </div>
                            <div className="footer_links_vertical">
                                <div className="footer_link_line">
                                    <div className="footer_link_item">
                                        <Link to="/terms" className="footer_link"><Trans i18nKey="footer.terms" /></Link>
                                        <div className="footer_link_arrow"></div>
                                    </div>
                                    <div className="footer_link_item">
                                        <Link to="/privacy" className="footer_link"><Trans i18nKey="footer.privacy" /></Link>
                                        <div className="footer_link_arrow"></div>
                                    </div>
                                </div>
                                <div className="footer_link_line">
                                    <div className="footer_link_item">
                                        <Link to="/rules" className="footer_link"><Trans i18nKey="footer.rules" /></Link>
                                        <div className="footer_link_arrow"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
