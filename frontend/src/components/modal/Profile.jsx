import React, { useState, useEffect, useRef } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import './Profile.css';

export const Profile = ({ isOpen, onClose }) => {
    const profileRef = useRef(null);
    const { t } = useTranslation();

    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [nickname, setNickname] = useState('');

    useEffect(() => {
        // Мок-пользователь внутри useEffect
        const user = { name: 'John', lastName: 'Doe', nickname: 'johndoe' };

        setName(user.name);
        setLastName(user.lastName);
        setNickname(user.nickname);
    }, []); // теперь зависимостей нет, ESLint больше не ругается

    const canSave = name.trim() && lastName.trim() && nickname.trim();

    const handleSave = () => {
        if (!canSave) return;
        console.log('Дані для збереження:', { name, lastName, nickname });
        onClose();
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
                </div>

                <div className="profile_button_block">
                    <button className="profile_button_exit" onClick={onClose}>
                        <Trans i18nKey="profile.exit" />
                    </button>
                    <button
                        className={`profile_button_save ${canSave ? 'active' : ''}`}
                        onClick={handleSave}
                        disabled={!canSave}
                    >
                        <Trans i18nKey="profile.save" />
                    </button>
                </div>
            </div>
        </div>
    );
};
