import { useRef, useState } from "react";

type Props = {
  onSave: (url: string) => void;
};

export default function AudioRecorder({ onSave }: Props) {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const handleRecord = async () => {
    setError(null);
    if (!recording) {
      // Kayıt başlat
      setLoading(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        const mediaRecorder = new window.MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunks.current = [];

        mediaRecorder.ondataavailable = (e) => {
          audioChunks.current.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          const blob = new Blob(audioChunks.current, { type: "audio/webm" });
          if (blob.size === 0) {
            setError("Kayıt alınamadı. Lütfen tekrar deneyin.");
            setLoading(false);
            setRecording(false);
            return;
          }
          const formData = new FormData();
          formData.append('file', blob, 'audio.webm');
          try {
            const response = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });
            const data = await response.json();
            if (response.ok) {
              onSave(data.url);
            } else {
              setError(data.message || "Yükleme hatası");
            }
          } catch {
            setError("Ses kaydı yüklenirken bir hata oluştu.");
          } finally {
            setLoading(false);
            if (streamRef.current) {
              streamRef.current.getTracks().forEach(track => track.stop());
              streamRef.current = null;
            }
            setRecording(false);
          }
        };
        mediaRecorder.start();
        setRecording(true);
      } catch {
        setError("Mikrofon erişimi alınamadı.");
        setLoading(false);
        setRecording(false);
      }
    } else {
      // Kayıt durdur
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <button
        type="button"
        onClick={handleRecord}
        className={`px-4 py-2 rounded font-semibold shadow transition-colors mb-2 sm:w-auto w-full text-base ${recording ? "bg-yellow-700 text-yellow-100" : "bg-yellow-500 hover:bg-yellow-600 text-black"}`}
        disabled={false}
      >
        {recording ? "Kaydı Durdur" : "Kaydı Başlat"}
      </button>
      {loading && <span className="text-yellow-300 text-xs">Yükleniyor...</span>}
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </div>
  );
} 