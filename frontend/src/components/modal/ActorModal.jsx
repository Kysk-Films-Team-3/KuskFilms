import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { useFavorites } from '../../context/FavoritesContext';
import { fakeContent, fakeCategories } from '../../services/api';
import './ActorModal.css';

export const ActorModal = ({ actor, onClose }) => {
    const { t } = useTranslation();
    const { isFavorite, toggleFavorite } = useFavorites();
    const modalRef = useRef(null);
    const [category, setCategory] = useState(t('actorModal.categories.all'));
    const [sortBy, setSortBy] = useState(t('actorModal.sort.newest'));
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [films, setFilms] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const categoryRef = useRef(null);
    const sortRef = useRef(null);

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

    useEffect(() => {
        setCategory(t('actorModal.categories.all'));
        setSortBy(t('actorModal.sort.newest'));
    }, [t]);

    const categories = [
        t('actorModal.categories.all'),
        t('actorModal.categories.films'),
        t('actorModal.categories.series'),
        t('actorModal.categories.cartoons'),
        t('actorModal.categories.anime')
    ];
    const sortOptions = [
        t('actorModal.sort.newest'),
        t('actorModal.sort.rating'),
        t('actorModal.sort.discussion'),
        t('actorModal.sort.recentlyAdded')
    ];

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
                setFilms(limitedFilms);
            } catch (error) {
                console.error('Помилка завантаження фільмів:', error);
            }
        };
        
        loadFilms();
    }, [t]);

    if (!actor) return null;

    return (
        <div className="actor_overlay" role="dialog" aria-modal="true">
            <div className="actor_modal" ref={modalRef}>
                <div className="actor_close_icon" onClick={onClose}></div>
                <div className="actor_block">
                    <div className="actor_info_block">
                        <div className="actor_info_avatar"></div>
                        <div className="actor_info_name">{actor.name || 'Марго Роббі'}</div>
                        <div className="actor_info_name_en">{actor.nameEn || 'Margot Robbie'}</div>
                        
                        <div className="actor_info_divider"></div>
                        
                        <div className="actor_info_item">
                            <div className="actor_info_label"><Trans i18nKey="actorModal.labels.age" /></div>
                            <div className="actor_info_value">{actor.age || 35} {t('actorModal.years')}</div>
                        </div>
                        
                        <div className="actor_info_divider"></div>
                        
                        <div className="actor_info_item">
                            <div className="actor_info_label"><Trans i18nKey="actorModal.labels.birthDate" /></div>
                            <div className="actor_info_value">{actor.birthDate || '02.07.1990'}</div>
                        </div>
                        
                        <div className="actor_info_divider"></div>
                        
                        <div className="actor_info_item">
                            <div className="actor_info_label"><Trans i18nKey="actorModal.labels.gender" /></div>
                            <div className="actor_info_value">{actor.gender || 'Жіноча'}</div>
                        </div>
                        
                        <div className="actor_info_divider"></div>
                        
                        <div className="actor_info_item">
                            <div className="actor_info_label"><Trans i18nKey="actorModal.labels.relatives" /></div>
                            <div className="actor_info_value actor_info_relatives">
                                {(actor.relatives || ['Лахлан Роббі (брат/сестра)', 'Аня Роббі (брат/сестра)', 'Кемерон Роббі (брат/сестра)']).map((rel, idx) => (
                                    <div key={idx}>{rel}</div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="actor_info_divider"></div>
                        
                        <div className="actor_info_item">
                            <div className="actor_info_label"><Trans i18nKey="actorModal.labels.birthPlace" /></div>
                            <div className="actor_info_value">{actor.birthPlace || 'Делбі, Квінсленд, Австралія'}</div>
                        </div>
                    </div>
                    <div className="actor_film_block">
                        <div className="actor_film_title"><Trans i18nKey="actorModal.filmography" /></div>
                        <div className="actor_film_togle">
                            <div className="actor_filter_group">
                                <div className="actor_filter_dropdown" ref={categoryRef}>
                                    <button 
                                        className={`actor_filter_button ${isCategoryOpen ? 'open' : ''}`}
                                        onClick={() => {
                                            setIsCategoryOpen(!isCategoryOpen);
                                            setIsSortOpen(false);
                                        }}
                                    >
                                        {category}
                                        <span className={`actor_filter_arrow ${isCategoryOpen ? 'open' : ''}`}></span>
                                    </button>
                                    {isCategoryOpen && (
                                        <div className="actor_filter_menu">
                                            {categories.map((cat) => (
                                                <button 
                                                    key={cat} 
                                                    className={category === cat ? 'selected' : ''} 
                                                    onClick={() => { 
                                                        setCategory(cat); 
                                                        setIsCategoryOpen(false); 
                                                    }}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="actor_filter_dropdown" ref={sortRef}>
                                    <button 
                                        className={`actor_filter_button ${isSortOpen ? 'open' : ''}`}
                                        onClick={() => {
                                            setIsSortOpen(!isSortOpen);
                                            setIsCategoryOpen(false);
                                        }}
                                    >
                                        {sortBy}
                                        <span className={`actor_filter_arrow ${isSortOpen ? 'open' : ''}`}></span>
                                    </button>
                                    {isSortOpen && (
                                        <div className="actor_filter_menu">
                                            {sortOptions.map((option) => (
                                                <button 
                                                    key={option} 
                                                    className={sortBy === option ? 'selected' : ''} 
                                                    onClick={() => { 
                                                        setSortBy(option); 
                                                        setIsSortOpen(false); 
                                                    }}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
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
                                            <img 
                                                src={selectedItemId === film.id ? film.hoverImage : film.image} 
                                                alt={film.name} 
                                                className="actor_film-poster" 
                                            />
                                            
                                            <div className="actor_film-card-header">
                                                <div
                                                    className={`actor_film-card-save actor_film-action ${
                                                        isFavorite(film.id) ? 'active' : ''
                                                    }`}
                                                    data-tooltip={t('tooltip.watch')}
                                                    onClick={async (e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        await toggleFavorite(film.id);
                                                    }}
                                                />
                                                <div
                                                    className="actor_film-card-repost actor_film-action"
                                                    data-tooltip={t('tooltip.share')}
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
                                                {film.rating > 0 && (
                                                    <div className="actor_film-card-rating">{film.rating.toFixed(1)}</div>
                                                )}
                                                <div className="actor_film-card-line">
                                                    {(film.linedate || film.line1) && (
                                                        <div className="actor_film-card-line1">
                                                            {film.linedate && (
                                                                <span className="actor_film-card-date">{film.linedate.trim()}</span>
                                                            )}
                                                            {film.line1 && <span>{film.line1}</span>}
                                                        </div>
                                                    )}
                                                    {film.line2 && (
                                                        <div className="actor_film-card-line2">{film.line2}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                        <div className="actor_film-title">
                                            {t(`filmsPage.filmTitles.${film.id}`, { defaultValue: film.name })}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ color: '#F8F8FE', padding: '20px' }}><Trans i18nKey="actorModal.loading" /></div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
