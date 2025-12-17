import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import './SearchMovie.css';

const mockMovies = [
    { id: 1, name: 'ДЕДПУЛ РОСОМАХА', image: 'https://via.placeholder.com/200x300?text=Deadpool+Wolverine' },
    { id: 2, name: 'Барбі', image: 'https://via.placeholder.com/200x300?text=Barbie' },
    { id: 3, name: 'ВОВК З ВОЛЛ СТРІТ', image: 'https://via.placeholder.com/200x300?text=Wolf+of+Wall+Street' },
    { id: 4, name: 'WICKED ЧАРОДІЙКА', image: 'https://via.placeholder.com/200x300?text=Wicked' },
    { id: 5, name: 'СМЕРТЬ ЕДИНОРОГА', image: 'https://via.placeholder.com/200x300?text=Death+of+Unicorn' },
    { id: 6, name: 'ВОЛОДАР ПЕРСНІВ', image: 'https://via.placeholder.com/200x300?text=LOTR' },
    { id: 7, name: 'Гаррі Поттер ФІЛОСОФСЬКИЙ КАМІНЬ', image: 'https://via.placeholder.com/200x300?text=Harry+Potter' },
    { id: 8, name: 'ДЖЕРЕЛО ВІЧНОЇ МОЛОДОСТІ', image: 'https://via.placeholder.com/200x300?text=Source+of+Youth' },
    { id: 9, name: 'ХОББІТ', image: 'https://via.placeholder.com/200x300?text=Hobbit' },
    { id: 10, name: 'Без Образ', image: 'https://via.placeholder.com/200x300?text=No+Hard+Feelings' },
];

export const SearchMovie = ({ isOpen, onClose, onSelectMovies }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const modalRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMovies, setSelectedMovies] = useState([]);
    const [movies] = useState(mockMovies);

    useEffect(() => {
        if (!isOpen) return;

        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const filteredMovies = movies.filter(movie =>
        movie.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="search_movie_overlay" role="dialog" aria-modal="true" onClick={handleOverlayClick} onMouseDown={(e) => e.stopPropagation()}>
            <div className="search_movie_modal" ref={modalRef} onClick={handleModalClick} onMouseDown={(e) => e.stopPropagation()}>
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
                                    navigate('/admin/movie/new');
                                    if (onClose) {
                                        onClose();
                                    }
                                }}
                            >
                                <button 
                                    className="search_movie_add_button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate('/admin/movie/new');
                                        if (onClose) {
                                            onClose();
                                        }
                                    }}
                                >
                                    <span className="search_movie_add_icon"></span>
                                    <Trans i18nKey="admin.searchMovie.addMovie" />
                                </button>
                            </div>
                        )}
                        {filteredMovies.length === 0 && searchQuery && (
                            <div className="search_movie_empty_state">
                                <div className="search_movie_empty_icon"></div>
                                <div className="search_movie_empty_title"><Trans i18nKey="admin.searchMovie.emptyStateTitle" /></div>
                                <div className="search_movie_empty_message">
                                    <Trans i18nKey="admin.searchMovie.emptyStateMessage" />
                                </div>
                            </div>
                        )}
                        {filteredMovies.map((movie) => (
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
                                <img src={movie.image} alt={movie.name} />
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

