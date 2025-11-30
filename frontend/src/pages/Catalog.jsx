import React, { useState, useEffect } from 'react';
import { fetchTitles } from '../services/api';
import './Catalog.css';

export const Catalog = () => {
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
                    setError("Формат данних от сервера невідомий.");
                }
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
                            src={movie.posterUrl || 'https://via.placeholder.com/200x300?text=Poster'}
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