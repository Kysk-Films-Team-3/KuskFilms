import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PlayerOverlay from "../components/player/PlayerOverlay";
import "./MoviePage.css";

export const MoviePage = () => {
    const { id } = useParams();
    const [isPlayerOpen, setIsPlayerOpen] = useState(false);

    const [filmData, setFilmData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fallbackMovie = {
        id,
        title: `Фільм №${id}`,
        description: "Тут буде опис фільму з бекенду, коли ендпоінт буде готовий.",
        poster: "https://placehold.co/600x900/000000/FFFFFF/png?text=Poster"
    };

    useEffect(() => {
        async function loadFilm() {
            try {
                const res = await fetch(`http://localhost:8081/api/film/${id}`);

                if (!res.ok) throw new Error("Помилка сервера");

                const data = await res.json();
                setFilmData(data);
            } catch (e) {
                setFilmData(null);
                setError("Наразі дані завантажити не вдалося — використовую заглушку.");
            } finally {
                setLoading(false);
            }
        }

        loadFilm();
    }, [id]);

    const movie = filmData || fallbackMovie;

    return (
        <div className="movie_page">

            <div className="movie_header">
                <img src={movie.poster} alt={movie.title} className="poster" />

                <div className="info">
                    <h1 className="title">{movie.title}</h1>
                    <p className="desc">{movie.description}</p>

                    <button className="watchBtn" onClick={() => setIsPlayerOpen(true)}>
                        ▶ Дивитися
                    </button>

                    {error && (
                        <div className="error_text">
                            {error}
                        </div>
                    )}
                </div>
            </div>

            <div style={{ marginTop: "50px", color: "white", fontSize: "22px" }}>
                Це фільм з ID: <b>{id}</b>
            </div>

            {isPlayerOpen && (
                <PlayerOverlay
                    open={isPlayerOpen}
                    onClose={() => setIsPlayerOpen(false)}
                    hlsUrl="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
                />
            )}
        </div>
    );
};
