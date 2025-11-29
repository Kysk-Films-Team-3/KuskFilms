import { useState } from "react";
import "./CommentModal.css";

export const CommentModal = ({ isOpen, onClose }) => {

    const [rating, setRating] = useState(null);
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");

    if (!isOpen) return null;

    return (
        <div className="comment_overlay">
            <div className="comment_modal">

                <button className="comment_close" onClick={onClose}>×</button>

                <h2 className="comment_title">Написати коментар</h2>

                <div className="comment_section_label">Поставте оцінку</div>
                <div className="comment_stars">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div
                            key={i}
                            className={`comment_star ${rating === i + 1 ? "active" : ""}`}
                            onClick={() => setRating(i + 1)}
                        >
                            {i + 1}
                        </div>
                    ))}
                </div>

                <div className="comment_section_label">Заголовок</div>
                <input
                    className="comment_input"
                    placeholder="Мені дуже сподоба..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={60}
                />
                <div className="comment_counter">{title.length}/60</div>
                <div className="comment_section_label">Коментар</div>
                <textarea
                    className="comment_textarea"
                    placeholder="Мені дуже сподоба..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={120}
                />
                <div className="comment_counter">{text.length}/120</div>

                <ul className="comment_rules">
                    <li>Будьте ввічливими</li>
                    <li>Не публікуйте спойлери</li>
                    <li>Заборонено спам і рекламу</li>
                </ul>

                <div className="comment_submit_wrap">
                    <button className="comment_submit">
                        Надіслати коментар
                    </button>
                </div>
            </div>
        </div>
    );
};
