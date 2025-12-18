import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { api } from '../../services/api'; // Импорт API
import './SearchMovie.css';

export const SearchMovie = ({ isOpen, onClose, onSelectMovies }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const modalRef = useRef(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMovies, setSelectedMovies] = useState([]); // Храним ID выбранных фильмов
    const [movies, setMovies] = useState([]); // Список фильмов с бэкенда

    // Блокировка прокрутки
    useEffect(() => {
        if (!isOpen) return;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Загрузка фильмов с API
    useEffect(() => {
        if (!isOpen) return;

        const fetchMovies = async () => {
            try {
                // ИСПРАВЛЕНО: Убран лишний /api, так как он есть в baseURL axios
                const url = searchQuery
                    ? `/public/titles?search=${searchQuery}&size=20`
                    : `/public/titles?size=20`;

                const response = await api.get(url);
                const data = response.data.content || response.data;

                // Маппинг данных
                const mappedMovies = data.map(movie => ({
                    id: movie.id,
                    name: movie.title,
                    // Обработка пути к картинке для Nginx/MinIO
                    image: movie.posterUrl
                        ? (movie.posterUrl.startsWith('http') ? movie.posterUrl : `/kyskfilms/${movie.posterUrl}`)
                        : 'https://via.placeholder.com/200x300?text=No+Poster'
                }));

                setMovies(mappedMovies);
            } catch (error) {
                console.error("Помилка завантаження фільмів:", error);
            }
        };

        // Debounce для поиска (задержка 300мс)
        const timeoutId = setTimeout(() => {
            fetchMovies();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [isOpen, searchQuery]);

    // Обработчик клика по фильму
    const handleMovieClick = (movieId) => {
        setSelectedMovies(prev => {
            if (prev.includes(movieId)) {
                return prev.filter(id => id !== movieId);
            } else {
                return [...prev, movieId];
            }
        });
    };

    // Сохранение выбора
    const handleSave = () => {
        // Находим полные объекты фильмов по выбранным ID
        const selected = movies.filter(movie => selectedMovies.includes(movie.id));
        if (onSelectMovies && selected.length > 0) {
            onSelectMovies(selected);
        }
        onClose();
    };

    const handleDelete = () => {
        setSelectedMovies([]);
    };

    // Заглушка для картинок (если файл в MinIO удален)
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
                        {/* Кнопка добавления нового фильма */}
                        {!searchQuery && (
                            <div
                                className="search_movie_placeholder"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // Закрываем модалку и переходим на создание
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

                        {/* Пустое состояние */}
                        {movies.length === 0 && searchQuery && (
                            <div className="search_movie_empty_state">
                                <div className="search_movie_empty_icon"></div>
                                <div className="search_movie_empty_title"><Trans i18nKey="admin.searchMovie.emptyStateTitle" /></div>
                                <div className="search_movie_empty_message">
                                    <Trans i18nKey="admin.searchMovie.emptyStateMessage" />
                                </div>
                            </div>
                        )}

                        {/* Список фильмов */}
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