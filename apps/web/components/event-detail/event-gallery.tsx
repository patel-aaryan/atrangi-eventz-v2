"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Button } from "@atrangi/ui";
import type { GalleryImage } from "@atrangi/types";

interface EventGalleryProps {
  images: GalleryImage[];
  eventTitle: string;
}

export function EventGallery({
  images,
  eventTitle,
}: Readonly<EventGalleryProps>) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (selectedIndex === null) {
      document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedIndex]);

  const openLightbox = (index: number) => setSelectedIndex(index);

  const closeLightbox = () => setSelectedIndex(null);

  const goToPrevious = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(
      selectedIndex === 0 ? images.length - 1 : selectedIndex - 1
    );
  };

  const goToNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(
      selectedIndex === images.length - 1 ? 0 : selectedIndex + 1
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "ArrowRight") goToNext();
  };

  if (images.length === 0) return null;

  return (
    <section className="py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-8">
          <span className="bg-linear-to-r from-primary to-highlight bg-clip-text text-transparent">
            Event Gallery
          </span>
        </h2>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={image.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group flex items-center justify-center"
              onClick={() => openLightbox(index)}
            >
              <Image
                src={image.url}
                alt={`${eventTitle} - ${image.name}`}
                width={400}
                height={400}
                className="object-contain transition-transform duration-300 group-hover:scale-110 w-full h-full"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="dialog"
            aria-label="Image lightbox"
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
              onClick={closeLightbox}
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Previous Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 z-50 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>

            {/* Image */}
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-[90vw] max-h-[90vh] aspect-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selectedIndex].url}
                alt={`${eventTitle} - ${images[selectedIndex].name}`}
                width={1920}
                height={1080}
                className="object-contain max-h-[90vh] w-auto"
                priority
              />
            </motion.div>

            {/* Next Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 z-50 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
            >
              <ChevronRight className="w-8 h-8" />
            </Button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
