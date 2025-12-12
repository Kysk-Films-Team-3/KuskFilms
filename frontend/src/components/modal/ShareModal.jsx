import React, { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import './ShareModal.css';

export const ShareModal = ({ isOpen, onClose, filmTitle, filmTitleKey, filmId }) => {
    const shareRef = useRef(null);
    const [copied, setCopied] = useState(false);
    const { t } = useTranslation();
    
    const currentUrl = window.location.origin + (filmId ? `/movie/${filmId}` : '/');
    const shareText = filmTitleKey ? `${t(filmTitleKey)} - KyskFilms` : (filmTitle ? `${filmTitle} - KyskFilms` : 'KyskFilms');

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
        navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    const shareToSocial = (platform) => {
        const encodedUrl = encodeURIComponent(currentUrl);
        const encodedText = encodeURIComponent(shareText);
        
        const urls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
            telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`
        };

        if (urls[platform]) {
            window.open(urls[platform], '_blank', 'width=600,height=400');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="share_overlay" role="dialog" aria-modal="true">
            <div className="share_modal" ref={shareRef}>
                <div className="share_close" onClick={onClose}></div>

                <div className="share_title">
                    <Trans i18nKey="tooltip.share" />
                </div>

                <div className="share_content">
                    <div className="share_url_block">
                        <input
                            type="text"
                            className="share_url_input"
                            value={currentUrl}
                            readOnly
                        />
                        <button
                            className={`share_copy_btn ${copied ? 'copied' : ''}`}
                            onClick={copyToClipboard}
                        >
                            {copied ? <Trans i18nKey="share.copied" /> : <Trans i18nKey="share.copy" />}
                        </button>
                    </div>

                    <div className="share_social_title">
                        <Trans i18nKey="share.shareTo" />
                    </div>

                    <div className="share_social_buttons">
                        <button
                            className="share_social_btn facebook"
                            onClick={() => shareToSocial('facebook')}
                        >
                            <div className="share_social_icon facebook_icon"></div>
                            <span><Trans i18nKey="share.facebook" /></span>
                        </button>
                        <button
                            className="share_social_btn twitter"
                            onClick={() => shareToSocial('twitter')}
                        >
                            <div className="share_social_icon twitter_icon"></div>
                            <span><Trans i18nKey="share.twitter" /></span>
                        </button>
                        <button
                            className="share_social_btn telegram"
                            onClick={() => shareToSocial('telegram')}
                        >
                            <div className="share_social_icon telegram_icon"></div>
                            <span><Trans i18nKey="share.telegram" /></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

