import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { Profile } from './components/modal/Profile';
import { Logout } from './components/modal/Logout';
import { ActorRecommendations } from './components/modal/ActorRecommendations';
import { RegistrationComplete } from './components/modal/RegistrationComplete';
import { ForgotComplete } from './components/modal/ForgotComplete';
import { ReactKeycloakProvider, useKeycloak } from '@react-keycloak/web';
import { keycloak } from 'services/keycloak';
import PlayerOverlay  from "./components/player/PlayerOverlay";
import {PromoInput} from "./components/modal/PromoInput";
import {CommentModal} from "./components/modal/CommentModal";
import { ModalsProvider, useModals } from './context/ModalsContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { SettingsProvider } from './context/SettingsContext';
import { ActorProvider } from './context/ActorContext';
import { fetchUserProfile } from 'services/api';

export const App = () => (
    <ReactKeycloakProvider
        authClient={keycloak}
        initOptions={{ onLoad: 'check-sso', checkLoginIframe: false }}
    >
        <SettingsProvider>
            <ActorProvider>
                <FavoritesProvider>
                    <ModalsProvider>
                        <BrowserRouter>
                            <AppContent />
                        </BrowserRouter>
                    </ModalsProvider>
                </FavoritesProvider>
            </ActorProvider>
        </SettingsProvider>
    </ReactKeycloakProvider>
);

const AppContent = () => {
    const { activeModal, openModal, closeModal } = useModals();
    const location = useLocation();
    const shownRegistrationRef = useRef(false);
    const shownPasswordResetRef = useRef(false);
    const { keycloak, initialized } = useKeycloak();
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        if (initialized && keycloak.authenticated) {
            fetchUserProfile()
                .then(profileData => {
                    setUserProfile(profileData);
                })
                .catch(error => {
                    console.error("Не удалось загрузить профиль пользователя с бэкенда:", error);
                });
        }

        const params = new URLSearchParams(location.search);
        if (params.get('accountCreated') === 'true' && !shownRegistrationRef.current) {
            shownRegistrationRef.current = true;
            openModal('registrationComplete');
            window.history.replaceState({}, document.title, '/');
        }
        if (params.get('passwordReset') === 'true' && !shownPasswordResetRef.current) {
            shownPasswordResetRef.current = true;
            openModal('forgotComplete');
            window.history.replaceState({}, document.title, '/');
        }
    }, [location, openModal, initialized, keycloak.authenticated]);


    return (
        <>
            <AppRoutes
                userProfile={userProfile}
                onProfileUpdate={setUserProfile}
                onLoginClick={() => openModal('login')}
                isLoggedIn={keycloak.authenticated}
                onPromoInputClick={() => openModal('PromoInput')}
                onCommentModalClick={() => openModal('CommentModal')}
                onPlayerOverlayClick={() => openModal('PlayerOverlay')}
                onOpenLogoutModal={() => openModal('logout')}
                onOpenActorRecs={(actor) => openModal({ type: 'actorRecs', actor })}
                onProfileClick={() => openModal('profile')}
            />
            {activeModal === 'PlayerOverlay' && <PlayerOverlay isOpen onClose={closeModal} />}
            {activeModal === 'PromoInput' && <PromoInput isOpen onClose={closeModal} />}
            {activeModal === 'CommentModal' && <CommentModal isOpen onClose={closeModal} />}
            {activeModal === 'logout' && <Logout isOpen onClose={closeModal} />}
            {activeModal === 'profile' && <Profile userProfile={userProfile} onProfileUpdate={setUserProfile} isOpen onClose={closeModal} />}
            {activeModal?.type === 'actorRecs' && (
                <ActorRecommendations actor={activeModal.actor} onClose={closeModal} />
            )}
            {activeModal === 'registrationComplete' && (
                <RegistrationComplete isOpen onClose={closeModal} />
            )}
            {activeModal === 'forgotComplete' && (
                <ForgotComplete isOpen onClose={closeModal} />
            )}
        </>
    );
};