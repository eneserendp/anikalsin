import { useRef, useState } from "react";

export default function CustomAudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const ss = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${ss}`;
  };

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <div className="flex items-center gap-3 w-full">
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-black text-xl shadow hover:bg-yellow-400 transition"
        >
          {playing ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="4" height="14" rx="1" fill="currentColor"/><rect x="12" y="2" width="4" height="14" rx="1" fill="currentColor"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><polygon points="3,2 15,9 3,16" fill="currentColor"/></svg>
          )}
        </button>
        <input
          type="range"
          min={0}
          max={duration}
          value={progress}
          onChange={e => {
            if (audioRef.current) {
              audioRef.current.currentTime = Number(e.target.value);
            }
          }}
          className="flex-1 accent-yellow-500 h-2 rounded-lg bg-zinc-800/60"
        />
        <span className="text-yellow-200 text-xs w-12 text-right">
          {formatTime(progress)}
        </span>
      </div>
      <audio
        ref={audioRef}
        src={src}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={e => setProgress(e.currentTarget.currentTime)}
        onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
        className="hidden"
      />
    </div>
  );
} 