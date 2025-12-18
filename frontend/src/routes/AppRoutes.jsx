import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Premium } from '../pages/Premium';
import { Favorites } from '../pages/Favorites';
import { Catalog } from '../pages/Catalog';
import { NewAndPopular } from '../pages/NewAndPopular';
import { Films } from '../pages/Films';
import { MoviePage } from '../pages/MoviePage';
import { AboutPage } from "../pages/AboutPage";
import { CareerPage } from "../pages/CareerPage";
import { AgentsPage } from "../pages/AgentsPage";
import { PromotionsPage } from "../pages/PromotionsPage";
import { FaqPage } from "../pages/FaqPage";
import { TermsPage } from "../pages/TermsPage";
import { PrivacyPage } from "../pages/PrivacyPage";
import { RulesPage } from "../pages/RulesPage";
import { DevicesPage } from "../pages/DevicesPage";
import { DistributorsPage } from "../pages/DistributorsPage";
import { ContactsPage } from "../pages/ContactsPage";
import { ErrorPage } from "../pages/ErrorPage";
import { PaymentSuccess } from '../pages/PaymentSuccess';
import { PaymentCancel } from '../pages/PaymentCancel';
import { AdminPage } from '../pages/AdminPage';
import { EditMovie } from '../components/admin/EditMovie'; // <--- 1. ДОБАВЛЕН ИМПОРТ
import { Layout } from '../layout/Layout';
import { PrivateRoute } from './PrivateRoute';

export const AppRoutes = ({ userProfile, onProfileUpdate, onLoginClick, onDeviceClick, onPaymentClick, onOpenLogoutModal, onOpenActorRecs, onProfileClick, onPromoInputClick, onCommentModalClick, onOpenListModal }) => {

    return (
        <Routes>
            <Route
                element={<Layout onLoginClick={onLoginClick} userProfile={userProfile} onProfileClick={onProfileClick} onPromoInputClick={onPromoInputClick} onOpenLogoutModal={onOpenLogoutModal} onOpenListModal={onOpenListModal}/>}
            >
                <Route path="/" element={<Home onOpenActorRecs={onOpenActorRecs} />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/films" element={<Films />} />
                <Route path="/new" element={<NewAndPopular />} />
                <Route path="/new-popular" element={<NewAndPopular />} />
                <Route path="/premium" element={<Premium />} />
                <Route path="/Favorites" element={<Favorites />} />
                <Route path="/movie/:id" element={<MoviePage onCommentModalClick={onCommentModalClick}  />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/careers" element={<CareerPage />} />
                <Route path="/agents" element={<AgentsPage />} />
                <Route path="/offers" element={<PromotionsPage />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/devices" element={<DevicesPage />} />
                <Route path="/distributors" element={<DistributorsPage />} />
                <Route path="/contacts" element={<ContactsPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/rules" element={<RulesPage />} />
                <Route path="/error" element={<ErrorPage />} />
                <Route path="/payment/success" element={<PaymentSuccess onProfileUpdate={onProfileUpdate} />} />
                <Route path="/payment/cancel" element={<PaymentCancel />} />

                {/* Админ-панель (Главная) */}
                <Route
                    path="/admin"
                    element={
                        <PrivateRoute>
                            <AdminPage />
                        </PrivateRoute>
                    }
                />

                {/* 2. ДОБАВЛЕН МАРШРУТ СОЗДАНИЯ ФИЛЬМА */}
                <Route
                    path="/admin/movie/new"
                    element={
                        <PrivateRoute>
                            <EditMovie />
                        </PrivateRoute>
                    }
                />
            </Route>
        </Routes>
    );
};