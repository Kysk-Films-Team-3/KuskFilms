import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAuthUser, createCheckoutSession, getPremiumData } from '../services/api';
import { useKeycloak } from '@react-keycloak/web';
import "./Premium.css";

export const Premium = () => {
    const user = getAuthUser();
    const isLoggedIn = !!user;
    const { keycloak } = useKeycloak();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [premiumData, setPremiumData] = useState(null);

    useEffect(() => {
        const loadPremiumData = async () => {
            try {
                const data = await getPremiumData();
                setPremiumData(data);
            } catch (err) {
                console.error("Ошибка загрузки данных премиума:", err);
            }
        };
        loadPremiumData();
    }, []);

    const handleSubscribe = async () => {
        if (!keycloak?.authenticated) {
            keycloak?.login();
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await createCheckoutSession();

            if (result.success && result.url) {
                window.location.href = result.url;
            } else {
                setError(result.message || '');
            }
        } catch (err) {
            setError('');
        } finally {
            setIsLoading(false);
        }
    };

    if (!premiumData) {
        return <div className="premium_page"></div>;
    }

    return (
        <div className="premium_page">
            <div className="premium_header">
                <Link
                    to={isLoggedIn ? "/settings" : "/"}
                    className="premium_back"
                >
                    <div className="premium_back_icon"></div>
                    {premiumData.backButton}
                </Link>
            </div>

            <div className="premium_row">
                <div className="premium_title_line">
                    <div className="premium_title">
                        {premiumData.title}
                    </div>
                    <div className="premium_title">
                        {premiumData.planName}
                        <div className="premium_price">{premiumData.price}</div>
                    </div>
                </div>

                <div className="premium_left">
                    {premiumData.features && premiumData.features.map((feature, index) => (
                        <div key={index} className="premium_line">
                            <span className="premium_feature_text">
                                {feature}
                            </span>
                            <div className="premium_line_icon"></div>
                        </div>
                    ))}
                </div>
            </div>

            {error && (
                <div style={{
                    color: '#ff4444',
                    textAlign: 'center',
                    marginTop: '20px',
                    fontSize: '18px'
                }}>
                    {error}
                </div>
            )}

            <div className="premium_button_container">
                <button
                    className="premium_button"
                    onClick={handleSubscribe}
                    disabled={isLoading}
                >
                    {isLoading ? '' : premiumData.buttonText}
                </button>
            </div>
        </div>
    );
};