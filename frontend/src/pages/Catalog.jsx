import React, { useState, useEffect, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { fetchTitles } from '../services/api';
import './Catalog.css';

export const Catalog = () => {
    const { t } = useTranslation();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const categories = [
        {
            id: 1,
            nameKey: 'catalog.categories.films',
            image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1765296949/Frame_101_1_rh1fm0.png',
            route: '/catalog/films'
        },
        {
            id: 2,
            nameKey: 'catalog.categories.series',
            image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1765296951/Frame_101_yht5ma.png',
            route: '/catalog/series'
        },
        {
            id: 3,
            nameKey: 'catalog.categories.cartoons',
            image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1765296949/Frame_101_2_ggpsar.png',
            route: '/catalog/cartoons'
        },
        {
            id: 4,
            nameKey: 'catalog.categories.animatedSeries',
            image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1765296949/Frame_101_3_ugj2av.png',
            route: '/catalog/animated-series'
        },
        {
            id: 5,
            nameKey: 'catalog.categories.interviews',
            image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1765296949/Frame_101_4_bklkvb.png',
            route: '/catalog/interviews'
        },
        {
            id: 6,
            nameKey: 'catalog.categories.anime',
            image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1765296950/Frame_101_5_bgxy78.png',
            route: '/catalog/anime'
        },
        {
            id: 7,
            nameKey: 'catalog.categories.concerts',
            image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1765296950/Frame_101_6_eirbrh.png',
            route: '/catalog/concerts'
        },
        {
            id: 8,
            nameKey: 'catalog.categories.reality',
            image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1765296949/Frame_101_7_pi6shs.png',
            route: '/catalog/reality'
        },
        {
            id: 9,
            nameKey: 'catalog.categories.cooking',
            image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1765296950/Frame_101_8_fdi1xx.png',
            route: '/catalog/cooking'
        },
        {
            id: 10,
            nameKey: 'catalog.categories.programs',
            image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1765296951/Frame_101_9_nrphno.png',
            route: '/catalog/programs'
        },
        {
            id: 11,
            nameKey: 'catalog.categories.opera',
            image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1765296951/Frame_101_10_e75n8w.png',
            route: '/catalog/opera'
        },
        {
            id: 12,
            nameKey: 'catalog.categories.nature',
            image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1765296951/Frame_101_11_jcuelv.png',
            route: '/catalog/nature'
        },
        {
            id: 13,
            nameKey: 'catalog.categories.art',
            image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1765296951/Frame_101_12_kpqgvb.png',
            route: '/catalog/art'
        },
        {
            id: 14,
            nameKey: 'catalog.categories.fitness',
            image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1765296951/Frame_101_13_jxysks.png',
            route: '/catalog/fitness'
        },
        {
            id: 15,
            nameKey: 'catalog.categories.lectures',
            image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1765296952/Frame_101_14_j0mylz.png',
            route: '/catalog/lectures'
        }
    ];

    const collectionsRef = useRef(null);
    const [scrollState, setScrollState] = useState({
        isAtStart: true,
        isAtEnd: false,
        isScrollable: false
    });

    const collections = [
        {
            id: 1,
            nameKey: 'catalog.collectionsList.dystopia',
            image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1765288109/Frame_101_lkkf1x.png'
        },
        {
            id: 2,
            nameKey: 'catalog.collectionsList.antiheroes',
            image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1765288110/Frame_101_1_vek5dj.png'
        },
        {
            id: 3,
            nameKey: 'catalog.collectionsList.powerOfFriendship',
            image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1765288110/Frame_101_2_ijcn0y.png'
        },
        {
            id: 4,
            nameKey: 'catalog.collectionsList.romance',
            image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1765290991/Frame_101_p1jsxz.png'
        }
    ];

    const scrollCollections = (direction) => {
        if (!collectionsRef.current) return;
        const list = collectionsRef.current.querySelector('.catalog_collections_list');
        if (!list) return;
        const card = list.querySelector('.catalog_collection_item');
        if (!card) return;
        
        const cardWidth = card.offsetWidth;
        const gap = 30;
        const scrollAmount = cardWidth + gap;

        collectionsRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    const scrollTimeoutRef = useRef(null);
    
    const handleScroll = () => {
        if (!collectionsRef.current) return;
        const el = collectionsRef.current;
        const scrollWidth = el.scrollWidth;
        const clientWidth = el.clientWidth;
        const scrollLeft = el.scrollLeft;
        const isScrollable = scrollWidth > clientWidth + 5;

        const isAtStart = !isScrollable || scrollLeft <= 5;
        const isAtEnd = !isScrollable || scrollLeft + clientWidth >= scrollWidth - 5;

        setScrollState(prevState => {
            if (prevState.isAtStart === isAtStart && 
                prevState.isAtEnd === isAtEnd && 
                prevState.isScrollable === isScrollable) {
                return prevState;
            }
            return {
                isAtStart,
                isAtEnd,
                isScrollable
            };
        });
    };
    
    const handleScrollDebounced = () => {
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
            requestAnimationFrame(handleScroll);
        }, 16);
    };

    useEffect(() => {
        let rafId = null;
        let timeoutId = null;
        let scrollTimeoutId = null;
        
        const checkScroll = () => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                handleScroll();
            });
        };
        
        checkScroll();
        
        const handleResize = () => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                checkScroll();
            }, 100);
        };
        
        const handleScrollDebounced = () => {
            if (scrollTimeoutId) clearTimeout(scrollTimeoutId);
            scrollTimeoutId = setTimeout(() => {
                requestAnimationFrame(() => {
                    handleScroll();
                });
            }, 16);
        };
        
        window.addEventListener('resize', handleResize);
        
        timeoutId = setTimeout(checkScroll, 100);
        
        const checkImagesLoaded = () => {
            if (!collectionsRef.current) return;
            const images = collectionsRef.current.querySelectorAll('img');
            if (images && images.length > 0) {
                let loadedCount = 0;
                const totalImages = images.length;
                const onImageLoad = () => {
                    loadedCount++;
                    if (loadedCount === totalImages) {
                        setTimeout(checkScroll, 100);
                    }
                };
                images.forEach(img => {
                    if (img.complete) {
                        onImageLoad();
                    } else {
                        img.addEventListener('load', onImageLoad, { once: true });
                        img.addEventListener('error', onImageLoad, { once: true });
                    }
                });
            }
        };
        
        setTimeout(checkImagesLoaded, 50);
        
        return () => {
            window.removeEventListener('resize', handleResize);
            if (timeoutId) clearTimeout(timeoutId);
            if (rafId) cancelAnimationFrame(rafId);
            if (scrollTimeoutId) clearTimeout(scrollTimeoutId);
        };
    }, [collections]);

    const isDown = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const handleMouseDown = (e) => {
        if (!collectionsRef.current) return;
        if (e.target.closest('.catalog_collections_scroll_btn')) return;
        isDown.current = true;
        const el = collectionsRef.current;
        startX.current = e.pageX - el.offsetLeft;
        scrollLeft.current = el.scrollLeft;
    };

    const handleMouseLeave = () => {
        isDown.current = false;
    };

    const handleMouseUp = () => {
        isDown.current = false;
        requestAnimationFrame(() => {
            handleScroll();
        });
    };

    const handleMouseMove = (e) => {
        if (!isDown.current || !collectionsRef.current) return;
        e.preventDefault();
        const el = collectionsRef.current;
        const x = e.pageX - el.offsetLeft;
        const walk = (x - startX.current) * 2;
        el.scrollLeft = scrollLeft.current - walk;
        requestAnimationFrame(() => {
            handleScroll();
        });
    };

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);

                const data = await fetchTitles(0);

                if (data && Array.isArray(data.content)) {
                    setMovies(data.content);
                    setError(null);
                } else {
                    console.error("API повернул невідомі данні:", data);
                    setError(t("catalog.errorFormat"));
                }
            } catch (err) {
                console.error("API не відповів:", err);
                setError(t("catalog.error"));
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [t]);

    return (
        <div className="catalog_page">
            <div className="catalog_container">
                <div className="catalog_title"><Trans i18nKey="catalog.title" /></div>
                
                <div className="catalog_grid">
                    {categories.map((category) => (
                        <div key={category.id} className="catalog_category_card">
                            <div className="category_image_wrapper">
                                <img 
                                    src={category.image} 
                                    alt={t(category.nameKey)}
                                    className="category_image"
                                />
                            </div>
                            <div className="category_name"><Trans i18nKey={category.nameKey} /></div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="catalog_collections_section">
                <div className="catalog_collections_header">
                    <h2 className="catalog_collections_title"><Trans i18nKey="catalog.collections" /></h2>
                    <div className="catalog_collections_arrow"></div>
                </div>
                <div
                    className={`catalog_collections_scroll_btn left ${!scrollState.isScrollable || scrollState.isAtStart ? 'hidden' : ''}`}
                    onClick={() => scrollCollections('left')}
                />
                <div
                    className={`catalog_collections_scroll_btn right ${!scrollState.isScrollable || scrollState.isAtEnd ? 'hidden' : ''}`}
                    onClick={() => scrollCollections('right')}
                />
                    <div
                        className="catalog_collections_wrapper"
                        ref={collectionsRef}
                        onMouseDown={handleMouseDown}
                        onMouseLeave={handleMouseLeave}
                        onMouseUp={handleMouseUp}
                        onMouseMove={handleMouseMove}
                        onScroll={handleScrollDebounced}
                    >
                    <div
                        className="catalog_collections_list"
                    >
                        {collections.map((collection) => (
                            <div key={collection.id} className="catalog_collection_item">
                                <div className="catalog_collection_card">
                                    <div className="catalog_collection_badge"><Trans i18nKey="catalog.collectionBadge" /></div>
                                    <img
                                        src={collection.image}
                                        alt={t(collection.nameKey)}
                                        className="catalog_collection_image"
                                        draggable="false"
                                        onDragStart={(e) => e.preventDefault()}
                                    />
                                    <h3 className="catalog_collection_name"><Trans i18nKey={collection.nameKey} /></h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
