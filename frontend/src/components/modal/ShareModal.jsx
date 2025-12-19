import React, { useEffect, useRef, useState } from 'react';
import { getShareTitleData } from '../../services/api';
import './ShareModal.css';

export const ShareModal = ({ isOpen, onClose, filmId }) => {
    const shareRef = useRef(null);
    const [copied, setCopied] = useState(false);
    const [shareData, setShareData] = useState(null);

    useEffect(() => {
        if (!isOpen || !filmId) return;

        const loadShareData = async () => {
            try {
                const data = await getShareTitleData(filmId);
                setShareData(data);
            } catch (err) {
            }
        };

        loadShareData();
    }, [isOpen, filmId]);

    useEffect(() => {
        if (!isOpen) return;
        
        const handleClickOutside = (event) => {
            if (shareRef.current && !shareRef.current.contains(event.target)) {
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

    const copyToClipboard = () => {
        if (!shareData) return;
        navigator.clipboard.writeText(shareData.shareUrl);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    const shareToSocial = (platform) => {
        if (!shareData) return;
        
        const url = shareData.socialLinks[platform];
        if (url) {
            window.open(url, '_blank', 'width=600,height=400');
            onClose();
        }
    };

    if (!isOpen) return null;

    if (!shareData) {
        return (
            <div className="share_overlay" role="dialog" aria-modal="true">
                <div className="share_modal" ref={shareRef}>
                    <div>Завантаження...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="share_overlay" role="dialog" aria-modal="true">
            <div className="share_modal" ref={shareRef}>
                <div className="share_close" onClick={onClose}></div>

                <div className="share_title">
                    {shareData.ui.modalTitle}
                </div>

                {shareData.contentTitle && (
                    <div className="share_content_title">
                        {shareData.contentTitle}
                    </div>
                )}

                {shareData.shareMessage && (
                    <div className="share_message">
                        {shareData.shareMessage}
                    </div>
                )}

                <div className="share_content">
                    <div className="share_url_block">
                        <input
                            type="text"
                            className="share_url_input"
                            value={shareData.shareUrl}
                            readOnly
                        />
                        <button
                            className={`share_copy_btn ${copied ? 'copied' : ''}`}
                            onClick={copyToClipboard}
                        >
                            {copied ? shareData.ui.copiedState : shareData.ui.copyButton}
                        </button>
                    </div>

                    <div className="share_social_title">
                        {shareData.ui.shareToLabel}
                    </div>

                    <div className="share_social_buttons">
                        <button
                            className="share_social_btn facebook"
                            onClick={() => shareToSocial('facebook')}
                        >
                            <div className="share_social_icon facebook_icon"></div>
                            <span>{shareData.ui.facebookLabel}</span>
                        </button>
                        <button
                            className="share_social_btn twitter"
                            onClick={() => shareToSocial('twitter')}
                        >
                            <div className="share_social_icon twitter_icon"></div>
                            <span>{shareData.ui.twitterLabel}</span>
                        </button>
                        <button
                            className="share_social_btn telegram"
                            onClick={() => shareToSocial('telegram')}
                        >
                            <div className="share_social_icon telegram_icon"></div>
                            <span>{shareData.ui.telegramLabel}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

