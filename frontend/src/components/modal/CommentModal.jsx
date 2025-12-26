import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./CommentModal.css";
import { getTitleComments } from "../../services/api";

export const CommentModal = ({ isOpen, onClose }) => {
    const commentRef = useRef(null);
    const location = useLocation();
    const [rating, setRating] = useState(null);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [commentsData, setCommentsData] = useState(null);
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        const loadComments = async () => {
            if (!isOpen) return;
            
            const titleIdMatch = location.pathname.match(/\/movie\/(\d+)/);
            if (!titleIdMatch) {
                setCommentsData(null);
                return;
            }

            const titleId = parseInt(titleIdMatch[1]);
            if (!titleId) return;

            try {
                setLoading(true);
                const data = await getTitleComments(titleId);
                setCommentsData(data);
            } catch (error) {
                setCommentsData(null);
            } finally {
                setLoading(false);
            }
        };

        loadComments();
    }, [isOpen, location.pathname]);

    if (!isOpen) return null;

    if (loading) {
        return (
            <div className="comment_overlay">
                <div className="comment_modal" ref={commentRef}>
                    <button className="comment_close" onClick={onClose}></button>
                    <p></p>
                </div>
            </div>
        );
    }

    return (
        <div className="comment_overlay">
            <div className="comment_modal" ref={commentRef}>

                <button className="comment_close" onClick={onClose}></button>

                <h2 className="comment_title">{commentsData?.ui?.writeCommentTitle || ''}</h2>

                <div className="comment_rating_section">
                    <div className="comment_section_label">{commentsData?.ui?.rateLabel || ''}</div>
                    {rating !== null && (
                        <button 
                            className="comment_rating_delete"
                            onClick={() => setRating(null)}
                        >
                            {commentsData?.ui?.deleteButton || ''}
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

                <div className="comment_section_label">{commentsData?.ui?.placeholderTitle || ''}</div>
                <input
                    className="comment_input"
                    placeholder={commentsData?.ui?.placeholderTitle || ''}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={60}
                />
                <div className="comment_counter">{title.length}/60</div>
                <div className="comment_section_label">{commentsData?.ui?.placeholderText || ''}</div>
                <textarea
                    className="comment_textarea"
                    placeholder={commentsData?.ui?.placeholderText || ''}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={120}
                />
                <div className="comment_counter">{text.length}/120</div>

                {commentsData?.ui?.rules && commentsData.ui.rules.length > 0 && (
                    <ul className="comment_rules">
                        {commentsData.ui.rules.map((rule, index) => (
                            <li key={index}>{rule}</li>
                        ))}
                    </ul>
                )}

                <div className="comment_submit_wrap">
                    <button className="comment_submit">
                        {commentsData?.ui?.submitButton || ''}
                    </button>
                </div>

                {commentsData?.comments && commentsData.comments.length > 0 && (
                    <div className="comment_list">
                        {commentsData.comments.map((comment) => (
                            <div key={comment.id} className="comment_item">
                                <div className="comment_item_header">
                                    {comment.avatarUrl && (
                                        <img src={comment.avatarUrl} alt={comment.username || 'User'} className="comment_item_avatar" />
                                    )}
                                    <div className="comment_item_info">
                                        <div className="comment_item_author">{comment.username || 'Користувач'}</div>
                                        <div className="comment_item_date">
                                            {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString('uk-UA') : ''}
                                        </div>
                                    </div>
                                    {comment.rating && (
                                        <div className="comment_item_rating">{comment.rating}</div>
                                    )}
                                </div>
                                <div className="comment_item_text">{comment.text}</div>
                                {comment.isMyComment && (
                                    <button className="comment_item_delete">
                                        {commentsData?.ui?.deleteButton || ''}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
