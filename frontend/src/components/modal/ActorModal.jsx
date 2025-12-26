import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import { getPersonData } from '../../services/api';
import './ActorModal.css';

export const ActorModal = ({ actor, onClose }) => {
    const { isFavorite, toggleFavorite } = useFavorites();
    const modalRef = useRef(null);
    const [personData, setPersonData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const categoryRef = useRef(null);
    const sortRef = useRef(null);

    useEffect(() => {
        const loadPersonData = async () => {
            if (!actor || !actor.id) return;

            try {
                setLoading(true);
                const data = await getPersonData(actor.id);
                setPersonData(data);
                if (data.ui) {
                    setCategory(data.ui.genreLabel || '');
                    setSortBy(data.ui.sortLabel || '');
                }
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };

        loadPersonData();
    }, [actor]);

    useEffect(() => {
        if (!actor) return;

        const handleClickOutside = (event) => {
            if (categoryRef.current && !categoryRef.current.contains(event.target)) {
                setIsCategoryOpen(false);
            }
            if (sortRef.current && !sortRef.current.contains(event.target)) {
                setIsSortOpen(false);
            }
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = '';
        };
    }, [actor, onClose]);

    const formatDate = (dateString) => {
        if (!dateString) return null;
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('uk-UA', { year: 'numeric', month: '2-digit', day: '2-digit' });
        } catch {
            return dateString;
        }
    };

    const getFilteredFilmography = () => {
        if (!personData || !personData.filmography) return [];
        
        let filtered = [...personData.filmography];
        
        if (category && category !== personData.ui?.genreLabel && category !== '') {
            filtered = filtered.filter(film => film.genres && film.genres.length > 0 && film.genres.some(g => g === category));
        }
        
        if (sortBy === 'rating') {
            filtered.sort((a, b) => {
                if (a.rating && b.rating) {
                    return b.rating - a.rating;
                }
                return 0;
            });
        } else {
            filtered.sort((a, b) => {
                if (a.releaseDate && b.releaseDate) {
                    return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
                }
                return 0;
            });
        }
        
        return filtered;
    };

    const films = getFilteredFilmography();

    if (!actor) return null;

    if (loading) {
        return (
            <div className="actor_overlay" role="dialog" aria-modal="true">
                <div className="actor_modal" ref={modalRef}>
                    <div className="actor_close_icon" onClick={onClose}></div>
                    <p></p>
                </div>
            </div>
        );
    }

    if (!personData) return null;

    return (
        <div className="actor_overlay" role="dialog" aria-modal="true">
            <div className="actor_modal" ref={modalRef}>
                <div className="actor_close_icon" onClick={onClose}></div>
                <div className="actor_block">
                    <div className="actor_info_block">
                        {personData.photoUrl ? (
                            <img 
                                src={personData.photoUrl} 
                                alt={personData.name}
                                className="actor_info_avatar"
                                style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                            />
                        ) : (
                            <div className="actor_info_avatar"></div>
                        )}
                        <div className="actor_info_name">{personData.name}</div>
                        {personData.activityType && (
                            <div className="actor_info_name_en">{personData.activityType}</div>
                        )}
                        
                        <div className="actor_info_divider"></div>
                        
                        {personData.age !== null && personData.age !== undefined && (
                            <>
                                <div className="actor_info_item">
                                    <div className="actor_info_label">{personData.ui?.ageLabel || ''}</div>
                                    <div className="actor_info_value">{personData.age} {personData.ui?.ageUnit || ''}</div>
                                </div>
                                <div className="actor_info_divider"></div>
                            </>
                        )}
                        
                        {personData.birthDate && (
                            <>
                                <div className="actor_info_item">
                                    <div className="actor_info_label">{personData.ui?.birthDateLabel || ''}</div>
                                    <div className="actor_info_value">{formatDate(personData.birthDate)}</div>
                                </div>
                                <div className="actor_info_divider"></div>
                            </>
                        )}
                        
                        {personData.gender && (
                            <>
                                <div className="actor_info_item">
                                    <div className="actor_info_label">{personData.ui?.genderLabel || ''}</div>
                                    <div className="actor_info_value">
                                        {personData.gender === 'MALE' ? (personData.ui?.genderMale || '') : 
                                         personData.gender === 'FEMALE' ? (personData.ui?.genderFemale || '') : 
                                         personData.gender}
                                    </div>
                                </div>
                                <div className="actor_info_divider"></div>
                            </>
                        )}
                        
                        {personData.relatives && personData.relatives.length > 0 && (
                            <>
                                <div className="actor_info_item">
                                    <div className="actor_info_label">{personData.ui?.relativesLabel || ''}</div>
                                    <div className="actor_info_value actor_info_relatives">
                                        {personData.relatives.map((rel) => (
                                            <div key={rel.id}>
                                                <Link to={`/actor/${rel.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    {rel.name} ({rel.relationship})
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="actor_info_divider"></div>
                            </>
                        )}
                        
                        {personData.birthPlace && (
                            <>
                                <div className="actor_info_item">
                                    <div className="actor_info_label">{personData.ui?.birthPlaceLabel || ''}</div>
                                    <div className="actor_info_value">{personData.birthPlace}</div>
                                </div>
                                <div className="actor_info_divider"></div>
                            </>
                        )}
                    </div>
                    <div className="actor_film_block">
                        <div className="actor_film_title">{personData.ui?.filmographyTitle || ''}</div>
                        <div className="actor_film_togle">
                            <div className="actor_filter_group">
                                {personData.ui?.genreLabel && (
                                    <div className="actor_filter_dropdown" ref={categoryRef}>
                                        <button 
                                            className={`actor_filter_button ${isCategoryOpen ? 'open' : ''}`}
                                            onClick={() => {
                                                setIsCategoryOpen(!isCategoryOpen);
                                                setIsSortOpen(false);
                                            }}
                                        >
                                            {category || personData.ui.genreLabel}
                                            <span className={`actor_filter_arrow ${isCategoryOpen ? 'open' : ''}`}></span>
                                        </button>
                                        {isCategoryOpen && (
                                            <div className="actor_filter_menu">
                                                <button 
                                                    className={category === '' ? 'selected' : ''} 
                                                    onClick={() => { 
                                                        setCategory(''); 
                                                        setIsCategoryOpen(false); 
                                                    }}
                                                >
                                                    Всі
                                                </button>
                                                {personData.filmography && Array.from(new Set(personData.filmography.flatMap(f => f.genres || []))).map((genre) => (
                                                    <button 
                                                        key={genre} 
                                                        className={category === genre ? 'selected' : ''} 
                                                        onClick={() => { 
                                                            setCategory(genre); 
                                                            setIsCategoryOpen(false); 
                                                        }}
                                                    >
                                                        {genre}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {personData.ui?.sortLabel && (
                                    <div className="actor_filter_dropdown" ref={sortRef}>
                                        <button 
                                            className={`actor_filter_button ${isSortOpen ? 'open' : ''}`}
                                            onClick={() => {
                                                setIsSortOpen(!isSortOpen);
                                                setIsCategoryOpen(false);
                                            }}
                                        >
                                            {sortBy || personData.ui.sortLabel}
                                            <span className={`actor_filter_arrow ${isSortOpen ? 'open' : ''}`}></span>
                                        </button>
                                        {isSortOpen && (
                                            <div className="actor_filter_menu">
                                                <button 
                                                    className={sortBy === '' ? 'selected' : ''} 
                                                    onClick={() => { 
                                                        setSortBy(''); 
                                                        setIsSortOpen(false); 
                                                    }}
                                                >
                                                </button>
                                                <button 
                                                    className={sortBy === 'rating' ? 'selected' : ''} 
                                                    onClick={() => { 
                                                        setSortBy('rating'); 
                                                        setIsSortOpen(false); 
                                                    }}
                                                >
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="actor_block_films">
                            {films.length > 0 ? (
                                films.map((film) => (
                                    <div
                                        key={film.id}
                                        className="actor_film-card"
                                        onMouseEnter={() => setSelectedItemId(film.id)}
                                        onMouseLeave={() => setSelectedItemId(null)}
                                    >
                                        <Link 
                                            to={`/movie/${film.id}`}
                                            className="actor_film-card-link"
                                        >
                                            {film.posterUrl && (
                                                <img 
                                                    src={film.posterUrl} 
                                                    alt={film.title} 
                                                    className="actor_film-poster" 
                                                />
                                            )}
                                            
                                            <div className="actor_film-card-header">
                                                <div
                                                    className={`actor_film-card-save actor_film-action ${
                                                        isFavorite(film.id) ? 'active' : ''
                                                    }`}
                                                    onClick={async (e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        await toggleFavorite(film.id);
                                                    }}
                                                />
                                                <div
                                                    className="actor_film-card-repost actor_film-action"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                    }}
                                                />
                                            </div>

                                            <div className="actor_film-card-place">
                                                <div className="actor_film-card-play"></div>
                                            </div>

                                            <div className="actor_film-card-text">
                                                {film.rating && film.rating > 0 && (
                                                    <div className="actor_film-card-rating">{film.rating.toFixed(1)}</div>
                                                )}
                                                {film.releaseDate && (
                                                    <div className="actor_film-card-line">
                                                        <div className="actor_film-card-line1">
                                                            <span className="actor_film-card-date">
                                                                {new Date(film.releaseDate).getFullYear()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                        <div className="actor_film-title">
                                            {film.title}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ color: '#F8F8FE', padding: '20px' }}></div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
