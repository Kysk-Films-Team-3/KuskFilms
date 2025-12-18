import React, { useState, useEffect, useRef } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { api } from '../../services/api'; // Импорт API
import './SearchActor.css';

export const SearchActor = ({ isOpen, onClose, onSelectActors, onOpenEditActor }) => {
    const { t } = useTranslation();
    const modalRef = useRef(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedActors, setSelectedActors] = useState([]); // Храним ID выбранных
    const [actors, setActors] = useState([]); // Список загруженный с сервера

    // Блокировка скролла
    useEffect(() => {
        if (!isOpen) return;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Загрузка актеров с API
    useEffect(() => {
        if (!isOpen) return;

        const fetchActors = async () => {
            try {
                // Запрос к бэкенду (PersonController)
                // Используем относительный путь, axios добавит /api сам
                const url = searchQuery
                    ? `/persons?search=${searchQuery}`
                    : `/persons`;

                const response = await api.get(url);

                // Маппинг данных для UI
                const mappedActors = response.data.map(person => ({
                    id: person.id,
                    name: person.name,
                    role: person.activityType || 'Актор', // Значение по умолчанию если нет в БД
                    // Обработка пути к фото
                    image: person.photoUrl
                        ? (person.photoUrl.startsWith('http') ? person.photoUrl : `/kyskfilms/${person.photoUrl}`)
                        : 'https://via.placeholder.com/150?text=No+Photo'
                }));

                setActors(mappedActors);
            } catch (error) {
                console.error("Помилка завантаження акторів:", error);
            }
        };

        // Debounce (задержка перед запросом)
        const timeoutId = setTimeout(() => {
            fetchActors();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [isOpen, searchQuery]);

    // Обработчик выбора
    const handleActorClick = (actorId) => {
        setSelectedActors(prev => {
            if (prev.includes(actorId)) {
                return prev.filter(id => id !== actorId);
            } else {
                return [...prev, actorId];
            }
        });
    };

    // Сохранение выбора
    const handleSave = () => {
        // Находим полные объекты выбранных актеров
        const selected = actors.filter(actor => selectedActors.includes(actor.id));
        if (onSelectActors && selected.length > 0) {
            onSelectActors(selected);
        }
        onClose();
    };

    const handleDelete = () => {
        setSelectedActors([]);
    };

    // Заглушка для фото (если файл в MinIO удален)
    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = 'https://via.placeholder.com/150?text=No+Photo';
    };

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="search_actor_overlay" role="dialog" aria-modal="true" onClick={handleOverlayClick} onMouseDown={(e) => e.stopPropagation()}>
            <div className="search_actor_modal" ref={modalRef} onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
                <div className="search_actor_close" onClick={onClose}></div>

                <div className="search_actor_header">
                    <div className="search_actor_title"><Trans i18nKey="admin.searchActor.title" /></div>
                </div>

                <div className="search_actor_content">
                    <div className="search_actor_search">
                        <div className="search_actor_search_icon"></div>
                        <input
                            type="text"
                            className="search_actor_search_input"
                            placeholder={t('admin.searchActor.placeholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="search_actor_grid">
                        {/* Кнопка создания нового актера */}
                        {!searchQuery && (
                            <div className="search_actor_placeholder">
                                <div className="search_actor_avatar_placeholder"></div>
                                <button
                                    className="search_actor_create_button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (onOpenEditActor) {
                                            onClose();
                                            onOpenEditActor();
                                        }
                                    }}
                                >
                                    <span className="search_actor_create_icon"></span>
                                    <Trans i18nKey="admin.searchActor.create" />
                                </button>
                            </div>
                        )}

                        {/* Пустое состояние */}
                        {actors.length === 0 && searchQuery && (
                            <div className="search_actor_empty_state">
                                <div className="search_actor_empty_icon"></div>
                                <div className="search_actor_empty_title"><Trans i18nKey="admin.searchActor.emptyStateTitle" /></div>
                                <div className="search_actor_empty_message">
                                    <Trans i18nKey="admin.searchActor.emptyStateMessage" />
                                </div>
                            </div>
                        )}

                        {/* Список актеров */}
                        {actors.map((actor) => (
                            <div
                                key={actor.id}
                                className={`search_actor_item ${selectedActors.includes(actor.id) ? 'selected' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleActorClick(actor.id);
                                }}
                            >
                                {selectedActors.includes(actor.id) && (
                                    <div className="search_actor_checkmark selected"></div>
                                )}
                                <div className="search_actor_avatar">
                                    <img
                                        src={actor.image}
                                        alt={actor.name}
                                        onError={handleImageError}
                                    />
                                </div>
                                <div className="search_actor_info">
                                    <div className="search_actor_name">{actor.name}</div>
                                    {actor.role && (
                                        <div className="search_actor_role">{actor.role}</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="search_actor_footer">
                    {selectedActors.length > 0 && (
                        <button className="search_actor_delete_button" onClick={handleDelete}>
                            <span className="search_actor_delete_icon"></span>
                            <Trans i18nKey="admin.searchActor.delete" />
                        </button>
                    )}
                    <button className="search_actor_save_button" onClick={handleSave}>
                        <span className="search_actor_save_icon"></span>
                        <Trans i18nKey="admin.searchActor.save" />
                    </button>
                </div>
            </div>
        </div>
    );
};