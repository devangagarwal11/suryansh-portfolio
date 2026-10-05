"use client";

import { useCallback, useEffect, useRef, useState, type RefObject, type SyntheticEvent } from "react";

/**
 * Small controller for an embedded YouTube iframe (enablejsapi=1).
 *
 * YouTube ignores commands sent before the player is ready, which is why
 * "play on hover" embeds often get stuck or start late. This hook does the
 * official "listening" handshake, remembers the last requested state, and
 * applies it as soon as the player reports it is ready.
 */
export function useYouTubePlayer(iframeRef: RefObject<HTMLIFrameElement | null>) {
  const readyRef = useRef(false);
  const wantPlayRef = useRef(false);
  const wantMutedRef = useRef(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const send = useCallback(
    (func: string, args: unknown[] = []) => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func, args }),
        "*"
      );
    },
    [iframeRef]
  );

  const applyWanted = useCallback(() => {
    send(wantMutedRef.current ? "mute" : "unMute");
    send(wantPlayRef.current ? "playVideo" : "pauseVideo");
  }, [send]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (typeof event.data !== "string") return;
      let msg: { event?: string; info?: unknown };
      try {
        msg = JSON.parse(event.data);
      } catch {
        return;
      }
      if (msg.event === "onReady" || (msg.event === "initialDelivery" && !readyRef.current)) {
        readyRef.current = true;
        applyWanted();
      }
      // playerState: 1 = playing, 2 = paused, 0 = ended, 3 = buffering
      let state: number | undefined;
      if (msg.event === "onStateChange" && typeof msg.info === "number") state = msg.info;
      if (msg.event === "infoDelivery" && msg.info && typeof msg.info === "object") {
        const s = (msg.info as { playerState?: unknown }).playerState;
        if (typeof s === "number") state = s;
      }
      if (state !== undefined) {
        if (!readyRef.current) {
          readyRef.current = true;
          applyWanted();
        }
        setIsPlaying(state === 1);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [iframeRef, applyWanted]);

  /** Call from the iframe's onLoad: starts the handshake. */
  const onIframeLoad = useCallback(() => {
    readyRef.current = false;
    const hello = () =>
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "listening", id: 1, channel: "widget" }),
        "*"
      );
    hello();
    // Retry a couple of times; the player script may not be listening yet.
    window.setTimeout(hello, 400);
    window.setTimeout(() => {
      hello();
      // Fallback if no ready event arrives (older players): just apply.
      if (!readyRef.current) applyWanted();
    }, 1200);
  }, [iframeRef, applyWanted]);

  const play = useCallback(() => {
    wantPlayRef.current = true;
    if (readyRef.current) send("playVideo");
  }, [send]);

  const pause = useCallback(() => {
    wantPlayRef.current = false;
    if (readyRef.current) send("pauseVideo");
  }, [send]);

  const setMuted = useCallback(
    (muted: boolean) => {
      wantMutedRef.current = muted;
      if (readyRef.current) send(muted ? "mute" : "unMute");
    },
    [send]
  );

  const seekTo = useCallback((seconds: number) => send("seekTo", [seconds, true]), [send]);

  /** Reset when the iframe's video changes (new src). */
  const reset = useCallback(() => {
    readyRef.current = false;
    setIsPlaying(false);
  }, []);

  return { play, pause, setMuted, seekTo, send, onIframeLoad, isPlaying, reset };
}

/** True for a real mouse/trackpad (not touch). */
export const isMousePointer = (e: { pointerType?: string }) => e.pointerType === "mouse";

/**
 * YouTube thumbnail with automatic fallback: maxresdefault does not exist for
 * every video (YouTube then returns a 120px grey placeholder), so drop to hqdefault.
 */
export const ytThumb = (videoId: string, quality: "maxresdefault" | "hqdefault" = "maxresdefault") =>
  `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;

export function onThumbLoad(e: SyntheticEvent<HTMLImageElement>, videoId: string) {
  const img = e.currentTarget;
  if (img.naturalWidth <= 120 && !img.src.includes("hqdefault")) {
    img.src = ytThumb(videoId, "hqdefault");
  }
}
