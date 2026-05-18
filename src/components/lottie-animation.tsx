"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";

type LottieAnimationProps = {
  src: string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export function LottieAnimation({ src, loop = true, autoplay = true, className, style }: LottieAnimationProps) {
  const [animationData, setAnimationData] = useState<unknown>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) return;
    let cancelled = false;
    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => { if (!cancelled) setAnimationData(data); })
      .catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, [src]);

  if (error) return null;
  if (!animationData) return null;

  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      autoplay={autoplay}
      className={className}
      style={style}
    />
  );
}
