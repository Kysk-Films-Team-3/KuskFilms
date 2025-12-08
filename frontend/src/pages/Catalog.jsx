import React, { useState, useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { fetchTitles } from '../services/api';
import './Catalog.css';

export const Catalog = () => {
    const { t } = useTranslation();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);

                const data = await fetchTitles(0);

                if (data && Array.isArray(data.content)) {
                    setMovies(data.content);
                    setError(null);
                } else {
                    console.error("API повернул невідомі данні:", data);
                    setError(t("catalog.errorFormat"));
                }
            } catch (err) {
                console.error("API не відповів:", err);
                setError(t("catalog.error"));
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [t]);

    return (
        <div className="home-container" style={{ padding: '20px' }}>
            <h1><Trans i18nKey="catalog.title" /></h1>

            {loading && <p><Trans i18nKey="catalog.loading" /></p>}
            {error && <p style={{ color: 'orange' }}>{error}</p>}

            <div className="movie-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                {movies.map(movie => (
                    <div key={movie.id} style={{ border: '1px solid #333', padding: '10px', width: '200px' }}>
                        <img
                            src={movie.posterUrl || 'https://via.placeholder.com/200x300?text=Poster'}
                            alt={movie.title}
                            style={{ width: '100%' }}
                        />
                        <h3 style={{ fontSize: '16px' }}>{movie.title}</h3>
                        <p><Trans i18nKey="catalog.rating" /> {movie.rating}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};