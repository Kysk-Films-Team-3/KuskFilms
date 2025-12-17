import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Trans } from 'react-i18next';
import './ConfirmDeleteModal.css';

export const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, personName, isMoviesMode = false }) => {
    const modalRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose?.();
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose?.();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm?.();
        onClose?.();
    };

    return createPortal(
        <div className="confirm_delete_overlay" role="dialog" aria-modal="true">
            <div className="confirm_delete_modal" ref={modalRef}>
                <div
                    className="confirm_delete_close" 
                    onClick={onClose}
                    aria-label="Закрити"
                >

                </div>

                <div className="confirm_delete_content">
                    <h2 className="confirm_delete_title">
                        {isMoviesMode ? <Trans i18nKey="admin.confirmDelete.deleteMovies" /> : <Trans i18nKey="admin.confirmDelete.deletePersons" />}
                    </h2>
                    <p className="confirm_delete_subtitle">
                        {isMoviesMode ? <Trans i18nKey="admin.confirmDelete.confirmDeleteMovies" /> : <Trans i18nKey="admin.confirmDelete.confirmDeletePersons" />}
                    </p>
                </div>

                <div className="confirm_delete_buttons">
                    <button 
                        className="confirm_delete_button confirm_delete_button_cancel"
                        onClick={onClose}
                    >
                        <Trans i18nKey="admin.confirmDelete.exit" />
                    </button>
                    <button 
                        className="confirm_delete_button confirm_delete_button_delete"
                        onClick={handleConfirm}
                    >
                        <span className="confirm_delete_icon"></span>
                        <Trans i18nKey="admin.confirmDelete.delete" />
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

