import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { useFavorites } from '../context/FavoritesContext';
import { fakeContent, fakeCategories } from '../services/api';
import './Films.css';

export const Films = () => {
    const { t } = useTranslation();
    const { favorites, toggleFavorite } = useFavorites();
    const [sortBy, setSortBy] = useState('За новизною');
    const [genre, setGenre] = useState(t('filmsPage.genre'));
    const [year, setYear] = useState(t('filmsPage.year'));
    const [ratingMin, setRatingMin] = useState(0);
    const [ratingMax, setRatingMax] = useState(10);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isGenreOpen, setIsGenreOpen] = useState(false);
    const [isYearOpen, setIsYearOpen] = useState(false);
    const [films, setFilms] = useState([]);
    const [allFilms, setAllFilms] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [hoveredThumb, setHoveredThumb] = useState(null);
    const sortRef = useRef(null);
    const genreRef = useRef(null);
    const yearRef = useRef(null);
    const sliderWrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortRef.current && !sortRef.current.contains(event.target)) {
                setIsSortOpen(false);
            }
            if (genreRef.current && !genreRef.current.contains(event.target)) {
                setIsGenreOpen(false);
            }
            if (yearRef.current && !yearRef.current.contains(event.target)) {
                setIsYearOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (sliderWrapperRef.current) {
            const minPercent = (ratingMin / 10) * 100;
            const maxPercent = (ratingMax / 10) * 100;
            sliderWrapperRef.current.style.setProperty('--min-percent', `${minPercent}%`);
            sliderWrapperRef.current.style.setProperty('--max-percent', `${maxPercent}%`);
        }
    }, [ratingMin, ratingMax]);

    const genres = [
        t('filmsPage.genres.action'),
        t('filmsPage.genres.drama'),
        t('filmsPage.genres.comedy'),
        t('filmsPage.genres.thriller'),
        t('filmsPage.genres.horror'),
        t('filmsPage.genres.fantasy'),
        t('filmsPage.genres.detective'),
        t('filmsPage.genres.romance')
    ];
    const years = Array.from({ length: 30 }, (_, i) => 2025 - i);

    useEffect(() => {
        const loadFilms = async () => {
            try {
                const categories = await fakeCategories();
                const categoryNames = categories.map(cat => cat.name);
                const content = await fakeContent(categoryNames);
                
                const extractedFilms = [];
                content.forEach(category => {
                    category.subcategories.forEach(sub => {
                        sub.films.forEach(film => {
                            extractedFilms.push({
                                id: film.id,
                                name: film.title || t('filmsPage.filmDefault', { id: film.id }),
                                image: film.image,
                                hoverImage: film.hoverImage || film.image,
                                rating: parseFloat(film.rating) || 0,
                                year: film.linedate ? parseInt(film.linedate.split('-')[0]) : null,
                                genre: film.line1 ? film.line1.split(' • ').filter(g => g && g !== 'USA' && g !== 'UK' && g !== 'South Korea' && g !== 'Південна Корея' && g !== 'Велика Британія' && g !== 'France' && g !== 'Latvia')[0] : null,
                                linedate: film.linedate,
                                line1: film.line1,
                                line2: film.line2,
                                season: film.season
                            });
                        });
                    });
                });
                
                const uniqueFilms = extractedFilms.filter((film, index, self) =>
                    index === self.findIndex(f => f.id === film.id)
                );
                
                const limitedFilms = uniqueFilms.slice(0, 25);
                
                setAllFilms(limitedFilms);
                setFilms(limitedFilms);
            } catch (error) {
                console.error('Помилка завантаження фільмів:', error);
            }
        };
        
        loadFilms();
    }, []);

    const handleReset = () => {
        setSortBy('За новизною');
        setGenre(t('filmsPage.genre'));
        setYear(t('filmsPage.year'));
        setRatingMin(0);
        setRatingMax(10);
    };

    return (
        <div className="films_page">
            <div className="films_container">
                <div className="films_header">
                    <h1 className="films_title"><Trans i18nKey="filmsPage.title" /></h1>
                    <p className="films_description">
                        <Trans i18nKey="filmsPage.description" />
                    </p>
                </div>

                <div className="films_filters">
                    <div className="films_filter_group">
                        <div className="films_filter_dropdown" ref={sortRef}>
                            <button 
                                className={`films_filter_button ${isSortOpen ? 'open' : ''}`}
                                onClick={() => {
                                    setIsSortOpen(!isSortOpen);
                                    setIsGenreOpen(false);
                                    setIsYearOpen(false);
                                }}
                            >
                                <Trans i18nKey={`filmsPage.sort.${sortBy === 'За новизною' ? 'newest' : sortBy === 'За популярністю' ? 'popular' : sortBy === 'За рейтингом' ? 'rating' : 'alphabet'}`} />
                                <span className={`films_filter_arrow ${isSortOpen ? 'open' : ''}`}></span>
                            </button>
                            {isSortOpen && (
                                <div className="films_filter_menu">
                                    <button className={sortBy === 'За новизною' ? 'selected' : ''} onClick={() => { setSortBy('За новизною'); setIsSortOpen(false); }}><Trans i18nKey="filmsPage.sort.newest" /></button>
                                    <button className={sortBy === 'За популярністю' ? 'selected' : ''} onClick={() => { setSortBy('За популярністю'); setIsSortOpen(false); }}><Trans i18nKey="filmsPage.sort.popular" /></button>
                                    <button className={sortBy === 'За рейтингом' ? 'selected' : ''} onClick={() => { setSortBy('За рейтингом'); setIsSortOpen(false); }}><Trans i18nKey="filmsPage.sort.rating" /></button>
                                    <button className={sortBy === 'За алфавітом' ? 'selected' : ''} onClick={() => { setSortBy('За алфавітом'); setIsSortOpen(false); }}><Trans i18nKey="filmsPage.sort.alphabet" /></button>
                                </div>
                            )}
                        </div>

                        <div className="films_filter_dropdown" ref={genreRef}>
                            <button 
                                className={`films_filter_button ${isGenreOpen ? 'open' : ''}`}
                                onClick={() => {
                                    setIsGenreOpen(!isGenreOpen);
                                    setIsSortOpen(false);
                                    setIsYearOpen(false);
                                }}
                            >
                                {genre}
                                <span className={`films_filter_arrow ${isGenreOpen ? 'open' : ''}`}></span>
                            </button>
                            {isGenreOpen && (
                                <div className="films_filter_menu">
                                    {genres.map((g) => (
                                        <button key={g} className={genre === g ? 'selected' : ''} onClick={() => { setGenre(g); setIsGenreOpen(false); }}>
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="films_filter_dropdown films_filter_dropdown_year" ref={yearRef}>
                            <button 
                                className={`films_filter_button films_filter_button_year ${isYearOpen ? 'open' : ''}`}
                                onClick={() => {
                                    setIsYearOpen(!isYearOpen);
                                    setIsSortOpen(false);
                                    setIsGenreOpen(false);
                                }}
                            >
                                {year}
                                <span className={`films_filter_arrow ${isYearOpen ? 'open' : ''}`}></span>
                            </button>
                            {isYearOpen && (
                                <div className="films_filter_menu">
                                    {years.map((y) => (
                                        <button key={y} className={year === y.toString() ? 'selected' : ''} onClick={() => { setYear(y.toString()); setIsYearOpen(false); }}>
                                            {y}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                    <div className="films_rating_slider_group">
                        <span className="films_rating_label"><Trans i18nKey="filmsPage.rating" /></span>
                        <div className="films_rating_slider_container">
                            <div 
                                className="films_rating_slider_wrapper" 
                                ref={sliderWrapperRef}
                                onMouseMove={(e) => {
                                    if (!sliderWrapperRef.current) return;
                                    const rect = sliderWrapperRef.current.getBoundingClientRect();
                                    const x = e.clientX - rect.left;
                                    const width = rect.width;
                                    const minPercent = (ratingMin / 10) * 100;
                                    const maxPercent = (ratingMax / 10) * 100;
                                    const minPos = (minPercent / 100) * width;
                                    const maxPos = (maxPercent / 100) * width;
                                    
                                    const distToMin = Math.abs(x - minPos);
                                    const distToMax = Math.abs(x - maxPos);
                                    
                                    if (distToMin < distToMax && distToMin < 30) {
                                        setHoveredThumb('min');
                                    } else if (distToMax < distToMin && distToMax < 30) {
                                        setHoveredThumb('max');
                                    } else {
                                        setHoveredThumb(null);
                                    }
                                }}
                                onMouseLeave={() => setHoveredThumb(null)}
                            >
                                <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    value={ratingMin}
                                    onChange={() => {}}
                                    className="films_rating_slider films_rating_slider_min"
                                    data-value={ratingMin}
                                    disabled
                                    onMouseEnter={() => setHoveredThumb('min')}
                                    onMouseLeave={() => setHoveredThumb(null)}
                                />
                                <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    value={ratingMax}
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value);
                                        if (val >= ratingMin) {
                                            setRatingMax(val);
                                            if (sliderWrapperRef.current) {
                                                const minPercent = (ratingMin / 10) * 100;
                                                const maxPercent = (val / 10) * 100;
                                                sliderWrapperRef.current.style.setProperty('--min-percent', `${minPercent}%`);
                                                sliderWrapperRef.current.style.setProperty('--max-percent', `${maxPercent}%`);
                                            }
                                        }
                                    }}
                                    onInput={(e) => {
                                        const val = parseFloat(e.target.value);
                                        if (val >= ratingMin && sliderWrapperRef.current) {
                                            const minPercent = (ratingMin / 10) * 100;
                                            const maxPercent = (val / 10) * 100;
                                            sliderWrapperRef.current.style.setProperty('--min-percent', `${minPercent}%`);
                                            sliderWrapperRef.current.style.setProperty('--max-percent', `${maxPercent}%`);
                                        }
                                    }}
                                    className="films_rating_slider films_rating_slider_max"
                                    data-value={ratingMax}
                                    onMouseEnter={() => setHoveredThumb('max')}
                                    onMouseLeave={() => setHoveredThumb(null)}
                                />
                                <span 
                                    className={`films_rating_value films_rating_value_min ${hoveredThumb === 'min' ? 'hovered' : ''}`}
                                >{ratingMin}</span>
                                <span 
                                    className={`films_rating_value films_rating_value_max ${hoveredThumb === 'max' ? 'hovered' : ''}`}
                                >{ratingMax}</span>
                            </div>
                        </div>
                        <button className="films_reset_button" onClick={handleReset}><Trans i18nKey="filmsPage.reset" /></button>
                    </div>
                </div>

                <div className="films_grid">
                    {films.length > 0 ? (
                        films.map((film) => (
                            <div
                                key={film.id}
                                className="films_film_card"
                                onMouseEnter={() => setSelectedItemId(film.id)}
                                onMouseLeave={() => setSelectedItemId(null)}
                            >
                                <Link 
                                    to={`/movie/${film.id}`}
                                    className="films_film_card_link"
                                >
                                    <img 
                                        src={selectedItemId === film.id ? film.hoverImage : film.image} 
                                        alt={film.name} 
                                        className="films_film_poster" 
                                    />
                                    
                                    <div className="films_film_card_header">
                                        <div
                                            className={`films_film_card_save films_film_action ${
                                                favorites.some((fav) => fav.id === film.id) ? 'active' : ''
                                            }`}
                                            data-tooltip={t('tooltip.watch')}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toggleFavorite({
                                                    id: film.id,
                                                    image: film.image,
                                                    hoverImage: film.hoverImage,
                                                    rating: film.rating,
                                                    linedate: film.linedate,
                                                    line1: film.line1,
                                                    line2: film.line2,
                                                    season: film.season,
                                                    source: 'films',
                                                });
                                            }}
                                        />
                                        <div
                                            className="films_film_card_repost films_film_action"
                                            data-tooltip={t('tooltip.share')}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                        />
                                    </div>

                                    <div className="films_film_card_place">
                                        <div className="films_film_card_play"></div>
                                    </div>

                                    <div className="films_film_card_text">
                                        {film.rating > 0 && (
                                            <div className="films_film_card_rating">{film.rating.toFixed(1)}</div>
                                        )}
                                        <div className="films_film_card_line">
                                            {(film.linedate || film.line1) && (
                                                <div className="films_film_card_line1">
                                                    {film.linedate && (
                                                        <span className="films_film_card_date">{film.linedate.trim()}</span>
                                                    )}
                                                    {film.line1 && <span>{film.line1}</span>}
                                                </div>
                                            )}
                                            {film.line2 && (
                                                <div className="films_film_card_line2">{film.line2}</div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                                <h3 className="films_film_title">
                                    {t(`filmsPage.filmTitles.${film.id}`, { defaultValue: film.name })}
                                </h3>
                            </div>
                        ))
                    ) : (
                        <div style={{ color: '#F8F8FE', padding: '20px', gridColumn: '1 / -1' }}><Trans i18nKey="filmsPage.loading" /></div>
                    )}
                </div>
            </div>
        </div>
    );
};

