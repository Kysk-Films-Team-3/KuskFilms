import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import PlayerOverlay from "../components/player/PlayerOverlay";
import { fetchTitleById } from "../services/api";
import "./MoviePage.css";

export const MoviePage = ({ onCommentModalClick }) => {
    const { id } = useParams();
    const { t } = useTranslation();
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
                setError(t("moviePage.errorId"));
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const data = await fetchTitleById(id);
                setMovie(data);
            } catch (err) {
                console.error("Помилка завантаження фільму:", err);
                setError(t("moviePage.errorLoad"));
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

    if (loading) {
        return (
            <div className="movie_page" style={{ padding: '100px 20px', textAlign: 'center' }}>
                <p><Trans i18nKey="moviePage.loading" /></p>
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div className="movie_page" style={{ padding: '100px 20px', textAlign: 'center' }}>
                <p style={{ color: 'red' }}>{error || <Trans i18nKey="moviePage.notFound" />}</p>
            </div>
        );
    }

    const videoUrl = movie.streamUrl;

    const releaseYear = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null;
    const genres = movie.genres && movie.genres.length > 0 ? movie.genres.join(", ") : null;

    const handleWatchClick = () => {
        if (videoUrl) {
            setIsPlayerOpen(true);
        } else {
            alert(t("moviePage.videoProcessing"));
        }
    };

    const castAndCrew = movie?.actors?.map(actor => ({
        id: actor.id,
        name: actor.name,
        role: actor.role || 'Актор',
        image: actor.image || 'https://via.placeholder.com/150'
    })) || [];

    const reviews = movie?.reviews || [];

    const alsoWatchFilms = [];

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
            <div className="movie_page_poster">
                <img src={movie.posterUrl || 'https://via.placeholder.com/1920x1080?text=No+Poster'} alt={movie.title} className="movie_poster" />
                <div className="movie_poster_content">
                    <div className="movie_postername">{movie.title}</div>
                    <div className="movie_poster_description">
                        <div className="movie_poster_rate_line">
                            {movie.rating && <div className="movie_poster_rating">{movie.rating}</div>}
                            {releaseYear && <div className="movie_poster_date">{releaseYear}</div>}
                            {releaseYear && genres && <div className="movie_poster_end">•</div>}
                            {genres && <div className="movie_poster_genre">{genres}</div>}
                        </div>
                        <div className="movie_poster_details">
                            {movie.description && (
                                <div className="movie_details_line">{movie.description.split('\n')[0]}</div>
                            )}
                        </div>
                        <div className="movie_poster_info">
                            {movie.seasons && movie.seasons.length > 0 && (
                                <div className="movie_poster_seasons"><Trans i18nKey="moviePage.seasonsCount" /> {movie.seasons.length}</div>
                            )}
                        </div>
                        <div className="movie_submit">
                            <div className="movie_submit_price"><Trans i18nKey="moviePage.price" /></div>
                            <div className="movie_submit_subtitle"><Trans i18nKey="moviePage.inSubscription" /></div>
                        </div>
                    </div>

                    <div className="movie_poster_watch">
                        <button
                            className="movie_watch_button"
                            onClick={handleWatchClick}
                            style={{ opacity: videoUrl ? 1 : 0.6, cursor: videoUrl ? 'pointer' : 'not-allowed' }}
                        >
                            <Trans i18nKey="moviePage.watch" />
                        </button>

                        <button className="movie_trailer_button" onClick={() => alert(t("moviePage.trailerNotAvailable"))}><Trans i18nKey="moviePage.trailer" /></button>
                        <div className="movie_save_button"></div>
                    </div>
                </div>
            </div>

            {isPlayerOpen && videoUrl && (
                <PlayerOverlay
                    open={isPlayerOpen}
                    onClose={() => setIsPlayerOpen(false)}
                    hlsUrl={videoUrl}
                />
            )}

            <div className="movie_description_block">
                <div className="movie_description_title"><Trans i18nKey="moviePage.description" /></div>
                <div className="movie_description_title_line"></div>
            </div>
            <div className="movie_overview">
                {movie.description && (
                    <div className="movie_description_block_expand">
                        <p className={`movie_description_text ${expanded ? "open" : ""}`}>
                            {movie.description}
                        </p>
                        <div className="movie_description_block_toggle" onClick={() => setExpanded(!expanded)}>
                            {expanded ? <Trans i18nKey="moviePage.collapse" /> : <Trans i18nKey="moviePage.expand" />}
                        </div>
                    </div>
                )}
                <div className="movie_mark_block">
                    <div className="movie_mark_block_header">
                        <div className="movie_mark_block_text"><Trans i18nKey="moviePage.rate" /></div>
                        {userRating > 0 && (
                            <button 
                                className="movie_mark_block_delete"
                                onClick={() => setUserRating(0)}
                            >
                                <Trans i18nKey="moviePage.delete" />
                            </button>
                        )}
                    </div>
                    <div className="movie_mark_block_subtext"><Trans i18nKey="moviePage.rateSubtext" /></div>
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
                    <div className="movie_cast_title"><Trans i18nKey="moviePage.castAndCrew" /></div>
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
                <div className="movie_reviews_title"><Trans i18nKey="moviePage.reviews" /></div>
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
                                    <div className="movie_review_title">{review.title}</div>
                                    <div className="movie_review_text">{review.text}</div>
                                    {review.fullText && review.fullText !== review.text && (
                                        <button 
                                            className="movie_review_read_more"
                                            onClick={() => handleToggleReview(review)}
                                        >
                                            <Trans i18nKey="moviePage.readFull" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <button className="movie_reviews_button" onClick={onCommentModalClick}><Trans i18nKey="moviePage.writeComment" /></button>
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
                        <div className="movie_review_modal_title">{selectedReview.title}</div>
                        <div className="movie_review_modal_text">{selectedReview.fullText || selectedReview.text}</div>
                    </div>
                </div>
            )}

            {alsoWatchFilms.length > 0 && (
                <div className="movie_also_watch_block">
                    <div className="movie_also_watch_header">
                        <div className="movie_also_watch_title"><Trans i18nKey="moviePage.alsoWatch" /></div>
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
                                        src={selectedItemId === film.id ? film.hoverImage : film.image} 
                                        alt={`Film ${film.id}`} 
                                        className="movie_also_watch_img"
                                    />
                                    <div className="movie_also_watch_text">
                                        {film.rating > 0 && (
                                            <div className="movie_also_watch_rating">{film.rating.toFixed(1)}</div>
                                        )}
                                        <div className="movie_also_watch_line">
                                            <div className="movie_also_watch_line1">
                                                {film.linedate && <span className="movie_also_watch_date">{film.linedate}</span>}
                                                {film.line1 && ` ${film.line1}`}
                                            </div>
                                            {film.line2 && <div className="movie_also_watch_line2">{film.line2}</div>}
                                        </div>
                                        {film.season && <div className="movie_also_watch_season">{film.season}</div>}
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