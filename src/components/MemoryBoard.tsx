"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import AudioRecorder from "./AudioRecorder";
import CustomAudioPlayer from "./CustomAudioPlayer";

interface Memory {
  type: "photo" | "audio";
  url: string;
}

// Teşekkür mesajı için süre (ms)
const THANK_YOU_TIMEOUT = 3000;

export default function MemoryBoard() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(false);
  const [thankYou, setThankYou] = useState<string | null>(null);
  // Seçilen dosya adı için state
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Fotoğraf yükleme
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedPhoto(file ? file.name : null);
    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        if (response.ok) {
          setMemories((prev) => [{ type: "photo", url: data.url }, ...prev]);
          e.target.value = ''; // Clear input
          setThankYou('Fotoğraf anınız başarıyla bırakıldı! Teşekkür ederiz.');
          setTimeout(() => setThankYou(null), THANK_YOU_TIMEOUT);
        } else {
          alert(`Yükleme hatası: ${data.message}`);
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('Dosya yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <section className="flex flex-col items-center gap-8 py-8 bg-transparent min-h-screen w-full">
      {/* Çiftin fotoğrafı dikdörtgen çerçevede */}
      <div className="relative w-72 h-[420px] shadow-2xl flex items-center justify-center bg-zinc-900/80 rounded-3xl overflow-hidden border-2 border-yellow-500">
        <Image
          src="/gallery/1.jpg"
          alt="Çift Fotoğrafı"
          fill
          className="object-contain"
        />
      </div>
      {/* Çiftin ismi ve açıklama */}
      <h1
        className="text-5xl font-extrabold text-white text-center tracking-wide drop-shadow-lg"
        style={{ textShadow: '0 2px 16px #FFD700, 0 1px 0 #000' }}
      >
        Ayşe & Ahmet
      </h1>
      <p className="text-lg text-yellow-300 text-center font-medium mb-2">Bize bir anı bırak <span className='text-yellow-400'>💌</span></p>
      {/* Anı ekleme kartları */}
      <div className="flex flex-row gap-4 w-full max-w-2xl justify-center">
        {/* Teşekkür mesajı */}
        {thankYou && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-yellow-500 text-black font-bold px-8 py-4 rounded-xl shadow-lg z-50 text-lg border-2 border-yellow-700 animate-fade-in-out">
            {thankYou}
          </div>
        )}
        {/* Fotoğraf ekle */}
        <div className="relative bg-zinc-900/80 border border-yellow-700 rounded-xl shadow-lg p-6 flex flex-col items-center w-1/2 overflow-hidden" style={{boxShadow: 'inset 0 2px 16px 0 #FFD70022'}}>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/30 via-yellow-800/10 to-zinc-900/60 pointer-events-none" />
          {/* Gold top line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400/60 via-yellow-200/80 to-yellow-400/60 blur-sm" />
          {/* Kart içeriği */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full w-full text-center">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-yellow-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75V8.25A2.25 2.25 0 014.5 6h2.379a1.5 1.5 0 001.06-.44l1.122-1.12A1.5 1.5 0 0110.621 4.5h2.758a1.5 1.5 0 011.06.44l1.122 1.12a1.5 1.5 0 001.06.44H19.5a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-15A2.25 2.25 0 012.25 15.75z" />
                <circle cx="12" cy="12" r="3.25" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
              Fotoğraf Ekle
            </h3>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              disabled={loading}
            />
            <label htmlFor="photo-upload" className="mb-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded cursor-pointer transition-colors shadow">
              Dosya Seç
            </label>
            {selectedPhoto && (
              <span className="text-xs text-yellow-200 mt-1">Seçilen dosya: {selectedPhoto}</span>
            )}
          </div>
        </div>
      </div>
      {/* Ses kaydı ekle (YENİ) */}
      <div className="relative bg-zinc-900/80 border border-yellow-700 rounded-xl shadow-lg p-6 flex flex-col items-center w-1/2 overflow-hidden" style={{boxShadow: 'inset 0 2px 16px 0 #FFD70022'}}>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/30 via-yellow-800/10 to-zinc-900/60 pointer-events-none" />
        {/* Gold top line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400/60 via-yellow-200/80 to-yellow-400/60 blur-sm" />
        {/* Kart içeriği */}
        <div className="relative z-10">
          <h3 className="text-lg font-semibold text-yellow-400 mb-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 16" fill="none" className="w-8 h-5 text-yellow-400">
              <rect x="1" y="8" width="2" height="6" rx="1" fill="currentColor"/>
              <rect x="5" y="4" width="2" height="10" rx="1" fill="currentColor"/>
              <rect x="9" y="1" width="2" height="14" rx="1" fill="currentColor"/>
              <rect x="13" y="6" width="2" height="6" rx="1" fill="currentColor"/>
              <rect x="17" y="4" width="2" height="10" rx="1" fill="currentColor"/>
              <rect x="21" y="8" width="2" height="6" rx="1" fill="currentColor"/>
              <rect x="25" y="2" width="2" height="12" rx="1" fill="currentColor"/>
            </svg>
            Ses Kaydı Ekle
          </h3>
          <AudioRecorder onSave={url => setMemories(prev => [{ type: "audio", url }, ...prev])} />
          <p className="text-xs text-yellow-200 mt-2">Bir anınızı sesli olarak bırakın.</p>
        </div>
      </div>
      {/* Eklenen anılar */}
      <div className="w-full max-w-2xl mt-8">
        <h3 className="text-xl font-bold text-yellow-400 mb-4">Bırakılan Anılar</h3>
        {memories.length === 0 && (
          <div className="text-yellow-700 text-center">Henüz bir anı bırakılmadı.</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {memories.map((m, i) => (
            <div key={i} className="bg-zinc-900/80 border border-yellow-700 rounded-lg shadow-lg p-4 flex flex-col items-center">
              {m.type === "photo" ? (
                <Image src={m.url} alt="Anı Fotoğrafı" width={200} height={200} className="rounded-md object-cover mb-2 border border-yellow-800" />
              ) : (
                <CustomAudioPlayer src={m.url} />
              )}
              <span className="text-xs text-yellow-300">{m.type === "photo" ? "Fotoğraf" : "Ses Kaydı"}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 