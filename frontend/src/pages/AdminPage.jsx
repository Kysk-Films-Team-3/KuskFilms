import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useHasRole } from '../services/useHasRole';

export const AdminPage = () => {
    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const hasAdminRole = useHasRole("ADMIN");

    useEffect(() => {
        if (!hasAdminRole) {
            setError('');
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
                if (err.response && err.response.status === 403) {
                    setError('');
                } else {
                    setError(err.message || '');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, [hasAdminRole]);

    return (
        <div className="admin-page-container" style={{ padding: '20px', minHeight: '80vh' }}>
            <h1></h1>

            {loading && <p></p>}

            {error && (
                <div style={{ color: 'red', border: '1px solid red', padding: '10px' }}>
                    <h3></h3>
                    <p>{error}</p>
                </div>
            )}

            {adminData && (
                <div>
                    <h3></h3>
                    <pre>{JSON.stringify(adminData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};