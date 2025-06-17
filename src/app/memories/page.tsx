"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from 'react';
import CustomAudioPlayer from "../../components/CustomAudioPlayer";
import clsx from "clsx";
import JSZip from "jszip";

interface Memory {
  type: "photo" | "audio";
  url: string;
}

// Demo amaçlı örnek anılar kaldırıldı
// const demoMemories = [
//   { type: "photo", url: "/gallery/2.jpg" },
//   { type: "audio", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
//   { type: "photo", url: "/gallery/3.jpg" },
//   { type: "photo", url: "/gallery/4.jpg" },
// ];

// Download butonu bileşeni
function DownloadButton({ url, label }: { url: string, label?: string }) {
  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop() || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <button
      onClick={handleDownload}
      className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded shadow text-xs transition"
    >
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      {label || 'İndir'}
    </button>
  );
}

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const response = await fetch('/api/memories');
        const data = await response.json();
        if (response.ok) {
          setMemories(data.memories);
        } else {
          setError(data.message || 'Anılar yüklenirken bir hata oluştu.');
        }
      } catch (err: any) {
        setError(err.message || 'Sunucuya bağlanırken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchMemories();
  }, []);

  // Toplu indirme fonksiyonu
  const handleDownloadAll = async () => {
    const zip = new JSZip();
    const photoMemories = memories.filter(m => m.type === "photo");
    const audioMemories = memories.filter(m => m.type === "audio");
    // Fotoğraflar
    for (const [i, m] of photoMemories.entries()) {
      try {
        const res = await fetch(m.url);
        const blob = await res.blob();
        zip.file(`foto_${i + 1}${getExtension(m.url)}`, blob);
      } catch {}
    }
    // Sesler
    for (const [i, m] of audioMemories.entries()) {
      try {
        const res = await fetch(m.url);
        const blob = await res.blob();
        zip.file(`ses_${i + 1}${getExtension(m.url)}`, blob);
      } catch {}
    }
    const content = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = "tum-anilar.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  function getExtension(url: string) {
    const match = url.match(/\.[a-zA-Z0-9]+$/);
    return match ? match[0] : '';
  }

  return (
    <main className="flex flex-col items-center gap-12 py-12 min-h-screen bg-transparent">
      <button
        onClick={handleDownloadAll}
        className="mb-4 px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded shadow text-base transition flex items-center gap-2"
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Tümünü İndir
      </button>
      <h1 className="text-4xl font-extrabold text-yellow-400 drop-shadow text-center tracking-wide italic mb-8">Bırakılan Anılar</h1>
      {loading && <p className="text-yellow-300">Anılar yükleniyor...</p>}
      {error && <p className="text-red-500">Hata: {error}</p>}
      {!loading && !error && memories.length === 0 && (
        <p className="text-yellow-700 text-center italic">Henüz hiçbir anı bırakılmadı.</p>
      )}

      {/* Fotoğraf Slider */}
      <section className="w-full max-w-4xl mb-12">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center">Fotoğraflar</h2>
        <Slider memories={memories.filter(m => m.type === "photo")}
                renderItem={(m) => (
                  <div className="bg-zinc-900/70 border border-yellow-700 rounded-2xl shadow-lg p-6 flex flex-col items-center">
                    <Image src={m.url} alt="Anı Fotoğrafı" width={240} height={240} className="rounded-lg object-cover mb-3 border border-yellow-800" />
                    <span className="text-xs text-yellow-300 italic">Fotoğraf</span>
                    <DownloadButton url={m.url} label="Fotoğrafı İndir" />
                  </div>
                )}
        />
      </section>

      {/* Ses Kaydı Slider */}
      <section className="w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center">Ses Kayıtları</h2>
        <Slider memories={memories.filter(m => m.type === "audio")}
                renderItem={(m) => (
                  <div className="bg-zinc-900/70 border border-yellow-700 rounded-2xl shadow-lg p-6 flex flex-col items-center">
                    <CustomAudioPlayer src={m.url} />
                    <span className="text-xs text-yellow-300 italic mt-2">Ses Kaydı</span>
                    <DownloadButton url={m.url} label="Ses Kaydını İndir" />
                  </div>
                )}
        />
      </section>
    </main>
  );
}

// Slider bileşeni (sayfa içinde tanımlı)
function Slider({ memories, renderItem }: { memories: Memory[], renderItem: (m: Memory) => React.ReactNode }) {
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = scrollRef.current.offsetWidth * 0.85;
      scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  };

  if (memories.length === 0) return <div className="text-yellow-700 text-center italic">Hiç kayıt yok.</div>;

  const isScrollable = memories.length > 1;
  return (
    <div className={clsx("w-full flex justify-center", !isScrollable && "items-center", "relative")}> 
      {/* Ok butonları sadece sm ve üstünde görünür */}
      {isScrollable && (
        <>
          <button
            onClick={() => scrollBy('left')}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-full w-10 h-10 items-center justify-center shadow-lg transition"
            aria-label="Geri"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button
            onClick={() => scrollBy('right')}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-full w-10 h-10 items-center justify-center shadow-lg transition"
            aria-label="İleri"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </>
      )}
      <div
        ref={scrollRef}
        className={clsx(
          "flex gap-6 sm:gap-8",
          isScrollable ? "overflow-x-auto scrollbar-hide w-full" : "justify-center",
        )}
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollSnapType: isScrollable ? 'x mandatory' : undefined,
        }}
      >
        {memories.map((m, i) => (
          <div
            key={i}
            className={clsx(
              "flex-shrink-0 flex justify-center items-center",
              isScrollable ? "scroll-snap-align-center w-[90vw] sm:w-full max-w-xs sm:max-w-sm md:max-w-md" : "w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto"
            )}
            style={{ zIndex: 2 }}
          >
            {renderItem(m)}
          </div>
        ))}
      </div>
    </div>
  );
} 