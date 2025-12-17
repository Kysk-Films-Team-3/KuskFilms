import React, { useState, useEffect, useRef } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import './SearchActor.css';

const mockActors = [
    { id: 1, name: 'Джейсон Стетхем', role: 'Актор', image: 'https://res.cloudinary.com/da9jqs8yq/image/upload/v1756265326/Statham.png' },
    { id: 2, name: 'Леонардо Ді Капріо', role: 'Актор', image: 'https://via.placeholder.com/150?text=Leonardo+DiCaprio' },
    { id: 3, name: 'Марго Роббі', role: 'Акторка', image: 'https://via.placeholder.com/150?text=Margot+Robbie' },
    { id: 4, name: 'Райан Гослінг', role: 'Актор', image: 'https://via.placeholder.com/150?text=Ryan+Gosling' },
    { id: 5, name: 'Тімоті Шаламе', role: 'Актор', image: 'https://via.placeholder.com/150?text=Timothée+Chalamet' },
    { id: 6, name: 'Аня Тейлор-Джой', role: 'Акторка', image: 'https://via.placeholder.com/150?text=Anya+Taylor-Joy' },
    { id: 7, name: 'Елізабет Олсен', role: 'Акторка', image: 'https://via.placeholder.com/150?text=Elizabeth+Olsen' },
    { id: 8, name: 'Скарлетт Йоханссон', role: 'Акторка', image: 'https://via.placeholder.com/150?text=Scarlett+Johansson' },
    { id: 9, name: 'Том Гіддлстон', role: 'Актор', image: 'https://via.placeholder.com/150?text=Tom+Hiddleston' },
    { id: 10, name: 'Бред Пітт', role: 'Актор', image: 'https://via.placeholder.com/150?text=Brad+Pitt' },
    { id: 11, name: 'Ентоні Гопкінс', role: 'Актор', image: 'https://via.placeholder.com/150?text=Anthony+Hopkins' },
    { id: 12, name: 'Анджеліна Джолі', role: 'Акторка', image: 'https://via.placeholder.com/150?text=Angelina+Jolie' },
];

export const SearchActor = ({ isOpen, onClose, onSelectActors, onOpenEditActor }) => {
    const { t } = useTranslation();
    const modalRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedActors, setSelectedActors] = useState([]);
    const [actors] = useState(mockActors);

    useEffect(() => {
        if (!isOpen) return;

        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const filteredActors = actors.filter(actor =>
        actor.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleActorClick = (actorId) => {
        setSelectedActors(prev => {
            if (prev.includes(actorId)) {
                return prev.filter(id => id !== actorId);
            } else {
                return [...prev, actorId];
            }
        });
    };

    const handleSave = () => {
        const selected = actors.filter(actor => selectedActors.includes(actor.id));
        if (onSelectActors && selected.length > 0) {
            onSelectActors(selected);
        }
        onClose();
    };

    const handleDelete = () => {
        setSelectedActors([]);
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
        <div className="search_actor_overlay" role="dialog" aria-modal="true" onClick={handleOverlayClick} onMouseDown={(e) => e.stopPropagation()}>
            <div className="search_actor_modal" ref={modalRef} onClick={handleModalClick} onMouseDown={(e) => e.stopPropagation()}>
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
                        {filteredActors.length === 0 && searchQuery && (
                            <div className="search_actor_empty_state">
                                <div className="search_actor_empty_icon"></div>
                                <div className="search_actor_empty_title"><Trans i18nKey="admin.searchActor.emptyStateTitle" /></div>
                                <div className="search_actor_empty_message">
                                    <Trans i18nKey="admin.searchActor.emptyStateMessage" />
                                </div>
                            </div>
                        )}
                        {filteredActors.map((actor) => (
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
                                    <img src={actor.image} alt={actor.name} />
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

