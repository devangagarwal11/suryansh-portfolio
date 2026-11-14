"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// three.js is big, so the 3D cursor is loaded off the critical path: only on mouse/trackpad
// devices, and only once the page has finished loading and the browser is idle.
const CustomCursor = dynamic(() => import("./CustomCursor").then((m) => m.CustomCursor), { ssr: false });

export function CursorLoader() {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const go = () => {
      const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
        .requestIdleCallback;
      if (idle) idle(() => setLoad(true), { timeout: 1500 });
      else setTimeout(() => setLoad(true), 300);
    };
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => window.removeEventListener("load", go);
  }, []);

  return load ? <CustomCursor /> : null;
}
