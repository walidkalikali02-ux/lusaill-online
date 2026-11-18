"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Decorative, silent museum film for the company homepage.
 * The poster remains visible when video is unsupported, reduced motion is
 * requested, or the viewport is narrow. The hero's meaningful copy is HTML.
 */
export default function CompanyHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [canAnimate, setCanAnimate] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(
      "(min-width: 761px) and (prefers-reduced-motion: no-preference)"
    );
    const sync = () => setCanAnimate(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!canAnimate || !videoRef.current) return;
    const video = videoRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !document.hidden) {
          void video.play().catch(() => {
            // Autoplay can be blocked: the poster remains visible.
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 }
    );
    const onVisibilityChange = () => {
      if (document.hidden) video.pause();
      else if (video.getBoundingClientRect().bottom > 0) {
        void video.play().catch(() => {});
      }
    };
    observer.observe(video);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      video.pause();
    };
  }, [canAnimate]);

  return (
    <div className="company-hero-media" aria-hidden="true">
      {canAnimate && (
        <video
          ref={videoRef}
          className={ready ? "is-ready" : ""}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/museum/poster.jpg"
          onCanPlay={() => setReady(true)}
          onError={() => setReady(false)}
          tabIndex={-1}
        >
          <source src="/museum/hero.mp4" type="video/mp4" />
        </video>
      )}
      <div className="company-hero-shade" />
    </div>
  );
}
