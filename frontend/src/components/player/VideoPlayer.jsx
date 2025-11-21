import React, { forwardRef, useEffect } from "react";
import Hls from "hls.js";

export const VideoPlayer = forwardRef(({ src }, ref) => {
    useEffect(() => {
        const video = ref.current;
        if (!video) return;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
        } else if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);
        } else {
            video.src = src;
        }
    }, [src]);

    return (
        <video
            ref={ref}
            className="video-element"
            autoPlay
            playsInline
            controls={false}
        />
    );
});


