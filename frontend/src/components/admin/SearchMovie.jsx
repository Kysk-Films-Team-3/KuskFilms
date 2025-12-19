import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { api } from '../../services/api';
import './SearchMovie.css';

export const SearchMovie = ({ isOpen, onClose, onSelectMovies }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const modalRef = useRef(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMovies, setSelectedMovies] = useState([]);
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        if (!isOpen) return;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const fetchMovies = async () => {
            try {
                const url = searchQuery
                    ? `/public/titles?search=${searchQuery}&size=20`
                    : `/public/titles?size=20`;

                const response = await api.get(url);
                const data = response.data.content || response.data;

                const mappedMovies = data.map(movie => ({
                    id: movie.id,
                    name: movie.title,
                    image: movie.posterUrl
                        ? (movie.posterUrl.startsWith('http') ? movie.posterUrl : `/kyskfilms/${movie.posterUrl}`)
                        : 'https://via.placeholder.com/200x300?text=No+Poster'
                }));

                setMovies(mappedMovies);
            } catch (error) {
            }
        };

        const timeoutId = setTimeout(() => {
            fetchMovies();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [isOpen, searchQuery]);

    const handleMovieClick = (movieId) => {
        setSelectedMovies(prev => {
            if (prev.includes(movieId)) {
                return prev.filter(id => id !== movieId);
            } else {
                return [...prev, movieId];
            }
        });
    };

    const handleSave = () => {
        const selected = movies.filter(movie => selectedMovies.includes(movie.id));
        if (onSelectMovies && selected.length > 0) {
            onSelectMovies(selected);
        }
        onClose();
    };

    const handleDelete = () => {
        setSelectedMovies([]);
    };

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = 'https://via.placeholder.com/200x300?text=No+Poster';
    };

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="search_movie_overlay" role="dialog" aria-modal="true" onClick={handleOverlayClick} onMouseDown={(e) => e.stopPropagation()}>
            <div className="search_movie_modal" ref={modalRef} onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
                <div className="search_movie_close" onClick={onClose}></div>

                <div className="search_movie_header">
                    <div className="search_movie_title"><Trans i18nKey="admin.searchMovie.title" /></div>
                </div>

                <div className="search_movie_content">
                    <div className="search_movie_search">
                        <div className="search_movie_search_icon"></div>
                        <input
                            type="text"
                            className="search_movie_search_input"
                            placeholder={t('admin.searchMovie.placeholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="search_movie_grid">
                        {!searchQuery && (
                            <div
                                className="search_movie_placeholder"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (onClose) onClose();
                                    navigate('/admin/movie/new');
                                }}
                            >
                                <button
                                    className="search_movie_add_button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (onClose) onClose();
                                        navigate('/admin/movie/new');
                                    }}
                                >
                                    <span className="search_movie_add_icon"></span>
                                    <Trans i18nKey="admin.searchMovie.addMovie" />
                                </button>
                            </div>
                        )}

                        {movies.length === 0 && searchQuery && (
                            <div className="search_movie_empty_state">
                                <div className="search_movie_empty_icon"></div>
                                <div className="search_movie_empty_title"><Trans i18nKey="admin.searchMovie.emptyStateTitle" /></div>
                                <div className="search_movie_empty_message">
                                    <Trans i18nKey="admin.searchMovie.emptyStateMessage" />
                                </div>
                            </div>
                        )}

                        {movies.map((movie) => (
                            <div
                                key={movie.id}
                                className={`search_movie_poster ${selectedMovies.includes(movie.id) ? 'selected' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleMovieClick(movie.id);
                                }}
                            >
                                {selectedMovies.includes(movie.id) && (
                                    <div className="search_movie_checkmark selected"></div>
                                )}
                                <img
                                    src={movie.image}
                                    alt={movie.name}
                                    onError={handleImageError}
                                />
                                <div className="search_movie_title_overlay">{movie.name}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="search_movie_footer">
                    {selectedMovies.length > 0 && (
                        <button className="search_movie_delete_button" onClick={handleDelete}>
                            <span className="search_movie_delete_icon"></span>
                            <Trans i18nKey="admin.searchMovie.delete" />
                        </button>
                    )}
                    <button className="search_movie_save_button" onClick={handleSave}>
                        <span className="search_movie_save_icon"></span>
                        <Trans i18nKey="admin.searchMovie.save" />
                    </button>
                </div>
            </div>
        </div>
    );
};