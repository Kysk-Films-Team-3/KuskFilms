import React, { useEffect, useState, useRef } from "react";
import { useSettings } from "../../context/SettingsContext";
import { useTranslation, Trans } from "react-i18next";
import "./Payment.css";

export const Payment = ({ onClose }) => {
    useTranslation();
    const { state, dispatch } = useSettings();
    const { payment } = state;

    const [copied, setCopied] = useState(false);
    const paymentRef = useRef(null);

    const handleCopy = () => {
        navigator.clipboard.writeText(payment.accountNumber).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (paymentRef.current && !paymentRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <div className="payment_overlay" role="dialog" aria-modal="true">
            <div className="payment_modal" ref={paymentRef}>
                <div className="payment_header">
                    <button className="payment_back_button" onClick={onClose}>
                        <div className="payment_back_arrow"></div>
                        <div className="payment_back_title">
                            <Trans i18nKey="payment.backToSettings" />
                        </div>
                    </button>
                    <div className="payment_title">
                        <Trans i18nKey="payment.title" />
                    </div>
                </div>

                <div className="payment_block">
                    <div className="payment_info_block">
                        <div className="payment_block_title">
                            <Trans i18nKey="payment.accountInfo" />
                        </div>
                        <div className="payment_info_line">
                            <div className="payment_info_label">
                                <Trans i18nKey="payment.accountNumberLabel" />
                            </div>
                            <div className="payment_card_number">
                                {payment.accountNumber}
                                <button className="payment_copy_button" onClick={handleCopy}></button>
                            </div>
                        </div>
                        <hr className="payment_divider" />
                        <div className="payment_info_line">
                            <div className="payment_info_label">
                                <Trans i18nKey="payment.balance" />
                            </div>
                            <div className="payment_info_value">
                                <span className="payment_info_balance">{payment.balance}</span> UAH
                            </div>
                        </div>
                    </div>

                    <div className="payment_card_block">
                        <div className="payment_block_title">
                            <Trans i18nKey="payment.cards" />
                        </div>

                        {payment.cards.length === 0 && (
                            <button
                                className="payment_card_button"
                                onClick={() =>
                                    dispatch({ type: "ADD_CARD", payload: 'New card' })
                                }
                            >
                                <div className="payment_plus_icon"></div>
                                <span>
                                    <Trans i18nKey="payment.addCard" />
                                </span>
                            </button>
                        )}

                        {payment.cards.map((card, i) => (
                            <div key={i} className="payment_card_item">
                                {card}
                            </div>
                        ))}
                    </div>

                    {copied && <div className="payment_tooltip"><Trans i18nKey="payment.copied" /></div>}
                </div>
            </div>
        </div>
    );
};
