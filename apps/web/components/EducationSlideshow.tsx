"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { educationPhotos } from "@/lib/education-photos";

export default function EducationSlideshow({ locale }: { locale: string }) {
  const ja = locale === "ja";
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});
  const container = useRef<HTMLDivElement>(null);
  const photo = educationPhotos[active];
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPlaying(!motion.matches);
    const stopForMotion = () => {
      if (motion.matches) setPlaying(false);
    };
    motion.addEventListener("change", stopForMotion);
    const syncVisibility = () => setPageVisible(!document.hidden);
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.25 },
    );
    if (container.current) observer.observe(container.current);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", stopForMotion);
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, []);
  useEffect(() => {
    if (!playing || !visible || !pageVisible || hovered || !loaded[active])
      return;
    const timer = window.setTimeout(
      () => setActive((i) => (i + 1) % educationPhotos.length),
      6000,
    );
    return () => window.clearTimeout(timer);
  }, [active, playing, visible, pageVisible, hovered, loaded]);
  function select(index: number) {
    setPlaying(false);
    setActive((index + educationPhotos.length) % educationPhotos.length);
  }
  const title = ja ? photo.ja : photo.name;
  return (
    <div
      ref={container}
      className="education-slideshow"
      role="region"
      aria-roledescription={ja ? "スライドショー" : "carousel"}
      aria-label={ja ? "学びの場を巡る" : "Places that shaped my perspective"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={(event) => {
        if (!(event.target as HTMLElement).closest(".education-play"))
          setPlaying(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          select(active + 1);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          select(active - 1);
        }
      }}
    >
      <div className="education-photo-stage" id="education-photo-stage">
        {educationPhotos.map((item, index) => (
          <div
            key={item.id}
            className={`education-photo ${active === index ? "is-current" : ""}`}
            aria-hidden={active !== index}
          >
            {(index === 0 ||
              (visible &&
                (index === active ||
                  index === (active + 1) % educationPhotos.length ||
                  loaded[index]))) && (
              <Image
                src={item.src}
                alt={ja ? item.altJa : item.alt}
                fill
                sizes="(max-width: 700px) 100vw, 75vw"
                loading={index === active ? "eager" : "lazy"}
                onLoad={() =>
                  setLoaded((previous) =>
                    previous[index] ? previous : { ...previous, [index]: true },
                  )
                }
                style={{ objectPosition: item.position }}
              />
            )}
          </div>
        ))}
        <div className="education-photo-label">
          <span>{ja ? "学びの旅" : "A journey in learning"}</span>
          <span>{String(active + 1).padStart(2, "0")} / 07</span>
        </div>
      </div>
      <div className="education-photo-story">
        <div aria-live={playing ? "off" : "polite"} aria-atomic="true">
          <p className="campus-eyebrow">{photo.location}</p>
          <h3>{title}</h3>
          <p>{ja ? photo.captionJa : photo.caption}</p>
        </div>
        <div className="education-photo-controls">
          <button
            type="button"
            aria-label={ja ? "前の写真" : "Previous photograph"}
            onClick={() => select(active - 1)}
          >
            ←
          </button>
          <button
            type="button"
            className="education-play"
            onClick={() => setPlaying((value) => !value)}
            aria-label={
              playing
                ? ja
                  ? "スライドショーを一時停止"
                  : "Pause slideshow"
                : ja
                  ? "スライドショーを再生"
                  : "Play slideshow"
            }
          >
            {playing
              ? ja
                ? "Ⅱ 一時停止"
                : "Ⅱ Pause"
              : ja
                ? "▷ 再生"
                : "▷ Play"}
          </button>
          <button
            type="button"
            aria-label={ja ? "次の写真" : "Next photograph"}
            onClick={() => select(active + 1)}
          >
            →
          </button>
        </div>
        <p className="education-timing">
          {ja ? "6秒ごとに切り替わります" : "A new perspective every 6 seconds"}
        </p>
        <div className="education-photo-credit">
          <span>{ja ? "表示に合わせてトリミング" : "Cropped to fit"}</span>
          <a href={photo.source} target="_blank" rel="noreferrer">
            {photo.credit} ↗
          </a>
          {photo.licenseUrl && (
            <a href={photo.licenseUrl} target="_blank" rel="noreferrer">
              {photo.license}
            </a>
          )}
        </div>
      </div>
      <div
        className="education-photo-selectors"
        aria-label={ja ? "学校を選ぶ" : "Choose an institution"}
      >
        {educationPhotos.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-controls="education-photo-stage"
            aria-current={index === active ? "true" : undefined}
            onClick={() => select(index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {item.short}
          </button>
        ))}
      </div>
    </div>
  );
}
