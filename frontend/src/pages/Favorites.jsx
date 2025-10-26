import React, { useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { Trans, useTranslation } from 'react-i18next';
import './Favorites.css';

export function Favorites() {
    const { favorites, toggleFavorite } = useFavorites();
    const homeFilms = favorites.filter(f => f.source === 'home');
    const recFilms = favorites.filter(f => f.source === 'recommendation');
    const otherFilms = favorites.filter(f => f.source !== 'home' && f.source !== 'recommendation');
    const { i18n } = useTranslation();


    return (
        <div className="favorite_page">
            <div className="favorite_title">
                <Trans i18nKey="favorites.title">Обране</Trans>
            </div>

            {favorites.length === 0 ? (
                <div className="favorite_subtitle">
                    <Trans i18nKey="favorites.empty">Обраного поки що немає</Trans>
                </div>
            ) : (
                <>
                    {homeFilms.length > 0 && (
                        <>
                            <div className="favorite_list">
                                {homeFilms.map(film => (
                                    <FavoriteCard
                                        key={`home-${film.id}`}
                                        film={film}
                                        toggleFavorite={toggleFavorite}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {recFilms.length > 0 && (
                        <>
                            <div className="favorite_subsection_title">
                                <Trans i18nKey="favorites.recommendations">З рекомендацій</Trans>
                            </div>
                            <div className="favorite_list">
                                {recFilms.map(film => (
                                    <FavoriteCard
                                        key={`rec-${film.id}`}
                                        film={film}
                                        toggleFavorite={toggleFavorite}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {otherFilms.length > 0 && (
                        <div className="favorite_list">
                            {otherFilms.map(film => (
                                <FavoriteCard
                                    key={`other-${film.id}`}
                                    film={film}
                                    toggleFavorite={toggleFavorite}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function FavoriteCard({ film, toggleFavorite }) {
    const [hovered, setHovered] = useState(false);

    if (!film) return null;

    return (
        <div
            className="favorite_actor_card"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="favorite_actor_card_img_wrapper">
                <img
                    src={hovered && film.hoverImage ? film.hoverImage : film.image}
                    alt={film.title || 'Без назви'}
                    className="favorite_actor_card_img"
                />

                <div className="favorite_actor_card_header">
                    <div
                        className={`favorite_actor_card_save favorite_actor_film_action ${
                            film.saved ? 'active' : ''
                        }`}
                        data-tooltip="Remove from favorites"
                        onClick={() => toggleFavorite(film)}
                    />
                </div>
            </div>

            <div className="favorite_actor_card_text">
                {film.rating && (
                    <div className="favorite_actor_card_rating">{film.rating}</div>
                )}

                {(film.linedate || film.line1) && (
                    <div className="favorite_actor_card_linedate">
                        {film.linedate && <Trans i18nKey={film.linedate} />}
                        {film.line1 && <Trans i18nKey={film.line1} />}
                    </div>
                )}

                {film.line2 && (
                    <div className="favorite_actor_card_line2">
                        <Trans i18nKey={film.line2} />
                    </div>
                )}

                {film.season && (
                    <div className="favorite_actor_card_line2">
                        <Trans i18nKey={film.season} />
                    </div>
                )}
            </div>
        </div>
    );
}
