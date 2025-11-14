import React, { useState, useEffect, useRef } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import './Profile.css';
// ========= НАЧАЛО ИЗМЕНЕНИЙ ==========
// `api` больше не используется напрямую.
// Вместо этого мы импортируем конкретные функции для работы с профилем.
import { fetchUserProfile, uploadAvatar } from '../../services/api';
// ========= КОНЕЦ ИЗМЕНЕНИЙ ============
import { useKeycloak } from '@react-keycloak/web';

// ========= НАЧАЛО ИЗМЕНЕНИЙ ==========
// Пропсы переименованы для соответствия App.js (`userProfile`).
// Добавлен пропс `onProfileUpdate` для обновления UI после загрузки аватара.
export const Profile = ({ isOpen, onClose, userProfile, onProfileUpdate }) => {
// ========= КОНЕЦ ИЗМЕНЕНИЙ ============
    const profileRef = useRef(null);
    const { t } = useTranslation();
    const { keycloak } = useKeycloak();

    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [nickname, setNickname] = useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ========= НАЧАЛО ИЗМЕНЕНИЙ ==========
    // Добавлена логика для загрузки аватара, аналогичная `Settings.jsx`.
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);
        try {
            const updatedProfile = await uploadAvatar(file);
            onProfileUpdate(updatedProfile); // Обновляем UI во всем приложении
        } catch (err) {
            console.error("Ошибка при загрузке аватара:", err);
            setError("Не удалось загрузить аватар.");
        } finally {
            setIsUploading(false);
        }
    };
    // ========= КОНЕЦ ИЗМЕНЕНИЙ ============

    useEffect(() => {
        if (!isOpen) return;

        const fetchProfileData = async () => {
            if (!keycloak.authenticated) {
                setError("Пользователь не авторизован.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // ========= НАЧАЛО ИЗМЕНЕНИЙ ==========
                // Старый вызов `api.get('/users/me')` заменен на `fetchUserProfile()`.
                // Это гарантирует, что мы используем правильный URL `/api/users/profile/me`.
                const response = await fetchUserProfile();
                // ========= КОНЕЦ ИЗМЕНЕНИЙ ============

                // Используем `firstName` и `lastName` из бэкенда, если они там будут.
                // `username` теперь основное поле для никнейма.
                setName(response.firstName || '');
                setLastName(response.lastName || '');
                setNickname(response.username || '');

            } catch (err) {
                console.error("Ошибка загрузки профиля:", err.response || err);
                setError("Не удалось загрузить данные.");

                // Фоллбэк на данные из токена, если запрос не удался
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

            // ========= НАЧАЛО ИЗМЕНЕНИЙ ==========
            // URL для `put` запроса также исправлен.
            // Внимание: Этот эндпоинт (PUT /api/users/profile/me) вам еще предстоит создать на бэкенде.
            // await api.put('/users/profile/me', updatedProfile);
            console.log("Сохранение профиля (пока не реализовано на бэкенде):", updatedProfile);
            // ========= КОНЕЦ ИЗМЕНЕНИЙ ============

            onClose();
        } catch (err) {
            console.error("Ошибка сохранения профиля:", err);
            setError("Не удалось сохранить. Попробуйте еще раз.");
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
                            {/* ========= НАЧАЛО ИЗМЕНЕНИЙ ========== */}
                            {/* Добавлен невидимый input и интерактивность для аватара. */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                                accept="image/png, image/jpeg"
                                disabled={isUploading}
                            />
                            <div
                                className="profile_avatar"
                                onClick={() => !isUploading && fileInputRef.current.click()}
                                style={{ cursor: isUploading ? 'progress' : 'pointer' }}
                            >
                                {userProfile?.avatarUrl && (
                                    <img
                                        src={userProfile.avatarUrl}
                                        alt="Avatar"
                                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                )}
                            </div>
                            {/* ========= КОНЕЦ ИЗМЕНЕНИЙ ============ */}
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
                                        <Trans i18nKey="profile.firstName" />
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