import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { Profile } from './components/modal/Profile';
import { Logout } from './components/modal/Logout';
import { ActorRecommendations } from './components/modal/ActorRecommendations';
import { ReactKeycloakProvider, useKeycloak } from '@react-keycloak/web';
import { keycloak } from 'services/keycloak';
import PlayerOverlay  from "./components/player/PlayerOverlay";
import { CommentModal } from "./components/modal/CommentModal";
import { List } from './components/admin/List';
import { EditActor } from './components/admin/EditActor';
import { SearchMovie } from './components/admin/SearchMovie';
import { SearchActor } from './components/admin/SearchActor';
import { ModalsProvider, useModals } from './context/ModalsContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { SettingsProvider } from './context/SettingsContext';
import { ActorProvider } from './context/ActorContext';
import { fetchUserProfile } from 'services/api';
import { useHasRole } from 'services/useHasRole';

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
    const hasAdminRole = useHasRole("ADMIN");
    const [userProfile, setUserProfile] = useState(null);
    const [selectedMovies, setSelectedMovies] = useState([]);
    const [selectedActors, setSelectedActors] = useState([]);

    useEffect(() => {
        if (initialized && keycloak.authenticated) {
            fetchUserProfile()
                .then(profileData => {
                    setUserProfile(profileData);
                })
                .catch(error => {
                    console.error(error);
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
                onPlayerOverlayClick={(titleId, episodeId) => openModal({ type: 'PlayerOverlay', titleId, episodeId })}
                onOpenLogoutModal={() => openModal('logout')}
                onOpenActorRecs={(actor) => openModal({ type: 'actorRecs', actor })}
                onProfileClick={() => openModal('profile')}
                onOpenListModal={() => openModal('adminList')}
            />

            {activeModal?.type === 'PlayerOverlay' && (
                <PlayerOverlay
                    isOpen
                    onClose={closeModal}
                    titleId={activeModal.titleId}
                    episodeId={activeModal.episodeId}
                />
            )}

            {/* Закомментированные компоненты должны быть в фигурных скобках в JSX */}
            {/* {activeModal === 'PromoInput' && <PromoInput isOpen onClose={closeModal} />} */}

            {activeModal === 'CommentModal' && <CommentModal isOpen onClose={closeModal} />}

            {activeModal === 'logout' && <Logout isOpen onClose={closeModal} />}

            {activeModal === 'profile' && <Profile userProfile={userProfile} onProfileUpdate={setUserProfile} isOpen onClose={closeModal} />}

            {activeModal?.type === 'actorRecs' && (
                <ActorRecommendations actor={activeModal.actor} onClose={closeModal} />
            )}

            {/*
            {activeModal === 'registrationComplete' && (
               <RegistrationComplete isOpen onClose={closeModal} />
            )}
            {activeModal === 'forgotComplete' && (
               <ForgotComplete isOpen onClose={closeModal} />
            )}
            */}

            {activeModal === 'adminList' && hasAdminRole && (
                <List
                    isOpen
                    onClose={closeModal}
                    onOpenEditActor={() => {
                        closeModal();
                        openModal('editActor');
                    }}
                />
            )}

            {activeModal === 'editActor' && (
                <EditActor
                    isOpen
                    onClose={closeModal}
                    onOpenSearchMovie={() => openModal('searchMovie')}
                    onOpenSearchActor={() => openModal('searchActor')}
                    selectedMovies={selectedMovies}
                    onMoviesAdded={() => setSelectedMovies([])}
                    selectedActors={selectedActors}
                    onActorsAdded={() => setSelectedActors([])}
                />
            )}

            {activeModal === 'searchMovie' && (
                <SearchMovie
                    isOpen
                    onClose={() => {
                        closeModal();
                        openModal('editActor');
                    }}
                    onSelectMovies={(movies) => {
                        setSelectedMovies(movies);
                        closeModal();
                        openModal('editActor');
                    }}
                />
            )}

            {activeModal === 'searchActor' && (
                <SearchActor
                    isOpen
                    onClose={() => {
                        closeModal();
                        openModal('editActor');
                    }}
                    onSelectActors={(actors) => {
                        setSelectedActors(actors);
                        closeModal();
                        openModal('editActor');
                    }}
                    onOpenEditActor={() => {
                        closeModal();
                        openModal('editActor');
                    }}
                />
            )}
        </>
    );
};