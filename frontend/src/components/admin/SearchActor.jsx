import React, { useState, useEffect, useRef } from 'react';
import { api, fetchUiDictionary } from '../../services/api';
import './SearchActor.css';

export const SearchActor = ({ isOpen, onClose, onSelectActors, onOpenEditActor }) => {
    const [uiDictionary, setUiDictionary] = useState(null);
    const modalRef = useRef(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedActors, setSelectedActors] = useState([]);
    const [actors, setActors] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchUiDictionary();
                setUiDictionary(data);
            } catch (error) {
            }
        })();
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const fetchActors = async () => {
            try {
                const url = searchQuery
                    ? `/persons?search=${searchQuery}`
                    : `/persons`;

                const response = await api.get(url);

                const mappedActors = response.data.map(person => ({
                    id: person.id,
                    name: person.name,
                    role: person.activityType || 'Актор',
                    image: person.photoUrl
                        ? (person.photoUrl.startsWith('http') ? person.photoUrl : `/kyskfilms/${person.photoUrl}`)
                        : 'https://via.placeholder.com/150?text=No+Photo'
                }));

                setActors(mappedActors);
            } catch (error) {
            }
        };

        const timeoutId = setTimeout(() => {
            fetchActors();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [isOpen, searchQuery]);

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
                    <div className="search_actor_title">{uiDictionary?.searchActor?.title || ''}</div>
                </div>

                <div className="search_actor_content">
                    <div className="search_actor_search">
                        <div className="search_actor_search_icon"></div>
                        <input
                            type="text"
                            className="search_actor_search_input"
                            placeholder={uiDictionary?.searchActor?.placeholder || ''}
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
                                    {uiDictionary?.searchActor?.create || ''}
                                </button>
                            </div>
                        )}

                        {actors.length === 0 && searchQuery && (
                            <div className="search_actor_empty_state">
                                <div className="search_actor_empty_icon"></div>
                                <div className="search_actor_empty_title">{uiDictionary?.searchActor?.emptyStateTitle || ''}</div>
                                <div className="search_actor_empty_message">
                                    {uiDictionary?.searchActor?.emptyStateMessage || ''}
                                </div>
                            </div>
                        )}

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
                            {uiDictionary?.searchActor?.delete || ''}
                        </button>
                    )}
                    <button className="search_actor_save_button" onClick={handleSave}>
                        <span className="search_actor_save_icon"></span>
                        {uiDictionary?.searchActor?.save || ''}
                    </button>
                </div>
            </div>
        </div>
    );
};