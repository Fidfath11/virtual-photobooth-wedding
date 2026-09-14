"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Camera,
  Heart,
  Sparkles,
  Layers,
  Mic,
  Tv,
  ArrowRight,
  QrCode,
  X,
  Calendar,
  MapPin,
} from "lucide-react";

export default function WeddingHomePage() {
  const [showQrModal, setShowQrModal] = useState<boolean>(false);

  return (
    <div className="flex flex-col min-h-[100dvh] w-full bg-stone-950 text-stone-100 font-sans selection:bg-amber-400 selection:text-stone-950 relative overflow-x-hidden">
      {/* AMBIENT BACKGROUND GLOWS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] bg-rose-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 -left-40 w-[450px] h-[450px] bg-yellow-500/10 rounded-full blur-3xl" />
      </div>

      {/* TOP NAVIGATION BAR */}
      <header className="relative z-10 flex items-center justify-between px-5 py-4 border-b border-stone-800/80 bg-stone-950/70 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-stone-950 font-bold text-xs shadow-md shadow-amber-500/20">
            R&A
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-widest text-amber-200/90 uppercase">
              Romeo & Juliet
            </span>
            <span className="text-[10px] text-stone-400">14 September 2026</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQrModal(true)}
            className="p-2 rounded-full text-stone-300 hover:text-amber-300 hover:bg-stone-800/80 transition-colors flex items-center gap-1.5 text-xs font-medium"
            title="Lihat QR Code Meja Tamu"
          >
            <QrCode className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Kartu QR</span>
          </button>

          <Link
            href="/gallery"
            className="px-3.5 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 border border-amber-400/30 text-amber-200 hover:text-amber-100 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span>Galeri Mempelai</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12 sm:py-16 max-w-xl mx-auto w-full text-center gap-8">
        {/* Monogram & Wedding Crest */}
        <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in-95 duration-500">
          <div className="relative flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border-2 border-amber-400/40 flex items-center justify-center p-1.5 shadow-2xl shadow-amber-500/10">
              <div className="w-full h-full rounded-full border border-amber-400/70 bg-gradient-to-b from-stone-900 to-stone-950 flex flex-col items-center justify-center">
                <span className="text-2xl font-serif font-bold tracking-wider text-amber-200">
                  R & A
                </span>
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 mt-0.5" />
              </div>
            </div>
            <div className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-[10px] font-semibold text-amber-300 backdrop-blur-md">
              OFFICIAL PHOTOBOOTH
            </div>
          </div>

          <div className="mt-3">
            <span className="text-xs font-semibold tracking-[0.3em] text-amber-400/90 uppercase">
              The Wedding Celebration
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-100 mt-2 tracking-tight">
              Romeo & Juliet
            </h1>
          </div>
        </div>

        {/* Date & Venue Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs text-stone-300">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/90 border border-stone-800 backdrop-blur-md">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Senin, 14 September 2026</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/90 border border-stone-800 backdrop-blur-md">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Grand Ballroom, Jakarta</span>
          </div>
        </div>

        {/* Welcome Message */}
        <p className="text-sm text-stone-400 max-w-md leading-relaxed px-2">
          Terima kasih telah hadir dan berbagi kebahagiaan bersama kami. Abadikan momen terbaik Anda di bilik foto digital, rekam doa tulus dari hati, dan lihat foto Anda tampil langsung di layar panggung resepsi.
        </p>

        {/* PRIMARY CALL TO ACTION BUTTONS */}
        <div className="flex flex-col w-full gap-3.5 max-w-sm">
          <Link
            href="/photobooth"
            className="group relative flex items-center justify-center gap-3 py-4 px-8 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-bold text-base tracking-wide shadow-2xl shadow-amber-500/30 transition-all active:scale-98"
          >
            <Camera className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span>Mulai Photobooth 📸</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/gallery"
            className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-stone-900/80 hover:bg-stone-850 border border-stone-800 hover:border-amber-400/40 text-stone-300 hover:text-stone-100 font-semibold text-sm transition-all active:scale-98 shadow-sm"
          >
            <span>Buku Tamu & Galeri Mempelai</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </Link>
        </div>

        {/* 4-STEP EXPERIENCE HIGHLIGHTS */}
        <div className="w-full pt-4">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400/90">
              Alur Pengalaman Tamu
            </h2>
            <span className="text-[11px] text-stone-500">4 Langkah Mudah</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="p-3.5 rounded-2xl bg-stone-900/70 border border-stone-800/80 flex flex-col gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-stone-200">1. Pilih Frame</h3>
                <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                  Tersedia frame 1 s/d 4 pose bernuansa estetik & Korean Life4Cuts.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-900/70 border border-stone-800/80 flex flex-col gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-stone-200">2. Ambil Foto</h3>
                <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                  Pose bersama dengan kamera depan atau belakang dan timer otomatis.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-900/70 border border-stone-800/80 flex flex-col gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-stone-200">3. Rekam Doa</h3>
                <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                  Kirimkan ucapan selamat lewat rekaman suara pribadi untuk mempelai.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-900/70 border border-stone-800/80 flex flex-col gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                <Tv className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-stone-200">4. Layar Resepsi</h3>
                <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                  Foto langsung tayang di proyektor panggung dan siap diunduh ke HP.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-stone-800/80 py-6 text-center text-xs text-stone-500 px-4">
        <p>Virtual Photobooth Pernikahan • Romeo & Juliet</p>
        <p className="text-[10px] text-stone-600 mt-1">
          Dibuat dengan cinta untuk mengabadikan setiap senyuman dan doa restu.
        </p>
      </footer>

      {/* QR CARD MEJA TAMU MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-amber-400/30 rounded-3xl p-6 max-w-sm w-full text-center relative shadow-2xl flex flex-col items-center gap-4">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <QrCode className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-stone-100">
                Kartu QR Meja Tamu
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Tamu dapat memindai kode ini langsung menggunakan kamera ponsel untuk membuka photobooth.
              </p>
            </div>

            {/* QR Card Mockup */}
            <div className="p-4 rounded-2xl bg-stone-950 border border-amber-400/40 flex flex-col items-center gap-3 w-full shadow-inner">
              <div className="w-48 h-48 bg-white rounded-xl p-3 flex items-center justify-center shadow-md">
                {/* SVG QR CODE MOCKUP */}
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full text-stone-950"
                  fill="currentColor"
                >
                  <rect width="100" height="100" fill="white" />
                  {/* Outer corner markers */}
                  <rect x="10" y="10" width="25" height="25" rx="3" fill="#1C1917" />
                  <rect x="15" y="15" width="15" height="15" fill="white" />
                  <rect x="18" y="18" width="9" height="9" fill="#1C1917" />

                  <rect x="65" y="10" width="25" height="25" rx="3" fill="#1C1917" />
                  <rect x="70" y="15" width="15" height="15" fill="white" />
                  <rect x="73" y="18" width="9" height="9" fill="#1C1917" />

                  <rect x="10" y="65" width="25" height="25" rx="3" fill="#1C1917" />
                  <rect x="15" y="70" width="15" height="15" fill="white" />
                  <rect x="18" y="73" width="9" height="9" fill="#1C1917" />

                  {/* Aesthetic barcode patterns */}
                  <rect x="42" y="12" width="6" height="6" fill="#1C1917" />
                  <rect x="52" y="12" width="6" height="6" fill="#1C1917" />
                  <rect x="42" y="24" width="8" height="6" fill="#1C1917" />
                  <rect x="12" y="42" width="6" height="8" fill="#1C1917" />
                  <rect x="24" y="42" width="6" height="6" fill="#1C1917" />
                  <rect x="36" y="38" width="28" height="24" rx="4" fill="#D4AF37" />
                  <text x="50" y="54" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1C1917">
                    R & A
                  </text>
                  <rect x="68" y="42" width="6" height="6" fill="#1C1917" />
                  <rect x="78" y="42" width="8" height="6" fill="#1C1917" />
                  <rect x="42" y="68" width="6" height="6" fill="#1C1917" />
                  <rect x="52" y="78" width="6" height="6" fill="#1C1917" />
                  <rect x="68" y="68" width="6" height="18" fill="#1C1917" />
                  <rect x="78" y="78" width="8" height="8" fill="#1C1917" />
                </svg>
              </div>

              <div className="text-center">
                <span className="text-[11px] font-bold text-amber-200">
                  SCAN UNTUK FOTO & BERI UCAPAN
                </span>
                <p className="text-[10px] text-stone-400 mt-0.5">
                  http://localhost:3000
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs transition-colors"
            >
              Tutup Pratinjau
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
