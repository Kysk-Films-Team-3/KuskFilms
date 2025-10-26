import React, { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useFavorites } from '../../context/FavoritesContext';
import './ActorRecommendations.css';

export const ActorRecommendations = ({ actor, onClose }) => {
    const modalRef = useRef(null);
    const [hoveredId, setHoveredId] = useState(null);
    const { favorites, toggleFavorite } = useFavorites();
    const { t } = useTranslation();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    if (!actor) return null;

    const ActorRecomendation = [
        {id: 'statham', filmsactor: [
                {id: 1, rating: "8.0", linedate: "filmsactor.statham.film1.linedate", line1: "filmsactor.statham.film1.line1", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757800653/Rectangle_1_4_bp59la.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png"},
                {id: 2, rating: "9.2", linedate: "filmsactor.statham.film2.linedate", line1: "filmsactor.statham.film2.line1", line2: "filmsactor.statham.film2.line2", season: "filmsactor.statham.film2.season", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757800653/Rectangle_1_3_q7dqmd.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png"},
                {id: 3, rating: "8.0", linedate: "filmsactor.statham.film3.linedate", line1: "filmsactor.statham.film3.line1", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757800653/Rectangle_1_2_gjgn2v.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png"},
                {id: 4, rating: "8.2", linedate: "filmsactor.statham.film4.linedate", line1: "filmsactor.statham.film4.line1", line2: "filmsactor.statham.film4.line2", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757800654/Rectangle_1_1_enqrbb.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png"}
            ]},
        {id: 'garfield', filmsactor: [
                {id: 1, rating: "8.0", linedate: "filmsactor.garfield.film1.linedate", line1: "filmsactor.garfield.film1.line1", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png"},
                {id: 2, rating: "9.2", linedate: "filmsactor.garfield.film2.linedate", line1: "filmsactor.garfield.film2.line1", line2: "filmsactor.garfield.film2.line2", season: "filmsactor.garfield.film2.season", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png"},
                {id: 3, rating: "8.0", linedate: "filmsactor.garfield.film3.linedate", line1: "filmsactor.garfield.film3.line1", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png"},
                {id: 4, rating: "8.2", linedate: "filmsactor.garfield.film4.linedate", line1: "filmsactor.garfield.film4.line1", line2: "filmsactor.garfield.film4.line2", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png"}
            ]},
        {id: 'cage', filmsactor: [
                {id: 1, rating: "8.0", linedate: "filmsactor.cage.film1.linedate", line1: "filmsactor.cage.film1.line1", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png"},
                {id: 2, rating: "9.2", linedate: "filmsactor.cage.film2.linedate", line1: "filmsactor.cage.film2.line1", line2: "filmsactor.cage.film2.line2", season: "filmsactor.cage.film2.season", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png"},
                {id: 3, rating: "8.0", linedate: "filmsactor.cage.film3.linedate", line1: "filmsactor.cage.film3.line1", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png"},
                {id: 4, rating: "8.2", linedate: "filmsactor.cage.film4.linedate", line1: "filmsactor.cage.film4.line1", line2: "filmsactor.cage.film4.line2", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png"}
            ]},
        {id: 'downey', filmsactor: [
                {id: 1, rating: "8.0", linedate: "filmsactor.downey.film1.linedate", line1: "filmsactor.downey.film1.line1", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png"},
                {id: 2, rating: "9.2", linedate: "filmsactor.downey.film2.linedate", line1: "filmsactor.downey.film2.line1", line2: "filmsactor.downey.film2.line2", season: "filmsactor.downey.film2.season", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png"},
                {id: 3, rating: "8.0", linedate: "filmsactor.downey.film3.linedate", line1: "filmsactor.downey.film3.line1", image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png"},
                {id: 4, rating: "8.2", linedate: "filmsactor.downey.film4.linedate", line1: "filmsactor.downey.film4.line1", line2: "filmsactor.downey.film4.line2", image: '', hoverImage: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1757539098/Rectangle_1_cj6xvy.png"}
            ]},
    ];

    const actorData = ActorRecomendation.find((a) => a.id === actor.id);

    return (
        <div className="actor_recs_overlay" role="dialog" aria-modal="true">
            <div className="actor_recs_modal" ref={modalRef}>
                <div className="actor_recs_close" onClick={onClose}></div>

                <div className="actor_recs_title">
                    <Trans i18nKey="recommendations.fromActor" />{' '}
                    <Trans i18nKey={actor.nameKey} />
                </div>

                <div className="actor_recs_quote">
                    <Trans i18nKey={actor.quoteKey} />
                </div>

                <div className="actor_recs_content">
                    {actorData?.filmsactor?.length ? (
                        actorData.filmsactor.map((item) => (
                            <div
                                key={item.id}
                                className="actor_card"
                                onMouseEnter={() => setHoveredId(item.id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                <img
                                    src={hoveredId === item.id ? item.hoverImage : item.image}
                                    alt={item.line1 || 'film'}
                                    className="actor_card_img"
                                />

                                <div className="actor_card_header">
                                    <div
                                        className={`actor_card_save actor_film_action ${
                                            favorites.some((fav) => fav.id === item.id) ? 'active' : ''
                                        }`}
                                        data-tooltip={t('tooltip.watch')}
                                        onClick={() =>
                                            toggleFavorite({
                                                id: item.id,
                                                image: item.image,
                                                hoverImage: item.hoverImage,
                                                rating: item.rating,
                                                linedate: item.linedate,
                                                line1: item.line1,
                                                line2: item.line2,
                                                season: item.season,
                                                source: 'home',
                                            })
                                        }

                                    />
                                    <div
                                        className="actor_card_repost actor_film_action"
                                        data-tooltip={t('tooltip.share')}
                                    />
                                </div>


                                <div className="actor_card_place">
                                    <div className="actor_card_play"></div>
                                </div>

                                <div className="actor_card_text">
                                    <div className="actor_card_rating">{item.rating}</div>
                                    <div className="actor_card_line">
                                        <div className="actor_card_line1">
                                            <span className="actor_card_date">
                                                <Trans i18nKey={item.linedate} />
                                            </span>
                                            <Trans i18nKey={item.line1} />
                                        </div>
                                        <div className="actor_card_line2">
                                            <Trans i18nKey={item.line2} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="actor_recs_empty">
                            <Trans i18nKey="recommendations.empty" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
