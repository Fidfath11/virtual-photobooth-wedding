"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  Send,
  Download,
  Share2,
  Heart,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  User,
  Volume2,
  AlertCircle,
  RefreshCw,
  Camera,
} from "lucide-react";
import confetti from "canvas-confetti";
import { supabase } from "@/app/lib/supabase";

export default function AudioRecordingPage() {
  // Data State
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [guestName, setGuestName] = useState<string>("");

  // Audio Recording State
  const [recordingState, setRecordingState] = useState<"idle" | "recording" | "recorded">("idle");
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioLevels, setAudioLevels] = useState<number[]>([15, 25, 45, 20, 35, 60, 25, 15]);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Load captured photo from sessionStorage on mount
  useEffect(() => {
    try {
      const savedPhoto = sessionStorage.getItem("photobooth_photo");
      if (savedPhoto) {
        queueMicrotask(() => {
          setPhotoDataUrl(savedPhoto);
        });
      }
    } catch {
      // sessionStorage unavailable
    }
  }, []);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Stop media tracks cleanup
  const cleanupAudioStream = useCallback(() => {
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((t) => t.stop());
      audioStreamRef.current = null;
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      cleanupAudioStream();
      if (audioPreviewUrl) {
        URL.revokeObjectURL(audioPreviewUrl);
      }
    };
  }, [audioPreviewUrl, cleanupAudioStream]);

  // Start Audio Recording
  const startRecording = async () => {
    setErrorMessage("");
    audioChunksRef.current = [];

    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setErrorMessage("Peramban Anda tidak mendukung perekaman suara.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      // Audio waveform visualizer using Web Audio API
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const audioCtx = new AudioCtx();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 32;
        source.connect(analyser);
        analyserRef.current = analyser;

        const updateLevels = () => {
          if (!analyserRef.current) return;
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          // Pick 8 representative bars
          const bars: number[] = [];
          for (let i = 0; i < 8; i++) {
            const val = dataArray[i * 2] || 10;
            bars.push(Math.max(12, Math.min(85, Math.round((val / 255) * 80))));
          }
          setAudioLevels(bars);
          animationFrameRef.current = requestAnimationFrame(updateLevels);
        };
        updateLevels();
      } catch {
        // Fallback visualizer if Web Audio is restricted
      }

      // Determine supported mimeType
      const mimeTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "audio/ogg;codecs=opus",
      ];
      const selectedMime = mimeTypes.find((m) => MediaRecorder.isTypeSupported(m)) || "";

      const recorder = selectedMime
        ? new MediaRecorder(stream, { mimeType: selectedMime })
        : new MediaRecorder(stream);

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioPreviewUrl(url);
        setRecordingState("recorded");
        cleanupAudioStream();
      };

      mediaRecorderRef.current = recorder;
      recorder.start(250); // Slice every 250ms

      setRecordingState("recording");
      setRecordingDuration(0);

      // Timer (maximum 60 seconds)
      timerIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => {
          if (prev >= 59) {
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: unknown) {
      const error = err as { name?: string; message?: string };
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        setErrorMessage("Izin akses mikrofon ditolak. Harap izinkan akses mikrofon di pengaturan browser.");
      } else {
        setErrorMessage("Gagal mengakses mikrofon: " + (error.message || "Kesalahan tidak dikenal"));
      }
    }
  };

  // Stop Audio Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  // Reset / Retake Voice Note
  const resetRecording = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    setIsPlayingAudio(false);
    setAudioBlob(null);
    if (audioPreviewUrl) {
      URL.revokeObjectURL(audioPreviewUrl);
      setAudioPreviewUrl(null);
    }
    setRecordingState("idle");
    setRecordingDuration(0);
  };

  // Audio Player Toggle
  const togglePlayAudio = () => {
    if (!audioPlayerRef.current || !audioPreviewUrl) return;

    if (isPlayingAudio) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  // Helper: Convert DataURL to Blob
  const dataURLtoBlob = (dataurl: string): Blob => {
    const arr = dataurl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  // Helper: Convert Blob to DataURL
  const blobToDataURL = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // SUBMIT to Supabase
  const handleSubmit = async () => {
    if (!photoDataUrl) {
      setErrorMessage("Foto tidak ditemukan. Silakan ambil foto terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const cleanName = guestName.trim() || "Tamu Undangan";

      let finalPhotoUrl = photoDataUrl;
      let finalVoiceUrl: string | null = null;

      // 1. Try uploading Photo to Supabase Storage
      try {
        const photoBlob = dataURLtoBlob(photoDataUrl);
        const photoPath = `photos/${timestamp}-${randomStr}.jpg`;

        const { error: photoUploadError } = await supabase.storage
          .from("photobooth")
          .upload(photoPath, photoBlob, { contentType: "image/jpeg", upsert: true });

        if (!photoUploadError) {
          const { data: publicPhotoData } = supabase.storage
            .from("photobooth")
            .getPublicUrl(photoPath);
          if (publicPhotoData?.publicUrl) {
            finalPhotoUrl = publicPhotoData.publicUrl;
          }
        }
      } catch (uploadErr) {
        console.warn("Storage upload photo fallback to base64:", uploadErr);
      }

      // 2. Try uploading Voice Note to Supabase Storage if recorded
      if (audioBlob) {
        try {
          const voicePath = `voices/${timestamp}-${randomStr}.webm`;
          const { error: voiceUploadError } = await supabase.storage
            .from("photobooth")
            .upload(voicePath, audioBlob, { contentType: audioBlob.type || "audio/webm", upsert: true });

          if (!voiceUploadError) {
            const { data: publicVoiceData } = supabase.storage
              .from("photobooth")
              .getPublicUrl(voicePath);
            if (publicVoiceData?.publicUrl) {
              finalVoiceUrl = publicVoiceData.publicUrl;
            }
          } else {
            // Fallback: convert audio to dataURL
            finalVoiceUrl = await blobToDataURL(audioBlob);
          }
        } catch {
          finalVoiceUrl = await blobToDataURL(audioBlob);
        }
      }

      // 3. Insert into Supabase table "submissions"
      const { error: dbError } = await supabase.from("submissions").insert({
        guest_name: cleanName,
        photo_url: finalPhotoUrl,
        voice_url: finalVoiceUrl,
        event_id: "wedding-demo",
      });

      if (dbError) {
        throw new Error(dbError.message || "Gagal menyimpan data ke sistem.");
      }

      // Success celebration!
      setSubmissionSuccess(true);
      setIsSubmitting(false);

      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#D4AF37", "#FDF0A6", "#E11D48", "#FFFFFF"],
        });
      } catch {
        // Confetti optional
      }
    } catch (err: unknown) {
      setIsSubmitting(false);
      const error = err as { message?: string };
      setErrorMessage("Terjadi kesalahan saat mengirim: " + (error.message || "Silakan coba lagi."));
    }
  };

  // Download photo to device
  const handleDownloadPhoto = () => {
    if (!photoDataUrl) return;
    const link = document.createElement("a");
    link.href = photoDataUrl;
    link.download = `wedding-photobooth-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Share photo (Web Share API or WhatsApp fallback)
  const handleShare = async () => {
    if (!photoDataUrl) return;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        const photoBlob = dataURLtoBlob(photoDataUrl);
        const file = new File([photoBlob], `wedding-photobooth.jpg`, { type: "image/jpeg" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: "Virtual Photobooth Wedding",
            text: "Selamat menempuh hidup baru untuk kedua mempelai! ♥",
            files: [file],
          });
          return;
        } else {
          await navigator.share({
            title: "Virtual Photobooth Wedding",
            text: "Selamat menempuh hidup baru untuk kedua mempelai! ♥",
            url: window.location.origin,
          });
          return;
        }
      } catch {
        // User cancelled share
      }
    }

    // Fallback: Open WhatsApp share text
    const text = encodeURIComponent(
      "Selamat menempuh hidup baru untuk kedua mempelai! Doa terbaik dari kami. ♥"
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  // If no photo found in storage, show back to photobooth notice
  if (!photoDataUrl && !submissionSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-stone-950 text-stone-100 p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-4">
          <Camera className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-amber-200">Foto Belum Tersedia</h2>
        <p className="text-sm text-stone-400 mt-2 max-w-sm leading-relaxed">
          Silakan ambil foto terlebih dahulu di bilik Virtual Photobooth sebelum merekam ucapan suara.
        </p>
        <Link
          href="/photobooth"
          className="mt-6 px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-sm transition-all active:scale-95 flex items-center gap-2"
        >
          <Camera className="w-4 h-4" />
          <span>Buka Kamera Photobooth</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh] w-full bg-stone-950 text-stone-100 font-sans selection:bg-amber-400 selection:text-stone-950">
      {/* Audio player element for preview */}
      {audioPreviewUrl && (
        <audio
          ref={audioPlayerRef}
          src={audioPreviewUrl}
          onEnded={() => setIsPlayingAudio(false)}
          className="hidden"
        />
      )}

      {/* TOP HEADER */}
      <header className="flex items-center justify-between px-4 py-3.5 bg-stone-900/80 backdrop-blur-md border-b border-stone-800/80 sticky top-0 z-30">
        <Link
          href="/photobooth"
          className="p-2 -ml-2 rounded-full text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors flex items-center gap-1.5"
          aria-label="Kembali ke Kamera"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-xs font-medium hidden sm:inline">Foto Ulang</span>
        </Link>

        <div className="text-center">
          <h1 className="text-sm font-semibold tracking-wide text-amber-200/95 leading-tight">
            Rekam Doa & Ucapan
          </h1>
          <p className="text-[11px] text-stone-400">Virtual Photobooth Wedding</p>
        </div>

        <div className="w-8 flex justify-end">
          <Heart className="w-5 h-5 text-amber-400/80 fill-amber-400/20" />
        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="flex-1 flex flex-col items-center justify-start p-4 sm:p-6 max-w-md mx-auto w-full gap-5 pb-24">
        {!submissionSuccess ? (
          <>
            {/* 1. PHOTO PREVIEW CARD */}
            <div className="w-full relative rounded-2xl overflow-hidden shadow-2xl border border-stone-800 bg-stone-900 flex flex-col items-center">
              <div className="relative w-full max-h-[260px] overflow-hidden flex items-center justify-center bg-black/40">
                {photoDataUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoDataUrl}
                    alt="Foto Photobooth"
                    className="w-full h-full max-h-[260px] object-contain"
                  />
                )}
                <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-stone-950/80 backdrop-blur-md text-[10px] text-amber-200/90 font-medium flex items-center gap-1 border border-amber-400/20">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Foto Terpasang</span>
                </div>
              </div>
            </div>

            {/* 2. GUEST NAME INPUT */}
            <div className="w-full flex flex-col gap-1.5">
              <label htmlFor="guestName" className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Nama Tamu / Pengirim</span>
              </label>
              <div className="relative">
                <input
                  id="guestName"
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Contoh: Budi & Keluarga"
                  maxLength={50}
                  className="w-full px-4 py-3 rounded-xl bg-stone-900/90 border border-stone-800 text-stone-100 placeholder-stone-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all shadow-inner"
                />
              </div>
            </div>

            {/* 3. VOICE NOTE RECORDER CARD */}
            <div className="w-full rounded-2xl p-5 bg-gradient-to-b from-stone-900 to-stone-900/90 border border-amber-400/30 shadow-xl flex flex-col items-center gap-4 text-center">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <h3 className="text-sm font-bold text-amber-200 tracking-wide">
                  Pesan Suara untuk Mempelai
                </h3>
              </div>

              {/* Recorders States */}
              {recordingState === "idle" && (
                <div className="flex flex-col items-center gap-3 py-2">
                  <p className="text-xs text-stone-400 max-w-xs leading-relaxed">
                    Sampaikan doa, ucapan selamat, atau pesan berkesan langsung lewat rekaman suara Anda (maks. 60 detik).
                  </p>

                  <button
                    onClick={startRecording}
                    className="group relative mt-2 flex items-center justify-center w-20 h-20 rounded-full transition-transform active:scale-95"
                    aria-label="Mulai Merekam Suara"
                  >
                    <div className="absolute inset-0 rounded-full bg-amber-400/20 group-hover:bg-amber-400/30 animate-pulse" />
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center text-stone-950 shadow-lg shadow-amber-500/25">
                      <Mic className="w-7 h-7" />
                    </div>
                  </button>
                  <span className="text-[11px] font-semibold text-amber-300">Ketuk untuk Rekam</span>
                </div>
              )}

              {recordingState === "recording" && (
                <div className="flex flex-col items-center gap-4 py-2 w-full">
                  {/* Timer */}
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span>MEREKAM: {formatTime(recordingDuration)} / 01:00</span>
                  </div>

                  {/* Audio Dynamic Waveform Bars */}
                  <div className="flex items-end justify-center gap-1.5 h-16 w-full px-4">
                    {audioLevels.map((height, i) => (
                      <div
                        key={i}
                        className="w-2 rounded-full bg-gradient-to-t from-amber-500 to-yellow-300 transition-all duration-75"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>

                  {/* Stop Button */}
                  <button
                    onClick={stopRecording}
                    className="mt-2 flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all active:scale-95"
                  >
                    <Square className="w-4 h-4 fill-white" />
                    <span>Selesai Merekam</span>
                  </button>
                </div>
              )}

              {recordingState === "recorded" && (
                <div className="flex flex-col items-center gap-3 py-1 w-full">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Rekaman suara berhasil tersimpan!</span>
                  </div>

                  {/* Audio Player Bar */}
                  <div className="flex items-center justify-between w-full p-3 rounded-xl bg-stone-950/80 border border-stone-800">
                    <button
                      onClick={togglePlayAudio}
                      className="p-3 rounded-full bg-amber-400 text-stone-950 hover:bg-amber-300 transition-all active:scale-95"
                      aria-label={isPlayingAudio ? "Pause Suara" : "Putar Suara"}
                    >
                      {isPlayingAudio ? (
                        <Pause className="w-4 h-4 fill-stone-950" />
                      ) : (
                        <Play className="w-4 h-4 fill-stone-950 ml-0.5" />
                      )}
                    </button>

                    <div className="flex flex-col items-start flex-1 px-3">
                      <span className="text-xs font-semibold text-stone-200">
                        {isPlayingAudio ? "Memutar Suara..." : "Dengarkan Rekaman"}
                      </span>
                      <span className="text-[11px] text-stone-400 font-mono">
                        Durasi: {formatTime(recordingDuration)}
                      </span>
                    </div>

                    <Volume2 className="w-4 h-4 text-stone-400" />
                  </div>

                  {/* Retake Button */}
                  <button
                    onClick={resetRecording}
                    className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-amber-300 transition-colors py-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Rekam Ulang</span>
                  </button>
                </div>
              )}
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="w-full flex items-center gap-2 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs text-left animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <p className="flex-1">{errorMessage}</p>
              </div>
            )}

            {/* 4. SEND / SUBMIT BUTTON */}
            <div className="w-full pt-2 flex flex-col gap-2.5">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-bold text-sm tracking-wide shadow-xl shadow-amber-500/20 transition-all active:scale-98 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Mengirim Kenangan Indah...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Kirim Foto & Pesan ke Mempelai</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between px-1">
                <button
                  onClick={handleDownloadPhoto}
                  className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-200 py-1"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Simpan Foto Saja</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-200 py-1"
                >
                  <Share2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Bagikan</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          /* ================= SUCCESS COMPLETION CARD ================= */
          <div className="w-full flex flex-col items-center text-center p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-stone-900 to-stone-950 border border-amber-400/40 shadow-2xl gap-5 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-stone-950 shadow-xl shadow-amber-500/30">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                Pesan Berhasil Terkirim
              </span>
              <h2 className="text-2xl font-bold text-stone-100 mt-1">
                Terima Kasih, {guestName.trim() || "Tamu Terhormat"}!
              </h2>
              <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                Foto kenangan dan pesan suara Anda telah tersimpan dengan aman di galeri memori kedua mempelai.
              </p>
            </div>

            {/* Photo Thumbnail in Success Card */}
            {photoDataUrl && (
              <div className="w-full max-w-[200px] rounded-xl overflow-hidden border border-amber-400/30 shadow-lg my-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoDataUrl}
                  alt="Kenangan Photobooth"
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {/* Action Buttons: Download & Share */}
            <div className="flex flex-col w-full gap-2.5 mt-2">
              <button
                onClick={handleDownloadPhoto}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-sm transition-all active:scale-95 shadow-md shadow-amber-500/20"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Foto ke Galeri HP</span>
              </button>

              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-200 font-semibold text-sm transition-all active:scale-95"
              >
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>Bagikan ke Story / WhatsApp</span>
              </button>

              <Link
                href="/photobooth"
                className="w-full py-3 text-xs font-semibold text-amber-300/90 hover:text-amber-200 transition-colors mt-1"
              >
                Ambil Foto Lagi ➔
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
