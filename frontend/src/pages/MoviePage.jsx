import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import PlayerOverlay from "../components/player/PlayerOverlay";
import { fetchTitleById } from "../services/api";
import { useFavorites } from "../context/FavoritesContext";
import "./MoviePage.css";

export const MoviePage = ({ onCommentModalClick }) => {
    const { id } = useParams();
    const { isFavorite, toggleFavorite } = useFavorites();
    const [isPlayerOpen, setIsPlayerOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userRating, setUserRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [selectedReview, setSelectedReview] = useState(null);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const castRef = useRef(null);
    const reviewsRef = useRef(null);
    const alsoWatchRef = useRef(null);
    const [castScrollState, setCastScrollState] = useState({
        isAtStart: true,
        isAtEnd: false,
        isScrollable: false
    });
    const [reviewsScrollState, setReviewsScrollState] = useState({
        isAtStart: true,
        isAtEnd: false,
        isScrollable: false
    });
    const [alsoWatchScrollState, setAlsoWatchScrollState] = useState({
        isAtStart: true,
        isAtEnd: false,
        isScrollable: false
    });

    useEffect(() => {
        const loadMovie = async () => {
            if (!id) {
                setError("");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const data = await fetchTitleById(id);
                setMovie(data);
            } catch (err) {
                setError("");
            } finally {
                setLoading(false);
            }
        };

        loadMovie();
    }, [id]);

    const handleCastScroll = useCallback(() => {
        if (!castRef.current) return;
        const el = castRef.current;
        const scrollWidth = el.scrollWidth;
        const clientWidth = el.clientWidth;
        const scrollLeft = el.scrollLeft;
        const isScrollable = scrollWidth > clientWidth + 5;
        const isAtStart = !isScrollable || scrollLeft <= 5;
        const isAtEnd = !isScrollable || scrollLeft + clientWidth >= scrollWidth - 5;
        setCastScrollState({ isAtStart, isAtEnd, isScrollable });
    }, []);

    const handleReviewsScroll = useCallback(() => {
        if (!reviewsRef.current) return;
        const el = reviewsRef.current;
        const scrollWidth = el.scrollWidth;
        const clientWidth = el.clientWidth;
        const scrollLeft = el.scrollLeft;
        const isScrollable = scrollWidth > clientWidth + 5;
        const isAtStart = !isScrollable || scrollLeft <= 5;
        const isAtEnd = !isScrollable || scrollLeft + clientWidth >= scrollWidth - 5;
        setReviewsScrollState({ isAtStart, isAtEnd, isScrollable });
    }, []);

    const handleAlsoWatchScroll = useCallback(() => {
        if (!alsoWatchRef.current) return;
        const el = alsoWatchRef.current;
        const scrollWidth = el.scrollWidth;
        const clientWidth = el.clientWidth;
        const scrollLeft = el.scrollLeft;
        const isScrollable = scrollWidth > clientWidth + 5;
        const isAtStart = !isScrollable || scrollLeft <= 5;
        const isAtEnd = !isScrollable || scrollLeft + clientWidth >= scrollWidth - 5;
        setAlsoWatchScrollState({ isAtStart, isAtEnd, isScrollable });
    }, []);

    useEffect(() => {
        if (!movie) return;
        
        const checkScroll = () => {
            if (castRef.current) {
                handleCastScroll();
            }
            if (reviewsRef.current) {
                handleReviewsScroll();
            }
            if (alsoWatchRef.current) {
                handleAlsoWatchScroll();
            }
        };
        
        checkScroll();
        const handleResize = () => checkScroll();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [movie, handleCastScroll, handleReviewsScroll, handleAlsoWatchScroll]);

    useEffect(() => {
        if (selectedReview) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [selectedReview]);

    if (loading) {
        return (
            <div className="movie_page" style={{ padding: '100px 20px', textAlign: 'center' }}>
                <p></p>
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div className="movie_page" style={{ padding: '100px 20px', textAlign: 'center' }}>
                <p style={{ color: 'red' }}>{error || ''}</p>
            </div>
        );
    }

    const videoUrl = movie.streamUrl;

    const releaseYear = movie.year || null;
    const genres = movie.genre || null;

    const handleWatchClick = () => {
        if (videoUrl) {
            setIsPlayerOpen(true);
        }
    };

    const castAndCrew = movie?.cast?.map(person => ({
        id: person.id,
        name: person.name,
        role: person.role || 'Актор',
        image: person.photoUrl || 'https://via.placeholder.com/150'
    })) || [];

    const reviews = movie?.reviews || [];

    const alsoWatchFilms = movie?.recommendations || [];

    const scrollCast = (direction) => {
        if (!castRef.current) return;
        const card = castRef.current.querySelector('.movie_cast_item');
        if (!card) return;
        const cardWidth = card.offsetWidth;
        const gap = 20;
        const scrollAmount = cardWidth + gap;
        castRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    const scrollReviews = (direction) => {
        if (!reviewsRef.current) return;
        const card = reviewsRef.current.querySelector('.movie_review_item');
        if (!card) return;
        const cardWidth = card.offsetWidth;
        const gap = 20;
        const scrollAmount = cardWidth + gap;
        reviewsRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    const handleToggleReview = (review) => {
        setSelectedReview(review);
    };

    const handleCloseReviewModal = () => {
        setSelectedReview(null);
    };

    const scrollAlsoWatch = (direction) => {
        if (!alsoWatchRef.current) return;
        const card = alsoWatchRef.current.querySelector('.movie_also_watch_item');
        if (!card) return;
        const cardWidth = card.offsetWidth;
        const gap = 30;
        const scrollAmount = cardWidth + gap;
        alsoWatchRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    return (
        <div className="movie_page">
            <div className="movie_page_poster" style={movie.backgroundUrl ? { backgroundImage: `url(${movie.backgroundUrl})` } : {}}>
                <img src={movie.posterUrl || 'https://via.placeholder.com/1920x1080?text=No+Poster'} alt={movie.title} className="movie_poster" />
                {movie.logoUrl && (
                    <img src={movie.logoUrl} alt={movie.title} className="movie_logo" style={{ position: 'absolute', top: '20px', left: '20px', maxHeight: '100px' }} />
                )}
                <div className="movie_poster_content">
                    <div className="movie_postername">{movie.title}</div>
                    <div className="movie_poster_description">
                        <div className="movie_poster_rate_line">
                            {movie.rating && <div className="movie_poster_rating">{movie.rating}</div>}
                            {releaseYear && <div className="movie_poster_date">{releaseYear}</div>}
                            {releaseYear && genres && <div className="movie_poster_end">•</div>}
                            {genres && <div className="movie_poster_genre">{genres}</div>}
                        </div>
                        {movie.directorsText && (
                            <div className="movie_poster_directors">{movie.directorsText}</div>
                        )}
                        {movie.actorsText && (
                            <div className="movie_poster_actors">{movie.actorsText}</div>
                        )}
                        <div className="movie_poster_details">
                            {movie.shortDescription && (
                                <div className="movie_details_line">{movie.shortDescription}</div>
                            )}
                        </div>
                        <div className="movie_poster_info">
                            {movie.duration && (
                                <div className="movie_poster_seasons">{movie.duration}</div>
                            )}
                        </div>
                        <div className="movie_submit">
                            <div className="movie_submit_price">{movie.subscriptionPrice}</div>
                            <div className="movie_submit_subtitle">{movie.subscriptionLabel}</div>
                        </div>
                    </div>

                    <div className="movie_poster_watch">
                        <button
                            className="movie_watch_button"
                            onClick={handleWatchClick}
                            style={{ opacity: videoUrl ? 1 : 0.6, cursor: videoUrl ? 'pointer' : 'not-allowed' }}
                        >
                        </button>

                        {movie.trailerUrl && (
                            <button 
                                className="movie_trailer_button" 
                                onClick={() => {
                                    window.open(movie.trailerUrl, '_blank');
                                }}
                            ></button>
                        )}
                        {!movie.hasPremium && (
                            <button 
                                className="movie_buy_premium_button"
                                onClick={() => {
                                    window.location.href = '/premium';
                                }}
                            >
                            </button>
                        )}
                        <div 
                            className={`movie_save_button ${movie && (movie.isSaved || isFavorite(movie.id)) ? "active" : ""}`}
                            onClick={async () => {
                                if (movie && movie.id) {
                                    await toggleFavorite(movie.id);
                                }
                            }}
                            style={{ cursor: 'pointer' }}
                        ></div>
                    </div>
                </div>
            </div>

            {isPlayerOpen && movie && (
                <PlayerOverlay
                    open={isPlayerOpen}
                    onClose={() => setIsPlayerOpen(false)}
                    titleId={movie.id}
                    episodeId={null}
                />
            )}

            <div className="movie_description_block">
                <div className="movie_description_title">{movie.fullDescriptionTitle || ''}</div>
                <div className="movie_description_title_line"></div>
            </div>
            <div className="movie_overview">
                {movie.fullDescription && (
                    <div className="movie_description_block_expand">
                        <p className={`movie_description_text ${expanded ? "open" : ""}`}>
                            {movie.fullDescription}
                        </p>
                        <div className="movie_description_block_toggle" onClick={() => setExpanded(!expanded)}>
                        </div>
                    </div>
                )}
                <div className="movie_mark_block">
                    <div className="movie_mark_block_header">
                        <div className="movie_mark_block_text"></div>
                        {userRating > 0 && (
                            <button 
                                className="movie_mark_block_delete"
                                onClick={() => setUserRating(0)}
                            >
                            </button>
                        )}
                    </div>
                    <div className="movie_mark_block_subtext"></div>
                    <div className="movie_marks">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                            <button
                                key={star}
                                className={`movie_star ${userRating >= star ? 'active' : ''} ${hoveredRating >= star ? 'hovered' : ''}`}
                                onClick={() => setUserRating(star)}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                aria-label={`Rate ${star}`}
                            >
                                <span className="movie_star_number">{star}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {castAndCrew.length > 0 && (
                <div className="movie_cast_block">
                    <div className="movie_cast_title"></div>
                    <div className={`movie_cast_scroll_btn left ${!castScrollState.isScrollable || castScrollState.isAtStart ? 'hidden' : ''}`} onClick={() => scrollCast('left')}></div>
                    <div className={`movie_cast_scroll_btn right ${!castScrollState.isScrollable || castScrollState.isAtEnd ? 'hidden' : ''}`} onClick={() => scrollCast('right')}></div>
                    <div 
                        className="movie_cast_list_wrapper" 
                        ref={castRef}
                        onScroll={handleCastScroll}
                    >
                        <div className="movie_cast_list">
                            {castAndCrew.map((person) => (
                                <div key={person.id} className="movie_cast_item">
                                    <div className="movie_cast_avatar">
                                        <img src={person.image} alt={person.name} />
                                    </div>
                                    <div className="movie_cast_name">{person.name}</div>
                                    <div className="movie_cast_role">{person.role}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="movie_reviews_block">
                <div className="movie_reviews_title"></div>
                <div className={`movie_reviews_scroll_btn left ${!reviewsScrollState.isScrollable || reviewsScrollState.isAtStart ? 'hidden' : ''}`} onClick={() => scrollReviews('left')}></div>
                <div className={`movie_reviews_scroll_btn right ${!reviewsScrollState.isScrollable || reviewsScrollState.isAtEnd ? 'hidden' : ''}`} onClick={() => scrollReviews('right')}></div>
                <div 
                    className="movie_reviews_list_wrapper" 
                    ref={reviewsRef}
                    onScroll={handleReviewsScroll}
                >
                    <div className="movie_reviews_list">
                        {reviews.map((review) => (
                            <div key={review.id} className="movie_review_item">
                                <div className="movie_review_card">
                                    <div className="movie_review_top">
                                        <div className="movie_review_left">
                                            <div className="movie_review_avatar"></div>
                                            <div className="movie_review_info">
                                                <div className="movie_review_author">{review.author}</div>
                                                <div className="movie_review_date">{review.date}</div>
                                            </div>
                                        </div>
                                        <div className="movie_review_rating">{review.rating}</div>
                                    </div>
                                    {review.title && <div className="movie_review_title">{review.title}</div>}
                                    <div className="movie_review_text">{review.text}</div>
                                    {review.fullText && review.fullText !== review.text && (
                                        <button 
                                            className="movie_review_read_more"
                                            onClick={() => handleToggleReview(review)}
                                        >
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <button className="movie_reviews_button" onClick={onCommentModalClick}></button>
            </div>

            {selectedReview && (
                <div className="movie_review_modal_overlay" onClick={handleCloseReviewModal}>
                    <div className="movie_review_modal" onClick={(e) => e.stopPropagation()}>
                        <button className="movie_review_modal_close" onClick={handleCloseReviewModal}>
                            <span className="movie_review_modal_close_icon"></span>
                        </button>
                        <div className="movie_review_modal_header">
                            <div className="movie_review_modal_left">
                                <div className="movie_review_modal_avatar"></div>
                                <div className="movie_review_modal_info">
                                    <div className="movie_review_modal_author">{selectedReview.author}</div>
                                    <div className="movie_review_modal_date">{selectedReview.date}</div>
                                </div>
                            </div>
                            <div className="movie_review_modal_rating">{selectedReview.rating}</div>
                        </div>
                        {selectedReview.title && <div className="movie_review_modal_title">{selectedReview.title}</div>}
                        <div className="movie_review_modal_text">{selectedReview.fullText || selectedReview.text}</div>
                    </div>
                </div>
            )}

            {alsoWatchFilms.length > 0 && (
                <div className="movie_also_watch_block">
                    <div className="movie_also_watch_header">
                        <div className="movie_also_watch_title"></div>
                        <div className="movie_also_watch_arrow"></div>
                    </div>
                    <div className={`movie_also_watch_scroll_btn left ${!alsoWatchScrollState.isScrollable || alsoWatchScrollState.isAtStart ? 'hidden' : ''}`} onClick={() => scrollAlsoWatch('left')}></div>
                    <div className={`movie_also_watch_scroll_btn right ${!alsoWatchScrollState.isScrollable || alsoWatchScrollState.isAtEnd ? 'hidden' : ''}`} onClick={() => scrollAlsoWatch('right')}></div>
                    <div 
                        className="movie_also_watch_wrapper" 
                        ref={alsoWatchRef}
                        onScroll={handleAlsoWatchScroll}
                    >
                        <div className="movie_also_watch_list">
                            {alsoWatchFilms.map((film) => (
                                <div 
                                    key={film.id} 
                                    className="movie_also_watch_item"
                                    onMouseEnter={() => setSelectedItemId(film.id)} 
                                    onMouseLeave={() => setSelectedItemId(null)}
                                >
                                    <img 
                                        src={film.posterUrl || 'https://via.placeholder.com/300x450'} 
                                        alt={film.title} 
                                        className="movie_also_watch_img"
                                    />
                                    <div className="movie_also_watch_text">
                                        {film.rating && film.rating > 0 && (
                                            <div className="movie_also_watch_rating">{typeof film.rating === 'number' ? film.rating.toFixed(1) : film.rating}</div>
                                        )}
                                        <div className="movie_also_watch_line">
                                            <div className="movie_also_watch_line1">
                                                {film.title}
                                                {film.type && <span> • {film.type}</span>}
                                                {film.genres && film.genres.length > 0 && <span> • {film.genres.join(', ')}</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};