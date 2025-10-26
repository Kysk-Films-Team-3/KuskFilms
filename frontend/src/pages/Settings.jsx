import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import './Settings.css';

export const Settings = ({ user, onPaymentClick, onDeviceClick, onOpenLogoutModal }) => {
    useTranslation();
    const [isChildProtectionEnabled, setIsChildProtectionEnabled] = useState(false);
    const [isSportResultsEnabled, setIsSportResultsEnabled] = useState(false);

    return (
        <div className="settings_pages">
            <div className="settings_page">
                <div className="settings_header">
                    <Link to="/" className="settings_back_button">
                        <div className="settings_back_icon"></div>
                        <div><Trans i18nKey="settings.backToHome" /></div>
                    </Link>
                </div>

                <div className="settings_container">
                    <aside className="settings_sidebar">
                        <div className="settings_profile_block">
                            <div className="settings_profile_info">
                                <div className="settings_profile_details">
                                    <div className="settings_profile_avatar"></div>
                                    <div className="settings_profile_email">{user?.emailOrPhone}</div>
                                </div>
                                <div className="settings_arrow_email_icon"></div>
                            </div>
                        </div>

                        <div className="settings_block_title">
                            <Trans i18nKey="settings.mySubscriptions" />
                        </div>
                        <Link to="/Premium" className="settings_premium_link">
                            <div className="settings_subscriptions_block">
                                <div className="settings_subscription_content">
                                    <div className="settings_subscription_status">
                                        <Trans i18nKey="settings.premium" />
                                    </div>
                                    <div className="settings_right_group">
                                        <button className="settings_manage_button">
                                            <Trans i18nKey="settings.connect" />
                                        </button>
                                        <div className="settings_arrow_premium_icon"></div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </aside>

                    <main className="settings_main_content">
                        <div className="settings_row">
                            <div className="settings_card" onClick={onPaymentClick}>
                                <div className="settings_card_icon_container">
                                    <div className="settings_card_icon settings_payment_icon"></div>
                                    <div className="settings_card_content">
                                        <div className="settings_card_title">
                                            <Trans i18nKey="settings.paymentMethod" />
                                        </div>
                                        <div className="settings_card_subtitle">
                                            <Trans i18nKey="settings.add" />
                                        </div>
                                    </div>
                                </div>
                                <div className="settings_arrow_pay_icon"></div>
                            </div>

                            <div className="settings_card" onClick={onDeviceClick}>
                                <div className="settings_card_icon_container">
                                    <div className="settings_card_icon settings_devices_icon"></div>
                                    <div className="settings_card_content">
                                        <div className="settings_card_title">
                                            <Trans i18nKey="settings.devices" />
                                        </div>
                                        <div className="settings_card_subtitle">
                                            <Trans i18nKey="settings.connect" />
                                        </div>
                                    </div>
                                </div>
                                <div className="settings_arrow_device_icon"></div>
                            </div>
                        </div>

                        <div className="settings_child_protection_section">
                            <div className="settings_section_header">
                                <div className="settings_section_title">
                                    <Trans i18nKey="settings.childProtection" />
                                </div>
                                <label className="settings_toggle_switch">
                                    <input
                                        type="checkbox"
                                        checked={isChildProtectionEnabled}
                                        onChange={() => setIsChildProtectionEnabled(!isChildProtectionEnabled)}
                                    />
                                    <div className="settings_slider"></div>
                                </label>
                            </div>

                            <div className="settings_child_warning">
                                <div
                                    className="settings_child_warning_icon"
                                    style={{
                                        backgroundImage: isChildProtectionEnabled
                                            ? "url('https://res.cloudinary.com/da9jqs8yq/image/upload/v1756245941/Protection_happy.png')"
                                            : "url('https://res.cloudinary.com/da9jqs8yq/image/upload/v1756245939/Protection_Sad.png')",
                                    }}
                                ></div>
                                <div className="settings_child_warning_text_container">
                                    <div className="settings_child_warning_title">
                                        {isChildProtectionEnabled
                                            ? <Trans i18nKey="settings.childProtectionEnabled" />
                                            : <Trans i18nKey="settings.childProtectionDisabled" />}
                                    </div>
                                    <div className="settings_child_warning_subtitle">
                                        <Trans i18nKey="settings.childProtectionSubtitle" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="settings_sport_section">
                            <div className="settings_section_header">
                                <div className="settings_section_title">
                                    <Trans i18nKey="settings.sport" />
                                </div>
                            </div>
                            <div className="settings_sport_row">
                                <div className="settings_section_subtitle">
                                    <Trans i18nKey="settings.showResults" />
                                </div>
                                <label className="settings_toggle_switch">
                                    <input
                                        type="checkbox"
                                        checked={isSportResultsEnabled}
                                        onChange={() => setIsSportResultsEnabled(!isSportResultsEnabled)}
                                    />
                                    <div className="settings_slider"></div>
                                </label>
                            </div>
                        </div>

                        <Link
                            to="/"
                            className="settings_logout_link"
                            onClick={(e) => {
                                e.preventDefault();
                                onOpenLogoutModal();
                            }}
                        >
                            <div className="settings_logout_block">
                                <div className="settings_logout_icon"></div>
                                <div><Trans i18nKey="settings.logout" /></div>
                            </div>
                        </Link>
                    </main>
                </div>
            </div>
        </div>
    );
};
