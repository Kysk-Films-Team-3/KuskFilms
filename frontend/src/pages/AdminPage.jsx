import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useHasRole } from '../hooks/useHasRole';

export const AdminPage = () => {
    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const hasAdminRole = useHasRole("ADMIN");

    useEffect(() => {
        if (!hasAdminRole) {
            setError("Доступ заборонено. Потрібна роль ADMIN.");
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
                    setError("Помилка 403: Бэкенд відхилив запит (недостатньо прав).");
                } else {
                    setError(`Помилка API: ${err.message}`);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, [hasAdminRole]);

    return (
        <div className="admin-page-container" style={{ padding: '20px', minHeight: '80vh' }}>
            <h1>👑 Панель Адміністратора</h1>

            {loading && <p>Завантаження адмін-даних...</p>}

            {error && (
                <div style={{ color: 'red', border: '1px solid red', padding: '10px' }}>
                    <h3>Помилка доступу</h3>
                    <p>{error}</p>
                </div>
            )}

            {adminData && (
                <div>
                    <h3>Список користувачів (приклад)</h3>
                    <pre>{JSON.stringify(adminData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};