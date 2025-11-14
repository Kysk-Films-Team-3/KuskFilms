import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Settings } from '../pages/Settings';
import { Premium } from '../pages/Premium';
import { Favorites } from '../pages/Favorites';
import { Catalog } from '../pages/Catalog';
import { AdminPage } from '../pages/AdminPage';
import { Layout } from '../layout/Layout';
import { PrivateRoute } from './PrivateRoute';

// ========= НАЧАЛО ИЗМЕНЕНИЙ ==========
// `user` переименован в `userProfile` для соответствия данным из App.js.
// `isLoggedIn` убран, так как эта информация уже содержится в Keycloak и не нужна здесь.
// Добавлен `onProfileUpdate`, который будет "проброшен" до компонента Settings.
export const AppRoutes = ({ userProfile, onProfileUpdate, onLoginClick, onDeviceClick, onPaymentClick, onOpenLogoutModal, onOpenActorRecs, onProfileClick }) => {
// ========= КОНЕЦ ИЗМЕНЕНИЙ ============
    return (
        <Routes>
            <Route
                // ========= НАЧАЛО ИЗМЕНЕНИЙ ==========
                // Пропс `user` заменен на `userProfile` и передан в Layout.
                // `isLoggedIn` убран, так как Header теперь определяет это сам.
                element={<Layout onLoginClick={onLoginClick} userProfile={userProfile} onProfileClick={onProfileClick}/>}
                // ========= КОНЕЦ ИЗМЕНЕНИЙ ============
            >
                <Route path="/" element={<Home onOpenActorRecs={onOpenActorRecs} />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/premium" element={<Premium />} />
                <Route path="/Favorites" element={<Favorites />} />

                <Route
                    path="/settings"
                    element={
                        <PrivateRoute>
                            {/* ========= НАЧАЛО ИЗМЕНЕНИЙ ========== */}
                            {/* Пропс `user` заменен на `userProfile`. */}
                            {/* `onProfileUpdate` теперь корректно передается в компонент Settings, чтобы он мог обновлять UI. */}
                            <Settings
                                onOpenLogoutModal={onOpenLogoutModal}
                                onPaymentClick={onPaymentClick}
                                onDeviceClick={onDeviceClick}
                                userProfile={userProfile}
                                onProfileUpdate={onProfileUpdate}
                            />
                            {/* ========= КОНЕЦ ИЗМЕНЕНИЙ ============ */}
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <PrivateRoute>
                            <AdminPage />
                        </PrivateRoute>
                    }
                />
            </Route>
        </Routes>
    );
};