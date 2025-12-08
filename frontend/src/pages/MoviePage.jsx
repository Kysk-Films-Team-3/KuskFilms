import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PlayerOverlay from "../components/player/PlayerOverlay";
import { fetchTitleById } from "../services/api";
import "./MoviePage.css";

export const MoviePage = ({ onCommentModalClick }) => {
    const { id } = useParams();
    const [isPlayerOpen, setIsPlayerOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadMovie = async () => {
            if (!id) {
                setError("ID фільму не вказано");
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
                setError("Не вдалось завантажити інформацію про фільм");
            } finally {
                setLoading(false);
            }
        };

        loadMovie();
    }, [id]);

    if (loading) {
        return (
            <div className="movie_page" style={{ padding: '100px 20px', textAlign: 'center' }}>
                <p>Завантаження...</p>
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div className="movie_page" style={{ padding: '100px 20px', textAlign: 'center' }}>
                <p style={{ color: 'red' }}>{error || "Фільм не знайдено"}</p>
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
            alert("Відео ще обробляється або недоступне.");
        }
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
                                <div className="movie_poster_seasons">Сезонів: {movie.seasons.length}</div>
                            )}
                        </div>
                        <div className="movie_submit">
                            <div className="movie_submit_price">15€/місяць</div>
                            <div className="movie_submit_subtitle">у підписці Kysk</div>
                        </div>
                    </div>

                    <div className="movie_poster_watch">
                        <button
                            className="movie_watch_button"
                            onClick={handleWatchClick}
                            style={{ opacity: videoUrl ? 1 : 0.6, cursor: videoUrl ? 'pointer' : 'not-allowed' }}
                        >
                            Дивитися
                        </button>

                        <button className="movie_trailer_button" onClick={() => alert("Трейлер пока не доступен")}>Трейлер</button>
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
                <div className="movie_description_title">Опис</div>
                <div className="movie_description_title_line"></div>
            </div>
            <div className="movie_overview">
                {movie.description && (
                    <div className="movie_description_block_expand">
                        <p className={`movie_description_text ${expanded ? "open" : ""}`}>
                            {movie.description}
                        </p>
                        <div className="movie_description_block_toggle" onClick={() => setExpanded(!expanded)}>
                            {expanded ? "Згорнути" : "Детальний опис"}
                        </div>
                    </div>
                )}
                <div className="movie_mark_block">
                    <div className="movie_mark_block_text">Поставте оцінку</div>
                    <div className="movie_mark_block_subtext">Оцінки покращують ваші рекомендації</div>
                    <div className="movie_marks"></div>
                </div>
            </div>

            {movie.seasons && movie.seasons.length > 0 && (
                <div className="movie_seasons_block">
                    <div className="movie_seasons_title">Сезони</div>
                    {movie.seasons.map((season) => (
                        <div key={season.id} className="movie_season_item">
                            <div className="movie_season_name">Сезон {season.seasonNumber}{season.title ? `: ${season.title}` : ''}</div>
                            {season.episodes && season.episodes.length > 0 && (
                                <div className="movie_season_episodes">Епізодів: {season.episodes.length}</div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="movie_reviews_block">
                <div className="movie_reviews_title">Відгуки</div>
                <button className="movie_reviews_button" onClick={onCommentModalClick}>Написати коментар</button>
            </div>
        </div>
    );
};