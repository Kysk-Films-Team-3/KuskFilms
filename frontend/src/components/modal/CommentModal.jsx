import { useState, useEffect, useRef } from "react";
import "./CommentModal.css";
import { Trans, useTranslation } from "react-i18next";

export const CommentModal = ({ isOpen, onClose }) => {
    const commentRef = useRef(null);
    const [rating, setRating] = useState(null);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const { t } = useTranslation();

    useEffect(() => {
        if (!isOpen) return;
        
        const handleClickOutside = (event) => {
            if (commentRef.current && !commentRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="comment_overlay">
            <div className="comment_modal" ref={commentRef}>

                <button className="comment_close" onClick={onClose}>×</button>

                <h2 className="comment_title"><Trans i18nKey="commentModal.title" /></h2>

                <div className="comment_rating_section">
                    <div className="comment_section_label"><Trans i18nKey="commentModal.ratingLabel" /></div>
                    {rating !== null && (
                        <button 
                            className="comment_rating_delete"
                            onClick={() => setRating(null)}
                        >
                            <Trans i18nKey="commentModal.delete" />
                        </button>
                    )}
                </div>
                <div className="comment_stars">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <button
                            key={i}
                            className={`comment_star ${rating !== null && rating >= i + 1 ? "active" : ""} ${hoveredRating >= i + 1 ? "hovered" : ""}`}
                            onClick={() => setRating(i + 1)}
                            onMouseEnter={() => setHoveredRating(i + 1)}
                            onMouseLeave={() => setHoveredRating(0)}
                            aria-label={`Rate ${i + 1}`}
                        >
                            <span className="comment_star_number">{i + 1}</span>
                        </button>
                    ))}
                </div>

                <div className="comment_section_label"><Trans i18nKey="commentModal.titleLabel" /></div>
                <input
                    className="comment_input"
                    placeholder={t("commentModal.titlePlaceholder")}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={60}
                />
                <div className="comment_counter">{title.length}/60</div>
                <div className="comment_section_label"><Trans i18nKey="commentModal.commentLabel" /></div>
                <textarea
                    className="comment_textarea"
                    placeholder={t("commentModal.commentPlaceholder")}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={120}
                />
                <div className="comment_counter">{text.length}/120</div>

                <ul className="comment_rules">
                    <li><Trans i18nKey="commentModal.rule1" /></li>
                    <li><Trans i18nKey="commentModal.rule2" /></li>
                    <li><Trans i18nKey="commentModal.rule3" /></li>
                </ul>

                <div className="comment_submit_wrap">
                    <button className="comment_submit">
                        <Trans i18nKey="commentModal.submit" />
                    </button>
                </div>
            </div>
        </div>
    );
};
