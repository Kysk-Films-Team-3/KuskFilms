import React, { useState, useEffect } from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import { fetchFooterData } from '../../services/api';

export const Footer = () => {
    const [footerData, setFooterData] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchFooterData();
                setFooterData(data);
            } catch (error) {
                console.error("Ошибка загрузки данных футера:", error);
            }
        })();
    }, []);

    const getSocialIconClass = (network) => {
        switch (network) {
            case 'tg': return 'footer_telegram_icon';
            case 'fb': return 'footer_facebook_icon';
            case 'ig': return 'footer_instagram_icon';
            case 'x': return 'footer_x_icon';
            default: return '';
        }
    };

    return (
        <footer className="footer">
            <div className="footer_block">
                <div className="footer_divider"></div>
                <div className="footer_container">
                    <div className="footer_top">
                        <div className="footer_left">
                            <div className="footer_icons">
                                {footerData?.socialLinks?.map((social, index) => (
                                    <a key={index} href={social.url} target="_blank" rel="noopener noreferrer">
                                        <div className={getSocialIconClass(social.network)}></div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="footer_columns">
                            {footerData?.columns?.map((column, index) => (
                                <div key={index} className="footer_col">
                                    <div className="footer_col_title">{column.title}</div>
                                    <div className="footer_col_links">
                                        {column.links.map(link => (
                                            <Link key={link.id} to={link.link} className="footer_col_link">
                                                {link.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
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
                                {footerData?.bottomText?.map((text, index) => (
                                    <React.Fragment key={index}>
                                        {text}
                                        {index < (footerData.bottomText.length - 1) && <br />}
                                    </React.Fragment>
                                ))}
                            </div>
                            <div className="footer_links_vertical">
                                <div className="footer_link_line">
                                    {footerData?.legalLinks?.slice(0, 2).map(link => (
                                        <div key={link.id} className="footer_link_item">
                                            <Link to={link.link} className="footer_link">{link.label}</Link>
                                            <div className="footer_link_arrow"></div>
                                        </div>
                                    ))}
                                </div>
                                {footerData?.legalLinks?.length > 2 && (
                                    <div className="footer_link_line">
                                        {footerData.legalLinks.slice(2).map(link => (
                                            <div key={link.id} className="footer_link_item">
                                                <Link to={link.link} className="footer_link">{link.label}</Link>
                                                <div className="footer_link_arrow"></div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
