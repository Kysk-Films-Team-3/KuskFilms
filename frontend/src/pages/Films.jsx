import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { fetchTitles, getFilmsPageMeta } from '../services/api';
import './Films.css';

export const Films = () => {
    const { isFavorite, toggleFavorite } = useFavorites();
    const [searchParams, setSearchParams] = useSearchParams();
    const [pageMeta, setPageMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filmsLoading, setFilmsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('');
    const [sortKey, setSortKey] = useState(null);
    const [genre, setGenre] = useState('');
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [year, setYear] = useState('');
    const [selectedYear, setSelectedYear] = useState(null);
    const [ratingMin, setRatingMin] = useState(0);
    const [ratingMax, setRatingMax] = useState(10);
    const ratingDebounceRef = useRef(null);
    const isDraggingRef = useRef(false);
    const draggingSliderRef = useRef(null);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isGenreOpen, setIsGenreOpen] = useState(false);
    const [isYearOpen, setIsYearOpen] = useState(false);
    const [films, setFilms] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
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
    
    const handleSliderTrackClick = (e) => {
        if (e.target.tagName === 'INPUT') return;
        
        if (!sliderWrapperRef.current) return;
        
        const rect = sliderWrapperRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const clickValue = Math.max(0, Math.min(10, (x / width) * 10));
        
        const minPos = (ratingMin / 10) * width;
        const maxPos = (ratingMax / 10) * width;
        const distToMin = Math.abs(x - minPos);
        const distToMax = Math.abs(x - maxPos);
        
        if (distToMin < distToMax) {
            const newMin = Math.max(0, Math.min(clickValue, ratingMax));
            setRatingMin(newMin);
            setCurrentPage(0);
        } else {
            const newMax = Math.max(ratingMin, Math.min(10, clickValue));
            setRatingMax(newMax);
            setCurrentPage(0);
        }
    };
    
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDraggingRef.current || !sliderWrapperRef.current || !draggingSliderRef.current) return;
            
            const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
            if (clientX === undefined) return;
            
            e.preventDefault();
            
            const rect = sliderWrapperRef.current.getBoundingClientRect();
            let x = clientX - rect.left;
            x = Math.max(0, Math.min(rect.width, x));
            const width = rect.width;
            const newValue = (x / width) * 10;
            
            if (draggingSliderRef.current === 'min') {
                const clampedValue = Math.max(0, Math.min(newValue, ratingMax));
                setRatingMin(clampedValue);
            } else if (draggingSliderRef.current === 'max') {
                const clampedValue = Math.max(ratingMin, Math.min(10, newValue));
                setRatingMax(clampedValue);
            }
        };
        
        
        const handleMouseUp = () => {
            if (isDraggingRef.current) {
                isDraggingRef.current = false;
                draggingSliderRef.current = null;
                setCurrentPage(0);
            }
        };
        
        document.addEventListener('mousemove', handleMouseMove, { passive: false });
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchmove', handleMouseMove, { passive: false });
        document.addEventListener('touchend', handleMouseUp);
        
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleMouseMove);
            document.removeEventListener('touchend', handleMouseUp);
        };
    }, [ratingMin, ratingMax]);

    useEffect(() => {
        const genreParam = searchParams.get('genre');
        if (genreParam) {
            setGenre(genreParam);
            setSelectedGenre(genreParam);
        }
    }, [searchParams]);

    useEffect(() => {
        const loadPageMeta = async () => {
            try {
                setLoading(true);
                setError(null);
                const meta = await getFilmsPageMeta();
                setPageMeta(meta);
                
                if (meta && meta.filters) {
                    const sortOptions = meta.filters.sortOptions || {};
                    if (sortOptions['rating_desc']) {
                        setSortBy(sortOptions['rating_desc']);
                        setSortKey('rating_desc');
                    } else {
                        const sortOptionsArray = Object.entries(sortOptions);
                        if (sortOptionsArray.length > 0) {
                            const [firstKey, firstValue] = sortOptionsArray[0];
                            setSortBy(firstValue);
                            setSortKey(firstKey);
                        }
                    }
                    if (!genre) {
                        setGenre('');
                    }
                    if (!year) {
                        setYear('');
                    }
                }
            } catch (err) {
                setError(err.message || 'Ошибка загрузки данных');
            } finally {
                setLoading(false);
            }
        };
        
        loadPageMeta();
    }, []);

    const genres = pageMeta?.filters?.genres || [];
    const years = pageMeta?.filters?.years || [];
    const sortOptions = pageMeta?.filters?.sortOptions || {};
    
    const defaultSortLabel = sortOptions && Object.keys(sortOptions).length > 0 
        ? Object.values(sortOptions)[0] 
        : '';

    useEffect(() => {
        const loadFilms = async () => {
            if (!pageMeta) return;
            
            try {
                setFilmsLoading(true);
                
                const params = {
                    page: currentPage,
                    size: 20,
                    sort: sortKey || undefined,
                    genre: selectedGenre || undefined,
                    year: selectedYear ? parseInt(selectedYear) : undefined,
                    ratingFrom: ratingMin > 0 ? ratingMin : undefined
                };

                const response = await fetchTitles(params);
                
                let titles;
                let totalPagesCount = 1;
                
                if (Array.isArray(response)) {
                    titles = response;
                } else if (response.content) {
                    titles = response.content;
                    totalPagesCount = response.totalPages || 1;
                } else {
                    titles = [];
                }
                
                setTotalPages(totalPagesCount);
                
                const mappedFilms = titles
                    .map(title => {
                        let year = null;
                        if (title.releaseDate) {
                            try {
                                const date = typeof title.releaseDate === 'string' 
                                    ? new Date(title.releaseDate) 
                                    : title.releaseDate;
                                year = date instanceof Date && !isNaN(date.getTime()) 
                                    ? date.getFullYear() 
                                    : null;
                            } catch (e) {
                            }
                        }
                        
                        const genresStr = title.genres && Array.isArray(title.genres) && title.genres.length > 0 
                            ? title.genres.join(', ') 
                            : '';
                        
                        const rating = title.rating ? parseFloat(title.rating) : 0;
                        
                        return {
                            id: title.id,
                            name: title.title || `Фільм ${title.id}`,
                            image: title.posterUrl || '',
                            hoverImage: title.posterUrl || '',
                            rating: rating,
                            year: year,
                            genre: genresStr,
                            linedate: year ? year.toString() : '',
                            line1: genresStr,
                            line2: '',
                            season: title.type === 'SERIES' ? '1 Сезон' : '',
                            isSaved: title.isSaved || false
                        };
                    })
                    .filter(film => {
                        if (ratingMax < 10) {
                            return film.rating <= ratingMax;
                        }
                        return true;
                    });
                
                setFilms(mappedFilms);
            } catch (error) {
                setError(error.message || 'Ошибка загрузки фильмов');
            } finally {
                setFilmsLoading(false);
            }
        };
        
        loadFilms();
    }, [pageMeta, currentPage, sortKey, selectedGenre, selectedYear]);
    
    useEffect(() => {
        if (!pageMeta) return;
        
        const loadFilms = async () => {
            try {
                setFilmsLoading(true);
                
                const params = {
                    page: 0,
                    size: 20,
                    sort: sortKey || undefined,
                    genre: selectedGenre || undefined,
                    year: selectedYear ? parseInt(selectedYear) : undefined,
                    ratingFrom: ratingMin > 0 ? ratingMin : undefined
                };

                const response = await fetchTitles(params);
                
                let titles;
                let totalPagesCount = 1;
                
                if (Array.isArray(response)) {
                    titles = response;
                } else if (response.content) {
                    titles = response.content;
                    totalPagesCount = response.totalPages || 1;
                } else {
                    titles = [];
                }
                
                setTotalPages(totalPagesCount);
                
                const mappedFilms = titles
                    .map(title => {
                        let year = null;
                        if (title.releaseDate) {
                            try {
                                const date = typeof title.releaseDate === 'string' 
                                    ? new Date(title.releaseDate) 
                                    : title.releaseDate;
                                year = date instanceof Date && !isNaN(date.getTime()) 
                                    ? date.getFullYear() 
                                    : null;
                            } catch (e) {
                            }
                        }
                        
                        const genresStr = title.genres && Array.isArray(title.genres) && title.genres.length > 0 
                            ? title.genres.join(', ') 
                            : '';
                        
                        const rating = title.rating ? parseFloat(title.rating) : 0;
                        
                        return {
                            id: title.id,
                            name: title.title || `Фільм ${title.id}`,
                            image: title.posterUrl || '',
                            hoverImage: title.posterUrl || '',
                            rating: rating,
                            year: year,
                            genre: genresStr,
                            linedate: year ? year.toString() : '',
                            line1: genresStr,
                            line2: '',
                            season: title.type === 'SERIES' ? '1 Сезон' : '',
                            isSaved: title.isSaved || false
                        };
                    })
                    .filter(film => {
                        if (ratingMax < 10) {
                            return film.rating <= ratingMax;
                        }
                        return true;
                    });
                
                setFilms(mappedFilms);
            } catch (error) {
                setError(error.message || 'Ошибка загрузки фильмов');
            } finally {
                setFilmsLoading(false);
            }
        };
        
        if (ratingDebounceRef.current) {
            clearTimeout(ratingDebounceRef.current);
        }
        
        ratingDebounceRef.current = setTimeout(() => {
            loadFilms();
        }, 500);
        
        return () => {
            if (ratingDebounceRef.current) {
                clearTimeout(ratingDebounceRef.current);
            }
        };
    }, [pageMeta, sortKey, selectedGenre, selectedYear, ratingMin, ratingMax]);

    const handleReset = () => {
        setSearchParams({});
        if (pageMeta && pageMeta.filters && pageMeta.filters.sortOptions) {
            const sortOptions = pageMeta.filters.sortOptions;
            if (sortOptions['rating_desc']) {
                setSortBy(sortOptions['rating_desc']);
                setSortKey('rating_desc');
            } else {
                const sortOptionsArray = Object.entries(sortOptions);
                if (sortOptionsArray.length > 0) {
                    const [firstKey, firstValue] = sortOptionsArray[0];
                    setSortBy(firstValue);
                    setSortKey(firstKey);
                }
            }
        }
        setGenre('');
        setSelectedGenre(null);
        setYear('');
        setSelectedYear(null);
        setRatingMin(0);
        setRatingMax(10);
        setCurrentPage(0);
    };

    if (loading) {
        return (
            <div className="films_page">
                <div className="films_container">
                    <div style={{ padding: '20px', textAlign: 'center' }}>Загрузка...</div>
                </div>
            </div>
        );
    }

    if (error || !pageMeta) {
        return (
            <div className="films_page">
                <div className="films_container">
                    <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
                        {error || 'Ошибка загрузки данных'}
                    </div>
                    <div style={{ padding: '10px', textAlign: 'center', color: '#999', fontSize: '12px' }}>
                        Проверьте консоль браузера для деталей
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="films_page">
            <div className="films_container">
                <div className="films_header">
                    <h1 className="films_title">{pageMeta.title || ''}</h1>
                    <p className="films_description">
                        {pageMeta.description || ''}
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
                                {sortBy || defaultSortLabel}
                                <span className={`films_filter_arrow ${isSortOpen ? 'open' : ''}`}></span>
                            </button>
                            {isSortOpen && (
                                <div className="films_filter_menu">
                                    {Object.entries(sortOptions).map(([key, value]) => (
                                        <button 
                                            key={key}
                                            className={sortBy === value ? 'selected' : ''} 
                                            onClick={() => { 
                                                setSortBy(value);
                                                setSortKey(key);
                                                setIsSortOpen(false);
                                                setCurrentPage(0);
                                            }}
                                        >
                                            {value}
                                        </button>
                                    ))}
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
                                        <button
                                            key={g}
                                            className={genre === g ? 'selected' : ''}
                                            onClick={() => {
                                                setGenre(g);
                                                setSelectedGenre(g);
                                                setIsGenreOpen(false);
                                                setCurrentPage(0);
                                                const newSearchParams = new URLSearchParams(searchParams);
                                                if (g) {
                                                    newSearchParams.set('genre', g);
                                                } else {
                                                    newSearchParams.delete('genre');
                                                }
                                                setSearchParams(newSearchParams);
                                            }}
                                        >
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
                                        <button 
                                            key={y} 
                                            className={year === y.toString() ? 'selected' : ''} 
                                            onClick={() => { 
                                                setYear(y.toString());
                                                setSelectedYear(y.toString());
                                                setIsYearOpen(false);
                                                setCurrentPage(0);
                                            }}
                                        >
                                            {y}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                    <div className="films_rating_slider_group">
                        <span className="films_rating_label">{pageMeta?.filters?.ratingLabel || 'Рейтинг'}</span>
                        <div className="films_rating_slider_container">
                            <div 
                                className="films_rating_slider_wrapper" 
                                ref={sliderWrapperRef}
                                onClick={handleSliderTrackClick}
                                onMouseDown={(e) => {
                                    if (e.target.tagName !== 'INPUT' && sliderWrapperRef.current) {
                                        const rect = sliderWrapperRef.current.getBoundingClientRect();
                                        const x = e.clientX - rect.left;
                                        const width = rect.width;
                                        const minPos = (ratingMin / 10) * width;
                                        const maxPos = (ratingMax / 10) * width;
                                        const distToMin = Math.abs(x - minPos);
                                        const distToMax = Math.abs(x - maxPos);
                                        
                                        if (distToMin < distToMax) {
                                            isDraggingRef.current = true;
                                            draggingSliderRef.current = 'min';
                                        } else {
                                            isDraggingRef.current = true;
                                            draggingSliderRef.current = 'max';
                                        }
                                    }
                                }}
                            >
                                <input
                                    type="range"
                                    min="0"
                                    max={ratingMax}
                                    step="0.1"
                                    value={ratingMin}
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value);
                                        const newMin = Math.max(0, Math.min(val, ratingMax));
                                        setRatingMin(newMin);
                                        setCurrentPage(0);
                                    }}
                                    onMouseDown={(e) => {
                                        e.stopPropagation();
                                        isDraggingRef.current = true;
                                        draggingSliderRef.current = 'min';
                                    }}
                                    onTouchStart={(e) => {
                                        e.stopPropagation();
                                        isDraggingRef.current = true;
                                        draggingSliderRef.current = 'min';
                                    }}
                                    className="films_rating_slider films_rating_slider_min"
                                />
                                <input
                                    type="range"
                                    min={ratingMin}
                                    max="10"
                                    step="0.1"
                                    value={ratingMax}
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value);
                                        const newMax = Math.max(ratingMin, Math.min(10, val));
                                        setRatingMax(newMax);
                                        setCurrentPage(0);
                                    }}
                                    onMouseDown={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        isDraggingRef.current = true;
                                        draggingSliderRef.current = 'max';
                                    }}
                                    onTouchStart={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        isDraggingRef.current = true;
                                        draggingSliderRef.current = 'max';
                                    }}
                                    className="films_rating_slider films_rating_slider_max"
                                />
                                <span className="films_rating_value films_rating_value_min">{ratingMin.toFixed(1)}</span>
                                <span className="films_rating_value films_rating_value_max">{ratingMax.toFixed(1)}</span>
                            </div>
                        </div>
                        <button className="films_reset_button" onClick={handleReset}>{pageMeta?.filters?.resetButtonLabel || 'Скинути'}</button>
                    </div>
                </div>

                <div className="films_grid">
                    {filmsLoading && (
                        <div style={{ color: '#F8F8FE', padding: '20px', gridColumn: '1 / -1', textAlign: 'center' }}>Загрузка фильмов...</div>
                    )}
                    {!filmsLoading && films.length > 0 ? (
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
                                                isFavorite(film.id) ? 'active' : ''
                                            }`}
                                            onClick={async (e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                await toggleFavorite(film.id);
                                            }}
                                        />
                                        <div
                                            className="films_film_card_repost films_film_action"
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
                                    {film.name}
                                </h3>
                            </div>
                        ))
                    ) : !filmsLoading ? (
                        <div style={{ color: '#F8F8FE', padding: '20px', gridColumn: '1 / -1', textAlign: 'center' }}>Фильмы не найдены</div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

