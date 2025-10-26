import React, { useEffect, useRef } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { Profile } from './components/modal/Profile';
import { Device } from './components/modal/Device';
import { Payment } from './components/modal/Payment';
import { Logout } from './components/modal/Logout';
import { ActorRecommendations } from './components/modal/ActorRecommendations';
import { RegistrationComplete } from './components/modal/RegistrationComplete';
import { ForgotComplete } from './components/modal/ForgotComplete';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { keycloak } from './services/keycloak';
import { ModalsProvider, useModals } from './context/ModalsContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { SettingsProvider } from './context/SettingsContext';
import { ActorProvider } from './context/ActorContext';

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
    useEffect(() => {
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

    }, [location, openModal]);


    return (
        <>
            <AppRoutes
                onLoginClick={() => openModal('login')}
                isLoggedIn={false}
                onDeviceClick={() => openModal('device')}
                onPaymentClick={() => openModal('payment')}
                onOpenLogoutModal={() => openModal('logout')}
                onOpenActorRecs={(actor) => openModal({ type: 'actorRecs', actor })}
                onProfileClick={() => openModal('profile')}
            />

            {activeModal === 'device' && <Device isOpen onClose={closeModal} />}
            {activeModal === 'payment' && <Payment isOpen onClose={closeModal} />}
            {activeModal === 'logout' && <Logout isOpen onClose={closeModal} />}
            {activeModal === 'profile' && <Profile isOpen onClose={closeModal} />}
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
