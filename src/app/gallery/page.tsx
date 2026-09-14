"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Camera,
  Play,
  Pause,
  Volume2,
  Download,
  Search,
  RefreshCw,
  Tv,
  ArrowLeft,
  X,
  Maximize2,
  Minimize2,
  User,
  Mic,
} from "lucide-react";
import { supabase } from "@/app/lib/supabase";

interface Submission {
  id: string | number;
  created_at?: string;
  guest_name?: string;
  photo_url: string;
  voice_url?: string | null;
  event_id?: string;
}

export default function WeddingGalleryPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterVoiceOnly, setFilterVoiceOnly] = useState<boolean>(false);

  // Audio Playback State
  const [activeAudioUrl, setActiveAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Lightbox Modal State
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  // Live Reception Screen (Projector Slideshow Mode)
  const [isLiveWallMode, setIsLiveWallMode] = useState<boolean>(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  // Manual Refresh Submissions from Supabase
  const fetchSubmissions = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Supabase fetch error, fallback to empty/local:", error);
      } else if (data) {
        setSubmissions(data as Submission[]);
      }
    } catch (err) {
      console.warn("Network error fetching submissions:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch without synchronous setState since isLoading is already true initially
    let isMounted = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("submissions")
          .select("*")
          .order("created_at", { ascending: false });

        if (isMounted) {
          if (data && !error) {
            setSubmissions(data as Submission[]);
          }
          setIsLoading(false);
        }
      } catch (err) {
        console.warn("Initial fetch error:", err);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    // Subscribe to realtime inserts if enabled
    try {
      const channel = supabase
        .channel("submissions_realtime")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "submissions" },
          (payload) => {
            const newSubmission = payload.new as Submission;
            setSubmissions((prev) => [newSubmission, ...prev]);
          }
        )
        .subscribe();

      return () => {
        isMounted = false;
        supabase.removeChannel(channel);
      };
    } catch {
      return () => {
        isMounted = false;
      };
    }
  }, []);


  // Filtered Submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const matchSearch =
        !searchQuery ||
        (sub.guest_name &&
          sub.guest_name.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchVoice = !filterVoiceOnly || Boolean(sub.voice_url);
      return matchSearch && matchVoice;
    });
  }, [submissions, searchQuery, filterVoiceOnly]);

  // Audio Playback Controls
  const togglePlayAudio = (url: string) => {
    if (activeAudioUrl === url && isPlaying) {
      audioPlayerRef.current?.pause();
      setIsPlaying(false);
    } else {
      setActiveAudioUrl(url);
      setIsPlaying(true);
      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = url;
        audioPlayerRef.current.play().catch((e) => {
          console.warn("Audio play prevented:", e);
          setIsPlaying(false);
        });
      }
    }
  };

  // Download Individual Photo
  const handleDownload = (photoUrl: string, name?: string) => {
    const link = document.createElement("a");
    link.href = photoUrl;
    link.download = `photobooth-${name || "wedding"}-${Date.now()}.jpg`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Live Wall Slideshow Auto-Cycle (Every 6 seconds)
  useEffect(() => {
    if (!isLiveWallMode || filteredSubmissions.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % filteredSubmissions.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isLiveWallMode, filteredSubmissions.length]);

  // Keyboard shortcut for Esc on modal / live wall
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsLiveWallMode(false);
        setSelectedSubmission(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Format date helper
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Baru saja";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Hari ini";
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] w-full bg-stone-950 text-stone-100 font-sans selection:bg-amber-400 selection:text-stone-950">
      {/* Hidden Audio Player */}
      <audio
        ref={audioPlayerRef}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />

      {/* TOP HEADER */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-stone-950/80 backdrop-blur-md border-b border-stone-800">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 -ml-2 rounded-full text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
            title="Kembali ke Beranda"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-stone-950 font-bold text-xs shadow-md">
              R&A
            </div>
            <div>
              <h1 className="text-sm font-bold text-amber-200 leading-tight">
                Galeri Kenangan Mempelai
              </h1>
              <p className="text-[11px] text-stone-400">Romeo & Juliet • 14 September 2026</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Live Wall Button for Reception Projector */}
          <button
            onClick={() => {
              setCurrentSlideIndex(0);
              setIsLiveWallMode(true);
            }}
            disabled={filteredSubmissions.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-40"
            title="Buka Mode Layar Proyektor Resepsi"
          >
            <Tv className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Layar Proyektor</span>
          </button>

          <Link
            href="/photobooth"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 border border-stone-700 text-amber-200 text-xs font-semibold transition-all"
          >
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Ambil Foto</span>
          </Link>
        </div>
      </header>

      {/* SUB-HEADER & STATS */}
      <section className="px-4 sm:px-6 py-6 max-w-5xl mx-auto w-full flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-850 pb-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400/90">
              Official Wedding Guestbook Album
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100 mt-1">
              Kenangan Hangat Para Tamu
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Seluruh photostrip dan rekaman doa restu tersimpan aman sebagai kenangan abadi.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-stone-900 border border-stone-800 text-center">
              <span className="block text-xl font-bold text-amber-300">
                {submissions.length}
              </span>
              <span className="text-[10px] text-stone-400 uppercase tracking-wider">
                Foto Masuk
              </span>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-stone-900 border border-stone-800 text-center">
              <span className="block text-xl font-bold text-rose-400">
                {submissions.filter((s) => Boolean(s.voice_url)).length}
              </span>
              <span className="text-[10px] text-stone-400 uppercase tracking-wider">
                Doa Suara
              </span>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan nama tamu..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-900/90 border border-stone-800 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterVoiceOnly(!filterVoiceOnly)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                filterVoiceOnly
                  ? "bg-amber-400 text-stone-950 shadow-md shadow-amber-500/20"
                  : "bg-stone-900 hover:bg-stone-850 text-stone-300 border border-stone-800"
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Hanya yang Bersuara</span>
            </button>

            <button
              onClick={fetchSubmissions}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-850 border border-stone-800 text-stone-300 transition-colors"
              title="Perbarui Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </section>

      {/* GALLERY GRID */}
      <main className="flex-1 px-4 sm:px-6 pb-20 max-w-5xl mx-auto w-full">
        {isLoading && submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-stone-400">
            <RefreshCw className="w-8 h-8 animate-spin text-amber-400" />
            <p className="text-xs">Memuat galeri photostrip...</p>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-stone-850 bg-stone-900/40 p-8">
            <div className="w-16 h-16 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 mb-3">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-stone-200">Belum Ada Foto</h3>
            <p className="text-xs text-stone-400 mt-1 max-w-xs">
              Jadilah yang pertama mengabadikan momen dan mengirim ucapan di bilik photobooth!
            </p>
            <Link
              href="/photobooth"
              className="mt-5 px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs transition-all active:scale-95 shadow-md shadow-amber-500/20 flex items-center gap-1.5"
            >
              <Camera className="w-4 h-4" />
              <span>Mulai Ambil Foto</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredSubmissions.map((sub, idx) => {
              const hasVoice = Boolean(sub.voice_url);
              const isVoicePlaying = isPlaying && activeAudioUrl === sub.voice_url;

              return (
                <div
                  key={sub.id || idx}
                  className="group relative rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-400/50 shadow-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/5"
                >
                  {/* Photo Container */}
                  <div
                    onClick={() => setSelectedSubmission(sub)}
                    className="relative cursor-pointer aspect-[3/4] w-full overflow-hidden bg-black/50 flex items-center justify-center"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={sub.photo_url}
                      alt={sub.guest_name || "Foto Tamu"}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                      <span className="text-[11px] font-semibold text-amber-200 flex items-center gap-1">
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Perbesar</span>
                      </span>
                    </div>

                    {hasVoice && (
                      <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-rose-600/90 text-white text-[10px] font-bold flex items-center gap-1 shadow-lg backdrop-blur-sm">
                        <Mic className="w-3 h-3" />
                        <span>Voice Note</span>
                      </div>
                    )}
                  </div>

                  {/* Card Content & Voice Player */}
                  <div className="p-4 flex flex-col gap-3 flex-1 justify-between bg-gradient-to-b from-stone-900 to-stone-950">
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-stone-100 truncate flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{sub.guest_name || "Tamu Undangan"}</span>
                        </h4>
                        <span className="text-[10px] text-stone-500 font-mono">
                          {formatDate(sub.created_at)}
                        </span>
                      </div>
                    </div>

                    {/* Integrated Voice Note Player Bar */}
                    {hasVoice ? (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-950 border border-stone-800/80">
                        <button
                          onClick={() => togglePlayAudio(sub.voice_url!)}
                          className={`p-2 rounded-full transition-all active:scale-95 ${
                            isVoicePlaying
                              ? "bg-rose-500 text-white animate-pulse"
                              : "bg-amber-400 text-stone-950 hover:bg-amber-300"
                          }`}
                          aria-label="Putar Ucapan Suara"
                        >
                          {isVoicePlaying ? (
                            <Pause className="w-3.5 h-3.5 fill-current" />
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          )}
                        </button>

                        <div className="flex-1 px-3">
                          <span className="text-xs font-semibold text-stone-200 block">
                            {isVoicePlaying ? "Memutar Suara..." : "Dengar Doa Tamu"}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            Pesan Suara Mempelai
                          </span>
                        </div>

                        <Volume2
                          className={`w-4 h-4 ${
                            isVoicePlaying ? "text-amber-400 animate-bounce" : "text-stone-500"
                          }`}
                        />
                      </div>
                    ) : (
                      <div className="text-[11px] text-stone-500 italic py-1">
                        Hanya foto (tanpa rekaman suara)
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-1 border-t border-stone-800/80">
                      <button
                        onClick={() => setSelectedSubmission(sub)}
                        className="text-xs font-semibold text-amber-300/90 hover:text-amber-200 transition-colors"
                      >
                        Lihat Detail ➔
                      </button>

                      <button
                        onClick={() => handleDownload(sub.photo_url, sub.guest_name)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
                        title="Unduh Photostrip"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative max-w-lg w-full bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90dvh]">
            <button
              onClick={() => setSelectedSubmission(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-stone-950/80 text-stone-300 hover:text-white transition-colors"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Lightbox Image */}
            <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center bg-black/60 min-h-[350px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedSubmission.photo_url}
                alt={selectedSubmission.guest_name || "Detail Foto"}
                className="max-h-[60dvh] w-auto object-contain rounded-xl shadow-2xl"
              />
            </div>

            {/* Lightbox Details */}
            <div className="p-5 bg-stone-950 border-t border-stone-800 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-stone-100">
                    {selectedSubmission.guest_name || "Tamu Undangan"}
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {formatDate(selectedSubmission.created_at)}
                  </p>
                </div>

                <button
                  onClick={() =>
                    handleDownload(
                      selectedSubmission.photo_url,
                      selectedSubmission.guest_name
                    )
                  }
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs transition-colors shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Foto</span>
                </button>
              </div>

              {selectedSubmission.voice_url && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-stone-900 border border-stone-800">
                  <button
                    onClick={() => togglePlayAudio(selectedSubmission.voice_url!)}
                    className="p-3 rounded-full bg-amber-400 text-stone-950 hover:bg-amber-300 transition-all active:scale-95"
                  >
                    {isPlaying && activeAudioUrl === selectedSubmission.voice_url ? (
                      <Pause className="w-4 h-4 fill-stone-950" />
                    ) : (
                      <Play className="w-4 h-4 fill-stone-950 ml-0.5" />
                    )}
                  </button>

                  <div className="flex-1 px-3">
                    <span className="text-xs font-semibold text-stone-100 block">
                      Rekaman Doa Restu Tamu
                    </span>
                    <span className="text-[11px] text-stone-400">
                      {isPlaying && activeAudioUrl === selectedSubmission.voice_url
                        ? "Sedang memutar..."
                        : "Ketuk tombol untuk mendengarkan"}
                    </span>
                  </div>

                  <Volume2 className="w-4 h-4 text-amber-400" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LIVE RECEPTION SCREEN (PROJECTOR SLIDESHOW MODE) */}
      {isLiveWallMode && filteredSubmissions.length > 0 && (
        <div className="fixed inset-0 z-50 bg-stone-950 text-stone-100 flex flex-col justify-between p-6 sm:p-10 animate-in fade-in duration-300">
          {/* Top Bar for Projector */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-stone-950 font-bold text-sm shadow-xl shadow-amber-500/30">
                R&A
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-amber-400">
                  LIVE WEDDING PHOTOBOOTH
                </span>
                <h2 className="text-xl font-serif font-bold text-stone-100">
                  The Wedding of Romeo & Juliet
                </h2>
              </div>
            </div>

            <button
              onClick={() => setIsLiveWallMode(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs font-semibold text-stone-300 transition-colors"
            >
              <Minimize2 className="w-4 h-4" />
              <span>Tutup Layar Penuh</span>
            </button>
          </div>

          {/* Central Slideshow View */}
          <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-8 py-4 max-w-6xl mx-auto w-full">
            {/* Main Photostrip Presentation */}
            <div className="relative max-h-[72dvh] aspect-[3/4] flex items-center justify-center rounded-3xl overflow-hidden shadow-2xl shadow-black/80 border-2 border-amber-400/40 bg-stone-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={filteredSubmissions[currentSlideIndex].photo_url}
                alt="Live Slideshow"
                className="w-full h-full object-contain animate-in zoom-in-95 duration-500"
              />
            </div>

            {/* Slide Guest Card Info */}
            <div className="flex flex-col gap-4 max-w-sm text-left">
              <div className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-semibold w-fit">
                Foto {currentSlideIndex + 1} dari {filteredSubmissions.length}
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Kiriman Spesial Dari:
                </span>
                <h3 className="text-3xl font-serif font-bold text-amber-200 mt-1">
                  {filteredSubmissions[currentSlideIndex].guest_name || "Tamu Undangan"}
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  {formatDate(filteredSubmissions[currentSlideIndex].created_at)}
                </p>
              </div>

              {filteredSubmissions[currentSlideIndex].voice_url && (
                <div className="p-4 rounded-2xl bg-stone-900 border border-amber-400/30 shadow-lg flex items-center gap-3">
                  <button
                    onClick={() =>
                      togglePlayAudio(
                        filteredSubmissions[currentSlideIndex].voice_url!
                      )
                    }
                    className="p-3 rounded-full bg-amber-400 text-stone-950 hover:bg-amber-300 transition-all shadow-md"
                  >
                    {isPlaying &&
                    activeAudioUrl ===
                      filteredSubmissions[currentSlideIndex].voice_url ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>
                  <div>
                    <span className="text-xs font-bold text-stone-100 block">
                      Dengarkan Doa Restu
                    </span>
                    <span className="text-[11px] text-stone-400">
                      Ketuk untuk memutar di layar panggung
                    </span>
                  </div>
                </div>
              )}

              <p className="text-xs text-stone-500 italic mt-2">
                Foto berganti otomatis setiap 6 detik. Tekan tombol Esc untuk keluar.
              </p>
            </div>
          </div>

          {/* Bottom Progress Bar */}
          <div className="flex items-center justify-between border-t border-stone-800 pt-4 text-xs text-stone-500">
            <span>Virtual Photobooth Wedding • Live Projection</span>
            <div className="flex items-center gap-1.5">
              {filteredSubmissions.slice(0, 10).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentSlideIndex % 10
                      ? "w-6 bg-amber-400"
                      : "w-1.5 bg-stone-800"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
