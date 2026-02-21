"use client";

import {
  useEffect,
  useRef,
  useState,
  ReactNode,
  TouchEvent,
  WheelEvent,
} from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface ScrollExpandMediaProps {
  mediaImageSrc: string;
  title?: string;
  children?: ReactNode;
}

export const ScrollExpandMedia = ({
  mediaImageSrc,
  title,
  children,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
  const [touchStartY, setTouchStartY] = useState<number>(0);
  const [isMobileState, setIsMobileState] = useState<boolean>(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (mediaFullyExpanded && e.deltaY < 0 && globalThis.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollDelta = e.deltaY * 0.0009;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1,
        );
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0]?.clientY ?? 0);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return;

      const touchY = e.touches[0]?.clientY ?? 0;
      const deltaY = touchStartY - touchY;

      if (mediaFullyExpanded && deltaY < -20 && globalThis.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        // Increase sensitivity for mobile, especially when scrolling back
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005; // Higher sensitivity for scrolling back
        const scrollDelta = deltaY * scrollFactor;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1,
        );
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }

        setTouchStartY(touchY);
      }
    };

    const handleTouchEnd = (): void => {
      setTouchStartY(0);
    };

    const handleScroll = (): void => {
      if (!mediaFullyExpanded) {
        globalThis.scrollTo(0, 0);
      }
    };

    globalThis.addEventListener(
      "wheel",
      handleWheel as unknown as EventListener,
      {
        passive: false,
      },
    );
    globalThis.addEventListener("scroll", handleScroll as EventListener);
    globalThis.addEventListener(
      "touchstart",
      handleTouchStart as unknown as EventListener,
      { passive: false },
    );
    globalThis.addEventListener(
      "touchmove",
      handleTouchMove as unknown as EventListener,
      { passive: false },
    );
    globalThis.addEventListener("touchend", handleTouchEnd as EventListener);

    return () => {
      globalThis.removeEventListener(
        "wheel",
        handleWheel as unknown as EventListener,
      );
      globalThis.removeEventListener("scroll", handleScroll as EventListener);
      globalThis.removeEventListener(
        "touchstart",
        handleTouchStart as unknown as EventListener,
      );
      globalThis.removeEventListener(
        "touchmove",
        handleTouchMove as unknown as EventListener,
      );
      globalThis.removeEventListener(
        "touchend",
        handleTouchEnd as EventListener,
      );
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY]);

  useEffect(() => {
    const checkIfMobile = (): void => {
      setIsMobileState(window.innerWidth < 768);
    };

    checkIfMobile();
    globalThis.addEventListener("resize", checkIfMobile);

    return () => globalThis.removeEventListener("resize", checkIfMobile);
  }, []);

  // Calculate width first, then height to maintain 16:9 aspect ratio when fully expanded
  const initialWidth = isMobileState ? 300 : 450;
  const initialHeight = isMobileState ? 270 : 400;

  // Target dimensions for 16:9 aspect ratio when fully expanded
  // Match the native image resolution (1920x1080) for desktop
  const targetWidth = isMobileState ? 390 : 1920;
  const targetHeight = targetWidth * (9 / 16); // Maintain 16:9 ratio

  const mediaWidth =
    initialWidth + scrollProgress * (targetWidth - initialWidth);
  const mediaHeight =
    initialHeight + scrollProgress * (targetHeight - initialHeight);

  return (
    <div
      ref={sectionRef}
      className="transition-colors duration-700 ease-in-out overflow-x-hidden"
    >
      <section className="relative flex flex-col items-center justify-start min-h-dvh">
        <div className="relative w-full flex flex-col items-center min-h-dvh">
          {/* Gradient Background */}
          <div className="absolute inset-0 z-0 h-full">
            <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-background to-highlight/20" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-highlight/10 rounded-full blur-3xl animate-pulse" />
          </div>

          <div className="container mx-auto flex flex-col items-center justify-start relative z-10">
            <div className="flex flex-col items-center justify-center w-full h-dvh relative">
              <motion.div
                className="absolute z-0 top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-none"
                style={{
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  ...(isMobileState
                    ? {}
                    : { maxWidth: "72vw", maxHeight: "85vh" }),
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden flex flex-col items-center justify-center p-8 gap-6">
                  {/* Media Image Background */}
                  <div className="absolute inset-0">
                    <Image
                      src={mediaImageSrc}
                      alt={title || "Event"}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-black/40" />
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.section
              className="flex flex-col w-full px-8 py-10 md:px-16 lg:py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              {children}
            </motion.section>
          </div>
        </div>
      </section>
    </div>
  );
};
