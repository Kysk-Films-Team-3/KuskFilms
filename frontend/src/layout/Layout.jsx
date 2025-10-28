import React from "react";
import { Outlet } from 'react-router-dom';
import { Header } from '../components/header/Header';
import { Footer } from '../components/footer/Footer';
import './Layout.css';

export const Layout = ({ onLoginClick, isLoggedIn, user, onLogout, onProfileClick }) => {
    return (
        <div className="layout">
            <Header
                onLoginClick={onLoginClick}
                isLoggedIn={isLoggedIn}
                user={user}
                onLogout={onLogout}
                onProfileClick={onProfileClick}
            />

            <main className="layout-main">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};
