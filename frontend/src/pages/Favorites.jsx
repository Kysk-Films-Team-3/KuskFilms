import React, { useEffect, useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { fetchUiDictionary } from '../services/api';
import './Favorites.css';

export function Favorites() {
    const { favorites, toggleFavorite, loading, loadFavorites } = useFavorites();
    const [uiDictionary, setUiDictionary] = useState(null);

    useEffect(() => {
        loadFavorites();
    }, [loadFavorites]);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchUiDictionary();
                setUiDictionary(data);
            } catch (error) {
            }
        })();
    }, []);

    if (loading) {
        return (
            <div className="favorite_page">
                <div className="favorite_title">{uiDictionary?.common?.favorites || ''}</div>
            </div>
        );
    }

    return (
        <div className="favorite_page">
            <div className="favorite_title">{uiDictionary?.common?.favorites || ''}</div>

            {favorites.length === 0 ? (
                <div className="favorite_subtitle"></div>
            ) : (
                <div className="favorite_list">
                    {favorites.map(film => (
                        <FavoriteCard
                            key={film.id}
                            film={film}
                            toggleFavorite={toggleFavorite}
                            uiDictionary={uiDictionary}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function FavoriteCard({ film, toggleFavorite, uiDictionary }) {
    if (!film) return null;

    const handleToggle = async () => {
        await toggleFavorite(film.id);
    };

    return (
        <div className="favorite_actor_card">
            <div className="favorite_actor_card_img_wrapper">
                <img
                    src={film.posterUrl || ''}
                    alt={film.title || ''}
                    className="favorite_actor_card_img"
                />

                <div className="favorite_actor_card_header">
                    <div
                        className={`favorite_actor_card_save favorite_actor_film_action ${
                            film.isSaved ? 'active' : ''
                        }`}
                        data-tooltip={uiDictionary?.common?.watchLater || ''}
                        onClick={handleToggle}
                    />
                </div>
            </div>

            <div className="favorite_actor_card_text">
                {film.rating && film.rating > 0 && (
                    <div className="favorite_actor_card_rating">
                        {typeof film.rating === 'number' ? film.rating.toFixed(1) : parseFloat(film.rating).toFixed(1)}
                    </div>
                )}

                {film.title && (
                    <div className="favorite_actor_card_title">{film.title}</div>
                )}

                {film.genres && film.genres.length > 0 && (
                    <div className="favorite_actor_card_linedate">
                        {film.genres.join(", ")}
                    </div>
                )}
            </div>
        </div>
    );
}
