import React from "react";
import { Outlet } from 'react-router-dom';
import { Header } from '../components/header/Header';
import { Footer } from '../components/footer/Footer';
import './Layout.css';

// ========= НАЧАЛО ИЗМЕНЕНИЙ ==========
// `user` переименован в `userProfile` для соответствия AppRoutes.js.
// `isLoggedIn` и `onLogout` убраны, так как Header теперь сам управляет этим через хук `useKeycloak`.
export const Layout = ({ onLoginClick, userProfile, onProfileClick }) => {
// ========= КОНЕЦ ИЗМЕНЕНИЙ ============
    return (
        <div className="layout">
            <Header
                // ========= НАЧАЛО ИЗМЕНЕНИЙ ==========
                // `user` заменен на `userProfile`.
                // `isLoggedIn` и `onLogout` убраны.
                onLoginClick={onLoginClick}
                userProfile={userProfile}
                onProfileClick={onProfileClick}
                // ========= КОНЕЦ ИЗМЕНЕНИЙ ============
            />

            <main className="layout-main">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};