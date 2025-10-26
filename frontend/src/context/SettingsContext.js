import React, { createContext, useContext, useReducer, useState } from "react";

const SettingsContext = createContext(null);

const initialState = {
    payment: { accountNumber: "4 4589 3352", balance: 0, cards: [] },
    devices: [],
};

function reducer(state, action) {
    switch (action.type) {
        case "SET_PAYMENT":
            return { ...state, payment: { ...state.payment, ...action.payload } };
        case "ADD_CARD":
            return { ...state, payment: { ...state.payment, cards: [...state.payment.cards, action.payload] } };
        case "SET_DEVICES":
            return { ...state, devices: action.payload };
        case "ADD_DEVICE":
            return { ...state, devices: [...state.devices, action.payload] };
        default:
            return state;
    }
}

export function SettingsProvider({ children }) {

    const [state, dispatch] = useReducer(reducer, initialState, undefined);
    const [activeModal, setActiveModal] = useState(null);
    const openModal = (name) => setActiveModal(name);
    const closeModal = () => setActiveModal(null);

    return (
        <SettingsContext.Provider value={{ state, dispatch, activeModal, openModal, closeModal }}>
            {children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => useContext(SettingsContext);
