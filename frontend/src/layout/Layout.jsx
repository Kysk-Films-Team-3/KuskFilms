import React from "react";
import { Outlet } from 'react-router-dom';
import { Header } from '../components/header/Header';
import { Footer } from '../components/footer/Footer';
import './Layout.css';

export const Layout = ({ onLoginClick, userProfile, onProfileClick, onPromoInputClick, onOpenLogoutModal }) => {

    return (
        <div className="layout">
            <Header
                onPromoInputClick={onPromoInputClick}
                onLoginClick={onLoginClick}
                userProfile={userProfile}
                onProfileClick={onProfileClick}
                onOpenLogoutModal={onOpenLogoutModal}
            />

            <main className="layout-main">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};