"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  SwitchCamera,
  RotateCcw,
  Download,
  Mic,
  ArrowRight,
  Sparkles,
  Timer,
  Heart,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  X,
} from "lucide-react";
import confetti from "canvas-confetti";
import { FRAME_TEMPLATES, FrameTemplate } from "./frameTemplates";

export default function PhotoboothPage() {
  const router = useRouter();

  // State
  const [selectedTemplate, setSelectedTemplate] = useState<FrameTemplate>(FRAME_TEMPLATES[0]);
  const [cameraFacingMode, setCameraFacingMode] = useState<"user" | "environment">("user");
  const [cameraState, setCameraState] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [previewStep, setPreviewStep] = useState<"capture" | "preview">("capture");
  const [timerSetting, setTimerSetting] = useState<0 | 3>(3);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flashActive, setFlashActive] = useState<boolean>(false);
  const [isProcessingCapture, setIsProcessingCapture] = useState<boolean>(false);
  const [showNextModal, setShowNextModal] = useState<boolean>(false);

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Web Audio shutter click sound generator
  const playShutterSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // Audio playback failure is non-fatal
    }
  }, []);

  // Stop camera tracks helper
  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // Ignore track stop error
        }
      });
      streamRef.current = null;
    }
  }, []);

  const [retryKey, setRetryKey] = useState<number>(0);

  // Initialize camera stream via useEffect
  useEffect(() => {
    let isCancelled = false;

    if (previewStep !== "capture") return;

    stopCameraStream();

    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      const timer = setTimeout(() => {
        if (!isCancelled) {
          setCameraState("error");
          setErrorMessage("Fitur kamera tidak didukung atau tidak tersedia di peramban ini.");
        }
      }, 0);
      return () => {
        isCancelled = true;
        clearTimeout(timer);
      };
    }

    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: cameraFacingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })
      .then(async (stream) => {
        if (isCancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {
            // Autoplay handled by attributes
          });
        }

        setCameraState("ready");
      })
      .catch((err: unknown) => {
        if (isCancelled) return;
        setCameraState("error");
        const error = err as { name?: string; message?: string };
        if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
          setErrorMessage("Izin akses kamera ditolak. Silakan izinkan akses kamera pada pengaturan browser.");
        } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
          setErrorMessage("Tidak ditemukan perangkat kamera yang dapat digunakan.");
        } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
          setErrorMessage("Kamera sedang digunakan oleh aplikasi lain.");
        } else {
          setErrorMessage("Gagal mengakses kamera: " + (error.message || "Kesalahan tidak dikenal"));
        }
      });

    return () => {
      isCancelled = true;
      stopCameraStream();
    };
  }, [cameraFacingMode, previewStep, retryKey, stopCameraStream]);

  // Retry Camera action
  const handleRetryCamera = () => {
    setCameraState("loading");
    setErrorMessage("");
    setRetryKey((k) => k + 1);
  };

  // Toggle Camera Front / Back
  const handleToggleFacingMode = () => {
    setCameraFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  // Trigger Capture process
  const triggerCapture = () => {
    if (isProcessingCapture || cameraState !== "ready") return;

    if (timerSetting > 0) {
      setCountdown(timerSetting);
      let current = timerSetting;
      const interval = setInterval(() => {
        current -= 1;
        if (current <= 0) {
          clearInterval(interval);
          setCountdown(null);
          executeCanvasCapture();
        } else {
          setCountdown(current);
        }
      }, 1000);
    } else {
      executeCanvasCapture();
    }
  };

  // Perform HTML5 Canvas compositing with Promise-wrapped SVG overlay and 0.82 JPEG compression
  const executeCanvasCapture = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || video.videoWidth === 0 || video.videoHeight === 0) {
      return;
    }

    setIsProcessingCapture(true);

    // Flash animation and sound
    setFlashActive(true);
    playShutterSound();
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(60);
    }
    setTimeout(() => setFlashActive(false), 280);

    const targetWidth = selectedTemplate.width;
    const targetHeight = selectedTemplate.height;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setIsProcessingCapture(false);
      return;
    }

    // 1. Calculate aspect ratio cover crop coordinates
    const vWidth = video.videoWidth;
    const vHeight = video.videoHeight;
    const videoRatio = vWidth / vHeight;
    const targetRatio = targetWidth / targetHeight;

    let sx = 0;
    let sy = 0;
    let sWidth = vWidth;
    let sHeight = vHeight;

    if (videoRatio > targetRatio) {
      // Video wider than frame: crop horizontal edges
      sWidth = vHeight * targetRatio;
      sx = (vWidth - sWidth) / 2;
    } else {
      // Video taller than frame: crop vertical edges
      sHeight = vWidth / targetRatio;
      sy = (vHeight - sHeight) / 2;
    }

    // 2. Draw camera video with mirroring if user/selfie camera
    ctx.save();
    if (cameraFacingMode === "user") {
      ctx.translate(targetWidth, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);
    ctx.restore();

    // 3. Composite SVG Frame Template on top using a Promise-wrapped Image
    const svgString = selectedTemplate.getSvgContent(targetWidth, targetHeight);
    const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;

    try {
      const frameImage = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
        img.src = svgUrl;
      });

      ctx.drawImage(frameImage, 0, 0, targetWidth, targetHeight);
    } catch (err) {
      console.warn("SVG overlay rendering fallback:", err);
    }

    // 4. Export JPEG with 0.82 compression ratio to prevent exceeding mobile browser sessionStorage quota
    const finalDataUrl = canvas.toDataURL("image/jpeg", 0.82);
    setCapturedImage(finalDataUrl);

    // Save directly to sessionStorage
    try {
      sessionStorage.setItem("photobooth_photo", finalDataUrl);
      sessionStorage.setItem("photobooth_template", selectedTemplate.id);
      sessionStorage.setItem("photobooth_timestamp", new Date().toISOString());
    } catch (e) {
      console.warn("SessionStorage save warning:", e);
    }

    setPreviewStep("preview");
    setIsProcessingCapture(false);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 55,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#D4AF37", "#FDF0A6", "#E0BFB8", "#FFFFFF"],
      });
    } catch {
      // Confetti optional
    }
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedImage(null);
    setPreviewStep("capture");
  };

  // Download photo
  const handleDownload = () => {
    if (!capturedImage) return;
    const link = document.createElement("a");
    link.href = capturedImage;
    link.download = `wedding-photobooth-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Proceed to Audio Recording stage
  const handleProceedToAudio = () => {
    if (!capturedImage) return;

    try {
      sessionStorage.setItem("photobooth_photo", capturedImage);
      sessionStorage.setItem("photobooth_template", selectedTemplate.id);
      sessionStorage.setItem("photobooth_timestamp", new Date().toISOString());
    } catch {
      // sessionStorage quota or security error
    }

    setShowNextModal(true);
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-stone-950 text-stone-100 select-none overflow-hidden font-sans">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* TOP BAR */}
      <header className="flex items-center justify-between px-4 py-3 bg-stone-900/80 backdrop-blur-md border-b border-stone-800/80 z-20 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 flex items-center justify-center shadow-md">
            <Heart className="w-4 h-4 text-stone-950 fill-stone-950" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wide text-amber-200/90 leading-tight">
              Virtual Photobooth
            </h1>
            <p className="text-[11px] text-stone-400">Wedding Celebration</p>
          </div>
        </div>

        {previewStep === "capture" && (
          <div className="flex items-center gap-2">
            {/* Timer Toggle Button */}
            <button
              onClick={() => setTimerSetting((prev) => (prev === 3 ? 0 : 3))}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95 ${
                timerSetting > 0
                  ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                  : "bg-stone-800 text-stone-400 border border-stone-700"
              }`}
              title="Toggle Timer 3 Detik"
              aria-label="Toggle Timer"
            >
              <Timer className="w-3.5 h-3.5" />
              <span>{timerSetting > 0 ? "3s" : "Off"}</span>
            </button>

            {/* Flip Camera Button */}
            <button
              onClick={handleToggleFacingMode}
              disabled={cameraState !== "ready"}
              className="p-2 rounded-full bg-stone-800 text-stone-200 hover:bg-stone-700 border border-stone-700/80 transition-all active:scale-95 disabled:opacity-50"
              title="Putar Kamera Depan/Belakang"
              aria-label="Putar Kamera"
            >
              <SwitchCamera className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>

      {/* MAIN VIEWPORT AREA */}
      <main className="relative flex-1 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
        {/* Flash Effect Overlay */}
        <div
          className={`absolute inset-0 bg-white pointer-events-none z-40 transition-opacity duration-200 ${
            flashActive ? "opacity-95" : "opacity-0"
          }`}
        />

        {previewStep === "capture" ? (
          /* ================= CAMERA CAPTURE VIEW ================= */
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Aspect-Ratio Box containing Camera Video & Frame Overlay */}
            <div
              className={`relative overflow-hidden rounded-2xl shadow-2xl bg-black border border-stone-800 flex items-center justify-center max-h-full transition-all duration-300 ${
                selectedTemplate.aspectRatio === "9:16"
                  ? "aspect-[9/16] h-full max-w-[420px]"
                  : "aspect-[3/4] h-full max-w-[480px]"
              }`}
            >
              {/* Camera Video Stream */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`absolute inset-0 w-full h-full object-cover transition-transform ${
                  cameraFacingMode === "user" ? "-scale-x-100" : ""
                }`}
              />

              {/* Frame SVG Overlay Preview in real-time */}
              <div
                className="absolute inset-0 w-full h-full pointer-events-none z-10 [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
                dangerouslySetInnerHTML={{
                  __html: selectedTemplate.getSvgContent(
                    selectedTemplate.width,
                    selectedTemplate.height
                  ),
                }}
              />

              {/* Camera Loading Spinner */}
              {cameraState === "loading" && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-stone-950/80 backdrop-blur-sm gap-3">
                  <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
                  <p className="text-xs text-stone-300 font-medium">Menghubungkan Kamera...</p>
                </div>
              )}

              {/* Camera Error Message */}
              {cameraState === "error" && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-stone-950/95 gap-3">
                  <AlertCircle className="w-10 h-10 text-rose-400" />
                  <p className="text-xs text-rose-200">{errorMessage}</p>
                  <button
                    onClick={handleRetryCamera}
                    className="mt-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-amber-200 text-xs font-semibold rounded-full border border-amber-500/30 active:scale-95 transition-all"
                  >
                    Coba Lagi
                  </button>
                </div>
              )}

              {/* Countdown Overlay (3, 2, 1) */}
              {countdown !== null && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                  <div className="w-24 h-24 rounded-full border-4 border-amber-400 bg-stone-900/80 flex items-center justify-center animate-ping">
                    <span className="text-5xl font-bold text-amber-300 font-mono">
                      {countdown}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ================= PHOTO PREVIEW VIEW ================= */
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <div
              className={`relative overflow-hidden rounded-2xl shadow-2xl border border-amber-400/30 max-h-full transition-all ${
                selectedTemplate.aspectRatio === "9:16"
                  ? "aspect-[9/16] h-full max-w-[420px]"
                  : "aspect-[3/4] h-full max-w-[480px]"
              }`}
            >
              {capturedImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={capturedImage}
                  alt="Hasil Photobooth"
                  className="w-full h-full object-contain bg-black"
                />
              )}

              {/* Success Badge */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1 bg-stone-950/80 backdrop-blur-md rounded-full border border-amber-400/40 text-[11px] font-medium text-amber-200 shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Foto Siap</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* BOTTOM CONTROLS & SELECTION DOCK */}
      <footer className="shrink-0 pb-6 pt-3 px-4 bg-stone-900/90 backdrop-blur-md border-t border-stone-800/80 z-20 flex flex-col gap-3">
        {previewStep === "capture" ? (
          <>
            {/* Frame Template Selector Pills */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto py-1 scrollbar-none">
              {FRAME_TEMPLATES.map((tmpl) => {
                const isSelected = selectedTemplate.id === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    onClick={() => setSelectedTemplate(tmpl)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 active:scale-95 ${
                      isSelected
                        ? "bg-gradient-to-r from-amber-500/30 via-yellow-500/20 to-amber-500/30 text-amber-200 border border-amber-400/70 shadow-sm shadow-amber-500/20"
                        : "bg-stone-800/80 text-stone-400 border border-stone-700/60 hover:text-stone-200 hover:bg-stone-800"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>{tmpl.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-950/60 text-stone-400 font-mono">
                      {tmpl.aspectRatio}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Shutter Button Row */}
            <div className="flex items-center justify-center pt-1">
              <button
                onClick={triggerCapture}
                disabled={cameraState !== "ready" || isProcessingCapture}
                className="group relative flex items-center justify-center w-20 h-20 rounded-full transition-transform active:scale-90 disabled:opacity-50 disabled:pointer-events-none"
                aria-label="Ambil Foto"
              >
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border-4 border-amber-400/60 group-hover:border-amber-400 group-hover:scale-105 transition-all shadow-lg shadow-amber-500/10" />
                {/* Inner Shutter Core */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-100 via-white to-amber-50 flex items-center justify-center text-stone-900 shadow-md">
                  <Camera className="w-7 h-7 text-stone-800" />
                </div>
              </button>
            </div>
          </>
        ) : (
          /* PREVIEW ACTION BUTTONS */
          <div className="flex flex-col gap-2.5 max-w-md mx-auto w-full">
            <div className="flex items-center gap-2">
              {/* Retake Button */}
              <button
                onClick={handleRetake}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-750 active:bg-stone-700 border border-stone-700 text-stone-200 text-sm font-semibold transition-all active:scale-95"
              >
                <RotateCcw className="w-4 h-4 text-stone-400" />
                <span>Foto Ulang</span>
              </button>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                className="flex items-center justify-center p-3 rounded-xl bg-stone-800 hover:bg-stone-750 active:bg-stone-700 border border-stone-700 text-amber-200 transition-all active:scale-95"
                title="Unduh Foto ke Galeri"
                aria-label="Unduh Foto"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>

            {/* Proceed to Audio Recording Button */}
            <button
              onClick={handleProceedToAudio}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/25 transition-all active:scale-98"
            >
              <Mic className="w-4 h-4 text-stone-950" />
              <span>Lanjut ke Rekaman Suara</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}
      </footer>

      {/* CONFIRMATION / NEXT STAGE MODAL */}
      {showNextModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-stone-900 border border-amber-400/40 rounded-2xl p-6 shadow-2xl text-center flex flex-col items-center gap-4">
            <button
              onClick={() => setShowNextModal(false)}
              className="absolute top-3 right-3 p-1 text-stone-400 hover:text-stone-200 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-stone-100">Foto Berhasil Disimpan!</h3>
              <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
                Foto kenangan Anda telah diamankan. Langkah berikutnya adalah merekam pesan suara & ucapan selamat untuk kedua mempelai.
              </p>
            </div>

            <div className="flex flex-col w-full gap-2 mt-2">
              <button
                onClick={() => {
                  setShowNextModal(false);
                  router.push("/photobooth/audio");
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-sm transition-all active:scale-95"
              >
                <Mic className="w-4 h-4" />
                <span>Mulai Rekam Suara</span>
              </button>

              <button
                onClick={() => setShowNextModal(false)}
                className="w-full py-2.5 px-4 text-xs font-semibold text-stone-400 hover:text-stone-200 transition-colors"
              >
                Kembali ke Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
