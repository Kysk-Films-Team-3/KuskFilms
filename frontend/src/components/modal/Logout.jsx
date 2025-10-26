import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { useKeycloak } from '@react-keycloak/web';
import './Logout.css';

export const Logout = ({ onClose }) => {
    const { keycloak } = useKeycloak();
    const logoutRef = useRef(null);
    const navigate = useNavigate();
    useTranslation();

    const handleClose = () => {
        onClose?.();
    };

    const handleLogout = () => {
        if (keycloak) {
            keycloak.logout({ redirectUri: 'http://localhost:3000/' });
        }
        handleClose();
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (logoutRef.current && !logoutRef.current.contains(event.target)) {
                handleClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <div className="logout_overlay" role="dialog" aria-modal="true">
            <div className="logout_modal" ref={logoutRef}>
                <div className="logout_close" onClick={handleClose}></div>

                <div className="logout_text">
                    <div className="logout_title t-text-preline">
                        <Trans i18nKey="logout.confirmMessage" />
                    </div>
                    <div className="logout_description t-text-preline">
                        <Trans i18nKey="logout.description" />
                    </div>
                </div>

                <div className="logout_buttons">
                    <button className="logout_cancel_button" onClick={handleClose}>
                        <Trans i18nKey="logout.cancel" />
                    </button>

                    <button className="logout_exit_button" onClick={handleLogout}>
                        <Trans i18nKey="logout.exit" />
                    </button>
                </div>
            </div>
        </div>
    );
};
