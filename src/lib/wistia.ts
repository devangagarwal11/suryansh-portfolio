"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

/**
 * Wistia player support (hosted videos that are not on YouTube).
 *
 * Cards use Wistia's JavaScript embed (E-v1.js) so the page can start, stop
 * and mute the preview exactly like the YouTube cards do. The full-screen
 * player uses Wistia's plain iframe embed with its normal controls.
 */

interface WistiaVideo {
  container: HTMLElement;
  play(): void;
  pause(): void;
  mute(): void;
  unmute(): void;
  bind(event: string, callback: () => void): void;
  unbind(event: string, callback: () => void): void;
}

type WistiaQueueItem = Record<string, unknown>;

declare global {
  interface Window {
    _wq?: WistiaQueueItem[];
  }
}

const WISTIA_SCRIPT = "https://fast.wistia.com/assets/external/E-v1.js";

function wistiaQueue(): WistiaQueueItem[] {
  window._wq = window._wq || [];
  if (!document.querySelector(`script[src="${WISTIA_SCRIPT}"]`)) {
    const script = document.createElement("script");
    script.src = WISTIA_SCRIPT;
    script.async = true;
    document.head.appendChild(script);
  }
  return window._wq;
}

/**
 * Preview embed options: muted, looping, no Wistia controls (the card draws
 * its own play hint and sound button), filling the card like object-cover.
 */
const PREVIEW_OPTIONS = {
  autoPlay: false,
  muted: true,
  silentAutoPlay: "allow",
  endVideoBehavior: "loop",
  fitStrategy: "cover",
  videoFoam: false,
  controlsVisibleOnLoad: false,
  playbar: false,
  playButton: false,
  smallPlayButton: false,
  volumeControl: false,
  fullscreenButton: false,
  settingsControl: false,
  playPauseNotifier: false,
  copyLinkAndThumbnailEnabled: false,
  seo: false,
};

/** Class names for a preview container: `<div ref={...} className={wistiaEmbedClass(id)} />`. */
export const wistiaEmbedClass = (mediaId: string) =>
  `wistia_embed wistia_async_${mediaId} videoFoam=false`;

/** Full player (cinema modal): Wistia's own controls, starts playing. */
export const wistiaIframeSrc = (mediaId: string) =>
  `https://fast.wistia.net/embed/iframe/${mediaId}?autoPlay=true&videoFoam=false&fitStrategy=contain&copyLinkAndThumbnailEnabled=false&seo=false`;

/**
 * Controller for one Wistia preview embed. Same shape as useYouTubePlayer:
 * remembers the requested play/mute state and applies it once the player is
 * ready, so hovering before the player has loaded still works.
 *
 * `enabled` should become true when the embed container is rendered.
 */
export function useWistiaPlayer(
  containerRef: RefObject<HTMLElement | null>,
  mediaId: string | undefined,
  enabled: boolean
) {
  const videoRef = useRef<WistiaVideo | null>(null);
  const wantPlayRef = useRef(false);
  const wantMutedRef = useRef(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!enabled || !mediaId) return;
    const queue = wistiaQueue();

    const onPlay = () => setIsPlaying(true);
    const onStop = () => setIsPlaying(false);

    queue.push({ id: mediaId, options: PREVIEW_OPTIONS });

    // "_all" + a container check, so two embeds of the same video on one page
    // never control each other.
    const handle = {
      id: "_all",
      onReady: (video: WistiaVideo) => {
        if (!containerRef.current || !containerRef.current.contains(video.container)) return;
        videoRef.current = video;
        video.bind("play", onPlay);
        video.bind("pause", onStop);
        video.bind("end", onStop);
        if (wantMutedRef.current) video.mute();
        else video.unmute();
        if (wantPlayRef.current) video.play();
      },
    };
    queue.push(handle);

    return () => {
      const video = videoRef.current;
      if (video) {
        video.unbind("play", onPlay);
        video.unbind("pause", onStop);
        video.unbind("end", onStop);
      }
      videoRef.current = null;
      setIsPlaying(false);
      queue.push({ revoke: handle });
    };
  }, [containerRef, mediaId, enabled]);

  const play = useCallback(() => {
    wantPlayRef.current = true;
    videoRef.current?.play();
  }, []);

  const pause = useCallback(() => {
    wantPlayRef.current = false;
    videoRef.current?.pause();
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    wantMutedRef.current = muted;
    const video = videoRef.current;
    if (!video) return;
    if (muted) video.mute();
    else video.unmute();
  }, []);

  return { play, pause, setMuted, isPlaying };
}
