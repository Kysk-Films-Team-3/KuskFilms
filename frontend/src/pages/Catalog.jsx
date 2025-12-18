import React, { useState, useEffect, useRef } from 'react';
import { getCatalogPageData } from '../services/api';
import './Catalog.css';

export const Catalog = () => {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const collectionsRef = useRef(null);
    const [scrollState, setScrollState] = useState({
        isAtStart: true,
        isAtEnd: false,
        isScrollable: false
    });


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
    }, [pageData?.collections]);

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
        const loadPageData = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('Загрузка данных каталога...');
                const data = await getCatalogPageData();
                console.log('Данные каталога загружены:', data);
                console.log('Жанры:', data?.genres);
                console.log('Количество жанров:', data?.genres?.length);
                console.log('Коллекции:', data?.collections);
                console.log('Количество коллекций:', data?.collections?.length);
                setPageData(data);
            } catch (err) {
                console.error('Ошибка загрузки данных каталога:', err);
                console.error('Детали ошибки:', err.response?.data || err.message);
                setError(err.message || 'Ошибка загрузки данных');
                setPageData(null);
            } finally {
                setLoading(false);
            }
        };
        loadPageData();
    }, []);

    if (loading) {
        return (
            <div className="catalog_page">
                <div className="catalog_container">
                    <div className="catalog_title"></div>
                    <div style={{ padding: '20px', textAlign: 'center' }}>Загрузка...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="catalog_page">
                <div className="catalog_container">
                    <div className="catalog_title"></div>
                    <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
                        Ошибка: {error}
                    </div>
                </div>
            </div>
        );
    }

    if (!pageData) {
        return (
            <div className="catalog_page">
                <div className="catalog_container">
                    <div className="catalog_title"></div>
                    <div style={{ padding: '20px', textAlign: 'center' }}>Нет данных</div>
                </div>
            </div>
        );
    }

    return (
        <div className="catalog_page">
            <div className="catalog_container">
                <div className="catalog_title">{pageData.title || ''}</div>
                
                {process.env.NODE_ENV === 'development' && (
                    <div style={{ padding: '10px', background: '#333', color: '#fff', margin: '10px 0' }}>
                        <div>Жанры: {pageData.genres ? JSON.stringify(pageData.genres.map(g => ({ name: g.name, slug: g.slug }))) : 'null'}</div>
                        <div>Количество жанров: {pageData.genres?.length || 0}</div>
                        <div>Коллекции: {pageData.collections ? JSON.stringify(pageData.collections.map(c => ({ title: c.title, itemsCount: c.items?.length }))) : 'null'}</div>
                        <div>Количество коллекций: {pageData.collections?.length || 0}</div>
                    </div>
                )}
                
                {pageData.genres && pageData.genres.length > 0 ? (
                    <div className="catalog_grid">
                        {pageData.genres.map((genre, index) => (
                            <div key={index} className="catalog_category_card">
                                <div className="category_image_wrapper">
                                    {genre.iconUrl ? (
                                        <img 
                                            src={genre.iconUrl} 
                                            alt={genre.name}
                                            className="category_image"
                                            onError={(e) => {
                                                console.error('Ошибка загрузки иконки жанра:', genre.iconUrl);
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div className="category_image" style={{ 
                                            backgroundColor: '#333', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            color: '#fff'
                                        }}>
                                            {genre.name}
                                        </div>
                                    )}
                                </div>
                                <div className="category_name">{genre.name}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                        Жанры временно недоступны
                    </div>
                )}
            </div>
            
            {pageData.collectionsTitle && (
                <div className="catalog_collections_section">
                    <div className="catalog_collections_header">
                        <h2 className="catalog_collections_title">{pageData.collectionsTitle}</h2>
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
                    <div className="catalog_collections_list">
                        {pageData.collections && pageData.collections.length > 0 ? (
                            pageData.collections.map((collection, index) => {
                                const collectionImage = collection.items?.find(item => item.posterUrl)?.posterUrl || 
                                                       (collection.items && collection.items.length > 0 ? collection.items[0].posterUrl : null);
                                
                                return (
                                    <div key={index} className="catalog_collection_item">
                                        <div className="catalog_collection_card">
                                            <div className="catalog_collection_badge"></div>
                                            {collectionImage ? (
                                                <img
                                                    src={collectionImage}
                                                    alt={collection.title}
                                                    className="catalog_collection_image"
                                                    draggable="false"
                                                    onDragStart={(e) => e.preventDefault()}
                                                    onError={(e) => {
                                                        console.error('Ошибка загрузки изображения коллекции:', collectionImage);
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <div className="catalog_collection_image" style={{ 
                                                    backgroundColor: '#333', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center',
                                                    color: '#fff'
                                                }}>
                                                    {collection.title}
                                                </div>
                                            )}
                                            <h3 className="catalog_collection_name">{collection.title}</h3>
                                            {collection.description && (
                                                <p className="catalog_collection_description" style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                                                    {collection.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                                Коллекции временно недоступны
                            </div>
                        )}
                    </div>
                </div>
            </div>
            )}
        </div>
    );
};
