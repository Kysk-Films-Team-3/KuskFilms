import React, { useEffect, useRef, useState } from 'react';
import { useFavorites } from '../../context/FavoritesContext';
import './ActorRecommendations.css';
import { ShareModal } from './ShareModal';
import { getPersonPicks } from '../../services/api';

export const ActorRecommendations = ({ actor, onClose }) => {
    const modalRef = useRef(null);
    const [hoveredId, setHoveredId] = useState(null);
    const [shareModal, setShareModal] = useState({ isOpen: false, film: null });
    const [picksData, setPicksData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isFavorite, toggleFavorite } = useFavorites();

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

    useEffect(() => {
        const fetchPicks = async () => {
            if (!actor?.id) return;
            try {
                setLoading(true);
                const data = await getPersonPicks(actor.id);
                setPicksData(data);
            } catch (error) {
                console.error('Помилка завантаження рекомендацій актора:', error);
                setPicksData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchPicks();
    }, [actor?.id]);

    if (!actor) return null;

    return (
        <div className="actor_recs_overlay" role="dialog" aria-modal="true">
            <div className="actor_recs_modal" ref={modalRef}>
                <div className="actor_recs_close" onClick={onClose}></div>

                <div className="actor_recs_title">
                    {picksData?.title || actor.actorName || actor.name || ''}
                </div>

                {picksData?.quote && (
                    <div className="actor_recs_quote">
                        {picksData.quote}
                    </div>
                )}

                <div className="actor_recs_content">
                    {loading ? (
                        <div className="actor_recs_empty">Завантаження...</div>
                    ) : picksData?.items?.length ? (
                        picksData.items.map((item) => {
                            const rating = item.rating ? (typeof item.rating === 'number' ? item.rating.toFixed(1) : parseFloat(item.rating).toFixed(1)) : null;
                            const genres = item.genres?.join(', ') || '';
                            
                            return (
                                <div
                                    key={item.id}
                                    className="actor_card"
                                    onMouseEnter={() => setHoveredId(item.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                    onClick={() => window.location.href = `/movie/${item.id}`}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img
                                        src={item.posterUrl || 'https://via.placeholder.com/300x450?text=No+Poster'}
                                        alt={item.title || 'film'}
                                        className="actor_card_img"
                                    />

                                    <div className="actor_card_header">
                                        <div
                                            className={`actor_card_save actor_film_action ${
                                                isFavorite(item.id) ? 'active' : ''
                                            }`}
                                            data-tooltip={picksData?.ui?.saveLabel || ''}
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                await toggleFavorite(item.id);
                                            }}
                                        />
                                        <div
                                            className="actor_card_repost actor_film_action"
                                            data-tooltip={picksData?.ui?.shareLabel || ''}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShareModal({ isOpen: true, film: item });
                                            }}
                                        />
                                    </div>

                                    <div className="actor_card_place">
                                        <div className="actor_card_play"></div>
                                    </div>

                                    <div className="actor_card_text">
                                        {rating && <div className="actor_card_rating">{rating}</div>}
                                        <div className="actor_card_line">
                                            <div className="actor_card_line1">
                                                {item.title}
                                            </div>
                                            {genres && (
                                                <div className="actor_card_line2">
                                                    {genres}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="actor_recs_empty">
                            Немає рекомендацій
                        </div>
                    )}
                </div>
            </div>
            <ShareModal
                isOpen={shareModal.isOpen}
                onClose={() => setShareModal({ isOpen: false, film: null })}
                filmTitleKey={shareModal.film?.title || null}
                filmId={shareModal.film?.id}
            />
        </div>
    );
};
