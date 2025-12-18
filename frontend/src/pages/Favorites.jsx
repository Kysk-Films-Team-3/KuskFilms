import React, { useEffect } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import './Favorites.css';

export function Favorites() {
    const { favorites, toggleFavorite, loading, loadFavorites } = useFavorites();

    useEffect(() => {
        loadFavorites();
    }, [loadFavorites]);

    if (loading) {
        return (
            <div className="favorite_page">
                <div className="favorite_title"></div>
                <div className="favorite_subtitle"></div>
            </div>
        );
    }

    return (
        <div className="favorite_page">
            <div className="favorite_title"></div>

            {favorites.length === 0 ? (
                <div className="favorite_subtitle"></div>
            ) : (
                <div className="favorite_list">
                    {favorites.map(film => (
                        <FavoriteCard
                            key={film.id}
                            film={film}
                            toggleFavorite={toggleFavorite}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function FavoriteCard({ film, toggleFavorite }) {
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
