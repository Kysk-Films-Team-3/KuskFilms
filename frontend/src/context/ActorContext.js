import React, { createContext, useState } from 'react';

export const ActorContext = createContext();

export const ActorProvider = ({ children }) => {
    const [selectedActor, setSelectedActor] = useState(null);

    const selectActor = (actor) => setSelectedActor(actor);
    const clearActor = () => setSelectedActor(null);

    return (
        <ActorContext.Provider value={{ selectedActor, selectActor, clearActor }}>
            {children}
        </ActorContext.Provider>
    );
};
