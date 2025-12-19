import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { getLogoutUi } from '../../services/api';
import './Logout.css';

export const Logout = ({ onClose }) => {
    const { keycloak } = useKeycloak();
    const logoutRef = useRef(null);
    const navigate = useNavigate();
    const [logoutData, setLogoutData] = useState(null);

    const handleClose = () => {
        onClose?.();
    };

    const handleLogout = () => {
        if (keycloak) {
            keycloak.logout({ redirectUri: 'http://localhost/' });
        }
        handleClose();
    };

    useEffect(() => {
        const loadLogoutData = async () => {
            try {
                const data = await getLogoutUi();
                setLogoutData(data);
            } catch (err) {
            }
        };
        loadLogoutData();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (logoutRef.current && !logoutRef.current.contains(event.target)) {
                onClose?.();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    if (!logoutData) {
        return (
            <div className="logout_overlay" role="dialog" aria-modal="true">
                <div className="logout_modal" ref={logoutRef}>
                    <div>Завантаження...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="logout_overlay" role="dialog" aria-modal="true">
            <div className="logout_modal" ref={logoutRef}>
                <div className="logout_close" onClick={handleClose}></div>

                <div className="logout_text">
                    <div className="logout_title t-text-preline">
                        {logoutData.title}
                    </div>
                    <div className="logout_description t-text-preline">
                        {logoutData.description}
                    </div>
                </div>

                <div className="logout_buttons">
                    <button className="logout_cancel_button" onClick={handleClose}>
                        {logoutData.stayButton}
                    </button>

                    <button className="logout_exit_button" onClick={handleLogout}>
                        {logoutData.logoutButton}
                    </button>
                </div>
            </div>
        </div>
    );
};
