import React, { createContext, useState, useContext } from 'react';

const ModalsContext = createContext({
    activeModal: null,
    openModal: () => {},
    closeModal: () => {},
});

export const useModals = () => useContext(ModalsContext);

export const ModalsProvider = ({ children }) => {
    const [activeModal, setActiveModal] = useState(null);

    const openModal = (modalName) => {
        setActiveModal(modalName);
    };

    const closeModal = () => {
        setActiveModal(null);
    };

    const value = { activeModal, openModal, closeModal };

    return (
        <ModalsContext.Provider value={value}>
            {children}
        </ModalsContext.Provider>
    );
};
