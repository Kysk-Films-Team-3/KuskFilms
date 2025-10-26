import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Settings } from '../pages/Settings';
import { Premium } from '../pages/Premium';
import { Favorites } from '../pages/Favorites';
import { Layout } from '../layout/Layout';
import { PrivateRoute } from './PrivateRoute';

export const AppRoutes = ({ onLoginClick, onDeviceClick, onPaymentClick, onOpenLogoutModal,     onOpenActorRecs,  isLoggedIn, user, onProfileClick }) => {
    return (
        <Routes>
            <Route
                element={<Layout onLoginClick={onLoginClick} isLoggedIn={isLoggedIn} user={user} onProfileClick={onProfileClick}/>}
            >
                <Route path="/" element={<Home onOpenActorRecs={onOpenActorRecs} />} />
                <Route path="/premium" element={<Premium />} />
                <Route path="/Favorites" element={<Favorites />} />
                <Route
                    path="/settings"
                    element={
                        <PrivateRoute isLoggedIn={isLoggedIn} onLoginClick={onLoginClick}>
                            <Settings
                                onOpenLogoutModal={onOpenLogoutModal}
                                onPaymentClick={onPaymentClick}
                                onDeviceClick={onDeviceClick}
                                user={user}
                            />
                        </PrivateRoute>
                    }
                />

            </Route>
        </Routes>
    );
};
