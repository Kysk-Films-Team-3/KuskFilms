import React, { useState } from "react";
import PlayerOverlay from "../components/player/PlayerOverlay";
import "./MoviePage.css";

export const MoviePage = ({onCommentModalClick}) => {
    const [isPlayerOpen, setIsPlayerOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const movie = {
        id: 1,
        title: "Interstellar",
        description: "Життєствердна комедія про дружбу та подолання труднощів. Філіппу потрібен догляд, і серед усіх претендентів на посаду помічника він обирає молодого сенегальця Дріса з кримінальним минулим. Незважаючи на расові та класові відмінності, Філіпп і Дріс стають справжніми друзями та отримують новий досвід. Дивовижна й надихаюча історія, заснована на реальних подіях.\n" +
            "Сюжет\n" +
            "\n" +
            "Філіпп (Франсуа Клюзе) став інвалідом після невдалого польоту на параплані, він майже повністю паралізований і потребує постійного догляду. Але з кваліфікованими помічниками нелегко — Філіпп постійно відчуває їхню жалість до себе, що для заможного представника вищого класу Франції нестерпно.\n" +
            "Під час чергової співбесіди на посаду помічника увагу Філіппа привертає молодий і безцеремонний сенегалець Дріс (Омар Сі), якого він і запрошує на роботу. Дріс же прийшов на співбесіду, сподіваючись отримати відмову й далі отримувати допомогу по безробіттю. Він, на відміну від аристократичного Філіппа, живе в бідному кварталі Парижа, провів пів року у в’язниці, легко порушує закон. Але Філіпп обирає на випробувальний термін саме Дріса. Так хлопець з вулиці опиняється в розкішному особняку в центрі Парижа, де йому протягом місяця доведеться доглядати за Філіппом і виконувати його доручення.\n" +
            "Відсутність такту дозволяє Дрісу ставитися до Філіппа як до здорової людини: Дріс безкінечно жартує над своїм роботодавцем, не пропускаючи нагоди іронізувати щодо його інвалідності. Це саме те, що було потрібно Філіппу — відчувати себе звичайною людиною. Змінюється і сам Дріс, стаючи більш вдумливим і відповідальним.\n" +
            "Режисери Олів’є Накаш і Ерік Толедано зняли один з найуспішніших французьких фільмів, ґрунтуючись на історії життя Філіппа Поццо ді Борго, який залишився паралізованим після аварії.\n" +
            "\n" +
            "Причини подивитися\n" +
            "\n" +
            "• Франсуа Клюзе впорався з нетривіальним акторським завданням — зіграти людину, у якої рухаються тільки м’язи обличчя.\n" +
            "• Омар Сі отримав премію «Сезар» за найкращу чоловічу роль.\n" +
            "• Фільм про подолання класових упереджень користувався однаковою популярністю серед людей із різних соціальних прошарків.\n" +
            "• При бюджеті €9 500 000 картина зібрала $426 588 510 і стала другою за популярністю французькою стрічкою в історії.\n" +
            "\n" +
            "Цікаві факти\n" +
            "\n" +
            "• У реальному житті бізнесмена теж звати Філіпп. А от замість алжирця Абделя творці картини зробили другого головного героя сенегальцем Дрісом. Режисери бачили в ролі молодого й повного життя помічника тільки Омара Сі — його запросили в проєкт ще до завершення сценарію.\n" +
            "• Прототип головного героя, Філіпп Поццо ді Борго, наполягав на тому, щоб у фільмі було більше комедійного, ніж драматичного. Режисери перед початком зйомок особисто відвідали Філіппа Поццо ді Борго, і той брав активну участь у розробці майже кожної сцени.\n" +
            "• Оригінальна назва фільму «Недоторканні», ймовірно, відсилає до ідеї «непотрібних» для суспільства людей, один із яких паралізований, а другий не може знайти своє місце в житті.",
        poster: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1763737521/Frame_47800_1_bmszwf.png",
        postername: "https://res.cloudinary.com/da9jqs8yq/image/upload/v1763737519/image_6_b1kdg7.png"
    };


    return (
        <div className="movie_page">
            <div className="movie_page_poster">
                <img src={movie.poster} alt={movie.title} className="movie_poster" />
                <div className="movie_poster_content">
                    <img src={movie.postername} alt="" className="movie_postername" />
                    <div className="movie_poster_description">
                    <div className="movie_poster_rate_line">
                        <div className="movie_poster_rating">8.3</div>
                        <div className="movie_poster_date">2022</div>
                        <div className="movie_poster_end">•</div>
                        <div className="movie_poster_genre">Драма</div>
                        <div className="movie_poster_end">•</div>
                        <div className="movie_poster_time">66m</div>
                    </div>
                        <div className="movie_poster_details">
                        <div className="movie_details_line"> Cенегалець повертає радість життя паралізованому аристократу.</div>
                        <div className="movie_details_line"> Французька хітова комедія про дружбу</div>
                        </div>
                        <div className="movie_poster_info">
                            <div className="movie_poster_direct">Режисер: Мігель Сапочнік, Грег Яйтанс, Клер Кілнер</div>
                            <div className="movie_poster_actor">Актори: Педді Консідайн, Олівія Кук, Емма Д'Арсі, Метт Сміт, Стів Туссен, Ів Бест, Ріс Іванс, Соноя Мідзуно, Фаб'єн Франкель, Міллі Олкок, Емілі Кері, Райан Корр</div>
                        </div>
                        <div className="movie_submit">
                            <div className="movie_submit_price">15€/місяць</div>
                            <div className="movie_submit_subtitle">у підписці Kysk</div>
                        </div>
                    </div>
                    <div className="movie_poster_watch">
                    <button className="movie_watch_button" onClick={() => setIsPlayerOpen(true)}>Дивитися</button>
                    <button className="movie_trailer_button" onClick={() => setIsPlayerOpen(true)}>Трейлер</button>
                    <div className="movie_save_button" onClick={() => setIsPlayerOpen(true)}></div>
                    </div>
                </div>
            </div>

            {isPlayerOpen && (
                <PlayerOverlay
                    open={isPlayerOpen}
                    onClose={() => setIsPlayerOpen(false)}
                    hlsUrl="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
                />
            )}

            <div className="movie_description_block">
            <div className="movie_description_title">Опис</div>
                <div className="movie_description_title_line"></div>
            </div>
            <div className="movie_overview">
                <div className="movie_description_block_expand">
                    <p className={`movie_description_text ${expanded ? "open" : ""}`}>
                        {movie.description}
                    </p>

                    <div className="movie_description_block_toggle" onClick={() => setExpanded(!expanded)}>
                        {expanded ? "Згорнути" : "Детальний опис"}
                    </div>
                </div>
                <div className="movie_mark_block">
                    <div className="movie_mark_block_text">Поставте оцінку</div>
                    <div className="movie_mark_block_subtext">Оцінки покращують ваші рекомендації</div>
                        <div className="movie_marks"></div>
                    </div>
            </div>
            <div className="movie_reviews_block">
                <div className="movie_reviews_title">Відгуки</div>
                <button className="movie_reviews_button" onClick={onCommentModalClick}>Написати коментар</button>
            </div>
        </div>
    );
};
