import React, { useState, useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { api } from '../services/api';
import { useHasRole } from '../services/useHasRole';

export const AdminPage = () => {
    const { t } = useTranslation();
    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const hasAdminRole = useHasRole("ADMIN");

    useEffect(() => {
        if (!hasAdminRole) {
            setError(t("adminPage.error403"));
            setLoading(false);
            return;
        }

        const fetchAdminData = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await api.get('/admin/users');

                setAdminData(response.data);
            } catch (err) {
                console.error("Admin API Error:", err.response || err);
                if (err.response && err.response.status === 403) {
                    setError(t("adminPage.errorBackend"));
                } else {
                    setError(`${t("adminPage.errorApi")} ${err.message}`);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, [hasAdminRole, t]);

    return (
        <div className="admin-page-container" style={{ padding: '20px', minHeight: '80vh' }}>
            <h1><Trans i18nKey="adminPage.title" /></h1>

            {loading && <p><Trans i18nKey="adminPage.loading" /></p>}

            {error && (
                <div style={{ color: 'red', border: '1px solid red', padding: '10px' }}>
                    <h3><Trans i18nKey="adminPage.errorTitle" /></h3>
                    <p>{error}</p>
                </div>
            )}

            {adminData && (
                <div>
                    <h3><Trans i18nKey="adminPage.usersList" /></h3>
                    <pre>{JSON.stringify(adminData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};