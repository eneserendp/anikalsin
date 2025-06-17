"use client";
import Image from "next/image";
import { useState } from "react";

const images = [
  "/gallery/1.jpg",
  "/gallery/2.jpg",
  "/gallery/3.jpg",
  "/gallery/4.jpg",
  "/gallery/5.jpg",
];

export default function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section className="w-full max-w-4xl mx-auto py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-pink-600 tracking-tight">Fotoğraf Galerisi</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {images.map((src, i) => (
          <button
            key={src}
            className="group relative overflow-hidden rounded-lg shadow-lg focus:outline-none"
            onClick={() => setSelected(i)}
            aria-label="Fotoğrafı büyüt"
          >
            <Image
              src={src}
              alt={`Düğün fotoğrafı ${i + 1}`}
              width={400}
              height={500}
              className="object-cover w-full h-48 group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute inset-0 bg-pink-200 opacity-0 group-hover:opacity-20 transition-opacity" />
          </button>
        ))}
      </div>
      {/* Lightbox */}
      {selected !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div className="relative max-w-2xl w-full p-4" onClick={e => e.stopPropagation()}>
            <Image
              src={images[selected]}
              alt={`Düğün fotoğrafı ${selected + 1}`}
              width={800}
              height={1000}
              className="object-contain w-full max-h-[80vh] rounded-lg shadow-2xl"
            />
            <button
              className="absolute top-2 right-2 bg-white/80 rounded-full p-2 hover:bg-pink-200 transition-colors"
              onClick={() => setSelected(null)}
              aria-label="Kapat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-pink-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
} 