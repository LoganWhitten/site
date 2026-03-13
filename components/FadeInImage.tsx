"use client";

import { useState, useRef, useEffect } from 'react';

export default function FadeInImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setLoaded(true);
    }
  }, []);

  return (
    <img
      {...props}
      ref={imgRef}
      style={{
        ...props.style,
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
      }}
      onLoad={(e) => {
        setLoaded(true);
        if (props.onLoad) props.onLoad(e);
      }}
    />
  );
}