import React, { useState, useEffect, useRef } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import './Profile.css';
import { api } from '../../services/api';
import { useKeycloak } from '@react-keycloak/web';

export const Profile = ({ isOpen, onClose }) => {
    const profileRef = useRef(null);
    const { t } = useTranslation();
    const { keycloak } = useKeycloak();

    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [nickname, setNickname] = useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isOpen) return;

        const fetchProfileData = async () => {
            if (!keycloak.authenticated) {
                setError("Користувач не авторизован.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await api.get('/users/me');

                setName(response.data.name || '');
                setLastName(response.data.lastName || '');
                setNickname(response.data.nickname || '');

            } catch (err) {
                console.error("Помилка завантаження профіля:", err.response || err);
                setError("Не вдалось загрузити данні.");

                setName(keycloak.tokenParsed?.given_name || '');
                setLastName(keycloak.tokenParsed?.family_name || '');
                setNickname(keycloak.tokenParsed?.preferred_username || '');
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();

    }, [isOpen, keycloak.authenticated, keycloak.tokenParsed]);

    const canSave = name.trim() && lastName.trim() && nickname.trim();

    const handleSave = async () => {
        if (!canSave) return;

        try {
            setLoading(true);
            setError(null);

            const updatedProfile = { name, lastName, nickname };

            await api.put('/users/me', updatedProfile);

            onClose();
        } catch (err) {
            console.error("Помилка збереження профиля:", err);
            setError("Не вдалося зберегти. Спробуйте ще раз.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="profile_overlay" role="dialog" aria-modal="true">
            <div className="profile_modal" ref={profileRef}>
                <div className="profile_close_icon" onClick={onClose}></div>

                <div className="profile_title">
                    <Trans i18nKey="profile.editTitle" />
                </div>

                <div className="profile_content">
                    {loading && <p style={{ textAlign: 'center' }}>Загрузка...</p>}
                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                    {!loading && (
                        <>
                            <div className="profile_avatar"></div>
                            <div className="profile_inputs_wrapper">
                                <div className="profile_input_block">
                                    <input
                                        type="text"
                                        id="profileName"
                                        placeholder=" "
                                        className="profile_input"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                    />
                                    <label htmlFor="profileName">
                                        <Trans i1E8nKey="profile.firstName" />
                                    </label>
                                </div>
                                <div className="profile_input_block">
                                    <input
                                        type="text"
                                        id="profileLastName"
                                        placeholder=" "
                                        className="profile_input"
                                        value={lastName}
                                        onChange={e => setLastName(e.target.value)}
                                    />
                                    <label htmlFor="profileLastName">
                                        <Trans i18nKey="profile.lastName" />
                                    </label>
                                </div>

                                <div className="profile_input_block">
                                    <input
                                        type="text"
                                        id="profileNickname"
                                        placeholder=" "
                                        className="profile_input"
                                        value={nickname}
                                        onChange={e => setNickname(e.target.value)}
                                    />
                                    <label htmlFor="profileNickname">
                                        <Trans i18nKey="profile.nickname" />
                                    </label>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="profile_button_block">
                    <button className="profile_button_exit" onClick={onClose}>
                        <Trans i18nKey="profile.exit" />
                    </button>
                    <button
                        className={`profile_button_save ${canSave && !loading ? 'active' : ''}`}
                        onClick={handleSave}
                        disabled={!canSave || loading}
                    >
                        {loading ? <Trans i18nKey="profile.saving" /> : <Trans i18nKey="profile.save" />}
                    </button>
                </div>
            </div>
        </div>
    );
};