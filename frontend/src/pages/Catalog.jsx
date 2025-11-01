import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import './Catalog.css';

export const Catalog = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);

                const response = await api.get('/movies/popular');

                if (response.data && Array.isArray(response.data.content)) {
                    setMovies(response.data.content);
                } else {
                    console.error("API повернул невідомі данні:", response.data);
                    setError("Формат данних от сервера невідомий.");
                }

                setError(null);
            } catch (err) {
                console.error("API не відповів:", err);
                setError("Не вдалось загрузити данні з сервера.");
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    return (
        <div className="home-container" style={{ padding: '20px' }}>
            <h1>Каталог фильмів</h1>

            {loading && <p>Загрузка...</p>}
            {error && <p style={{ color: 'orange' }}>{error}</p>}

            <div className="movie-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                {movies.map(movie => (
                    <div key={movie.id} style={{ border: '1px solid #333', padding: '10px', width: '200px' }}>
                        <img
                            src={movie.poster || 'https://via.placeholder.com/200x300?text=Poster'}
                            alt={movie.title}
                            style={{ width: '100%' }}
                        />
                        <h3 style={{ fontSize: '16px' }}>{movie.title}</h3>
                        <p>Рейтинг: {movie.rating}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};