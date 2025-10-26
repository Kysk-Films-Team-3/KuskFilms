import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trans } from 'react-i18next';
import './ForgotComplete.css';

export const ForgotComplete = ({ onClose }) => {
    const navigate = useNavigate();
    const forgotcompleteRef = useRef(null);

    const handleComplete = () => {
        if (onClose) onClose();
        navigate('/');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (forgotcompleteRef.current && !forgotcompleteRef.current.contains(event.target)) {
                if (onClose) onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    return (
        <div className="forgot_complete_overlay" role="dialog" aria-modal="true">
            <div className="forgot_complete_modal" ref={forgotcompleteRef}>
                <div
                    className="forgot_complete_close_icon"
                    onClick={onClose}
                    style={{ cursor: 'pointer' }}
                ></div>

                <div className="forgot_complete_title">
                    <Trans i18nKey="forgotComplete.title">Пароль успішно змінено</Trans>
                </div>

                <div className="forgot_complete_subtitle t-text-preline">
                    <Trans i18nKey="forgotComplete.subtitle">
                        Тепер ви можете увійти, використовуючи новий пароль.
                    </Trans>
                </div>

                <div className="forgot_complete_button_block">
                    <button
                        className="forgot_complete_button"
                        onClick={handleComplete}
                    >
                        <Trans i18nKey="forgotComplete.button">Перейти на головну</Trans>
                    </button>
                </div>
            </div>
        </div>
    );
};
