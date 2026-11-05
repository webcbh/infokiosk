import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../App';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  className?: string;
  key?: string | number;
}

const transparentPixel = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";

export function LazyImage({ src, alt, className, ...props }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Reset state if src changes
    setIsLoaded(false);
  }, [src]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px', // start loading slightly before it enters viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <img
      ref={imgRef}
      src={isInView ? src : transparentPixel}
      alt={alt || ""}
      className={cn(
        "transition-all duration-[800ms] ease-out",
        (!isInView || !isLoaded) ? "opacity-0 blur-xl scale-110" : "opacity-100 blur-0 scale-100",
        className
      )}
      onLoad={() => setIsLoaded(true)}
      {...props}
    />
  );
}
