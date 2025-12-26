import React, { useState, useEffect, useRef } from 'react';
import './Profile.css';
import { fetchUserProfile, uploadAvatar, fetchUiDictionary } from '../../services/api';
import { useKeycloak } from '@react-keycloak/web';

export const Profile = ({ isOpen, onClose, userProfile, onProfileUpdate }) => {

    const profileRef = useRef(null);
    const { keycloak } = useKeycloak();
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [nickname, setNickname] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uiDictionary, setUiDictionary] = useState(null);

    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);
        try {
            const updatedProfile = await uploadAvatar(file);
            onProfileUpdate(updatedProfile);
        } catch (err) {
            setError(uiDictionary?.profile?.errorAvatar || '');
        } finally {
            setIsUploading(false);
        }
    };

    useEffect(() => {
        if (!isOpen) return;

        const fetchProfileData = async () => {
            if (!keycloak.authenticated) {
                setError(uiDictionary?.profile?.errorAuth || '');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await fetchUserProfile();
                onProfileUpdate(response);

                setName(keycloak.tokenParsed?.given_name || '');
                setLastName(keycloak.tokenParsed?.family_name || '');
                setNickname(response.username || keycloak.tokenParsed?.preferred_username || '');

            } catch (err) {
                setError(uiDictionary?.profile?.errorLoad || '');

                setName(keycloak.tokenParsed?.given_name || '');
                setLastName(keycloak.tokenParsed?.family_name || '');
                setNickname(keycloak.tokenParsed?.preferred_username || '');
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();

    }, [isOpen, keycloak.authenticated, keycloak.tokenParsed]);

    useEffect(() => {
        if (isOpen && userProfile) {
            setName(keycloak.tokenParsed?.given_name || '');
            setLastName(keycloak.tokenParsed?.family_name || '');
            setNickname(userProfile.username || keycloak.tokenParsed?.preferred_username || '');
        }
    }, [userProfile, isOpen, keycloak.tokenParsed]);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchUiDictionary();
                setUiDictionary(data);
            } catch (error) {
            }
        })();
    }, []);

    const canSave = name.trim() && lastName.trim() && nickname.trim();

    const handleSave = async () => {
        if (!canSave) return;

        try {
            setLoading(true);
            setError(null);

            const updatedProfile = { name, lastName, nickname };

            onClose();
        } catch (err) {
            setError(uiDictionary?.profile?.errorSave || '');
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
                    {uiDictionary?.profile?.editTitle || ''}
                </div>

                <div className="profile_content">
                    {loading && <p style={{ textAlign: 'center' }}>{uiDictionary?.profile?.loading || ''}</p>}
                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                    {!loading && (
                        <>
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
                                        {uiDictionary?.profile?.firstName || ''}
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
                                        {uiDictionary?.profile?.lastName || ''}
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
                                        {uiDictionary?.profile?.nickname || ''}
                                    </label>
                                </div>
                            </div>
                            
                            <div className="profile_premium_status" style={{
                                marginTop: '20px',
                                padding: '15px',
                                borderRadius: '8px',
                                backgroundColor: userProfile?.isPremium ? '#4E55D4' : '#34353F',
                                color: '#F8F8FE',
                                textAlign: 'center',
                                fontSize: '16px',
                                fontWeight: '500'
                            }}>
                                {userProfile?.isPremium ? (
                                    uiDictionary?.profile?.premiumActive || ''
                                ) : (
                                    uiDictionary?.profile?.premiumInactive || ''
                                )}
                            </div>
                        </>
                    )}
                </div>

                <div className="profile_button_block">
                    <button className="profile_button_exit" onClick={onClose}>
                        {uiDictionary?.profile?.exit || ''}
                    </button>
                    <button
                        className={`profile_button_save ${canSave && !loading ? 'active' : ''}`}
                        onClick={handleSave}
                        disabled={!canSave || loading}
                    >
                        {loading ? '' : (uiDictionary?.profile?.save || '')}
                    </button>
                </div>
            </div>
        </div>
    );
};