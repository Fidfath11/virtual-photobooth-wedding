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
  Layers,
} from "lucide-react";
import confetti from "canvas-confetti";
import { FRAME_TEMPLATES, FrameTemplate } from "./frameTemplates";

export default function PhotoboothPage() {
  const router = useRouter();

  // Template State
  const [selectedTemplate, setSelectedTemplate] = useState<FrameTemplate>(FRAME_TEMPLATES[3]); // Default to 4-Cuts

  // Camera State
  const [cameraFacingMode, setCameraFacingMode] = useState<"user" | "environment">("user");
  const [cameraState, setCameraState] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [retryKey, setRetryKey] = useState<number>(0);

  // Multi-Shot Collage State
  const [capturedShots, setCapturedShots] = useState<string[]>([]);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [previewStep, setPreviewStep] = useState<"capture" | "preview">("capture");
  const [timerSetting, setTimerSetting] = useState<0 | 3>(3);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flashActive, setFlashActive] = useState<boolean>(false);
  const [isProcessingCapture, setIsProcessingCapture] = useState<boolean>(false);
  const [statusNotice, setStatusNotice] = useState<string>("");
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
      // Non-fatal
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

  // Handle Changing Template
  const handleSelectTemplate = (template: FrameTemplate) => {
    setSelectedTemplate(template);
    setCapturedShots([]); // Reset shots when changing collage format
    setStatusNotice("");
  };

  // Helper to load an image from URL via Promise
  const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = url;
    });
  };

  // Trigger Multi-Shot Capture
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
          snapSingleShot();
        } else {
          setCountdown(current);
        }
      }, 1000);
    } else {
      snapSingleShot();
    }
  };

  // Snaps 1 single shot and either advances or triggers final compositing
  const snapSingleShot = async () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) return;

    setIsProcessingCapture(true);

    // Flash animation and sound
    setFlashActive(true);
    playShutterSound();
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(60);
    }
    setTimeout(() => setFlashActive(false), 260);

    // Calculate crop for slot aspect ratio
    const currentSlotIndex = capturedShots.length;
    const currentSlot = selectedTemplate.slots[currentSlotIndex] || selectedTemplate.slots[0];
    const slotRatio = currentSlot.width / currentSlot.height;

    const vWidth = video.videoWidth;
    const vHeight = video.videoHeight;
    const videoRatio = vWidth / vHeight;

    let sx = 0, sy = 0, sWidth = vWidth, sHeight = vHeight;
    if (videoRatio > slotRatio) {
      sWidth = vHeight * slotRatio;
      sx = (vWidth - sWidth) / 2;
    } else {
      sHeight = vWidth / slotRatio;
      sy = (vHeight - sHeight) / 2;
    }

    // Temporary canvas for this single shot
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = currentSlot.width;
    tempCanvas.height = currentSlot.height;
    const tempCtx = tempCanvas.getContext("2d");

    if (tempCtx) {
      if (cameraFacingMode === "user") {
        tempCtx.translate(tempCanvas.width, 0);
        tempCtx.scale(-1, 1);
      }
      tempCtx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, tempCanvas.width, tempCanvas.height);
    }

    const shotDataUrl = tempCanvas.toDataURL("image/jpeg", 0.9);
    const updatedShots = [...capturedShots, shotDataUrl];
    setCapturedShots(updatedShots);

    // Check if more shots are required for this collage template
    if (updatedShots.length < selectedTemplate.photoCount) {
      const nextPoseNumber = updatedShots.length + 1;
      setStatusNotice(`Pose ${updatedShots.length} tersimpan! Siap untuk Pose ${nextPoseNumber}...`);
      setIsProcessingCapture(false);
    } else {
      // All shots completed: Composite the whole Photostrip!
      setStatusNotice("Menggabungkan seluruh foto kolase...");
      await compositeFinalPhotostrip(updatedShots);
    }
  };

  // Composite all captured shots into the final high-res Photostrip canvas
  const compositeFinalPhotostrip = async (shots: string[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const targetWidth = selectedTemplate.width;
    const targetHeight = selectedTemplate.height;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setIsProcessingCapture(false);
      return;
    }

    try {
      // 1. Fill base background color
      ctx.fillStyle = selectedTemplate.theme === "noir" ? "#09090B" : "#FAF8F5";
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      // 2. Draw each photo into its designated slot
      for (let i = 0; i < shots.length; i++) {
        const slot = selectedTemplate.slots[i];
        if (!slot) continue;

        const photoImg = await loadImage(shots[i]);

        ctx.save();
        // Create rounded rect clip for the slot
        const rx = slot.rx || 14;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(slot.x, slot.y, slot.width, slot.height, rx);
        } else {
          ctx.rect(slot.x, slot.y, slot.width, slot.height);
        }
        ctx.clip();

        ctx.drawImage(photoImg, slot.x, slot.y, slot.width, slot.height);
        ctx.restore();
      }

      // 3. Draw the aesthetic SVG Frame Overlay on top
      const svgString = selectedTemplate.getSvgContent(targetWidth, targetHeight);
      const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;

      try {
        const frameImage = await loadImage(svgUrl);
        ctx.drawImage(frameImage, 0, 0, targetWidth, targetHeight);
      } catch (err) {
        console.warn("SVG overlay rendering fallback:", err);
      }

      // 4. Export high-quality Photostrip JPEG (0.82 compression for mobile sessionStorage)
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
      setStatusNotice("");

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.65 },
          colors: ["#D4AF37", "#FDF0A6", "#E11D48", "#FFFFFF"],
        });
      } catch {
        // Confetti optional
      }
    } catch (error) {
      console.error("Collage composition error:", error);
      setIsProcessingCapture(false);
    }
  };

  // Reset / Retake all photos
  const handleRetakeAll = () => {
    setCapturedShots([]);
    setCapturedImage(null);
    setStatusNotice("");
    setPreviewStep("capture");
  };

  // Download photo
  const handleDownload = () => {
    if (!capturedImage) return;
    const link = document.createElement("a");
    link.href = capturedImage;
    link.download = `photostrip-${selectedTemplate.id}-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Proceed to Audio Recording stage
  const handleProceedToAudio = () => {
    if (!capturedImage) return;
    setShowNextModal(true);
  };

  // Current active slot aspect ratio for the live camera viewfinder
  const currentSlot = selectedTemplate.slots[capturedShots.length] || selectedTemplate.slots[0];
  const slotRatioStyle = {
    aspectRatio: `${currentSlot.width} / ${currentSlot.height}`,
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
            <p className="text-[11px] text-stone-400">Wedding Photostrip Studio</p>
          </div>
        </div>

        {previewStep === "capture" && (
          <div className="flex items-center gap-2">
            {/* Timer Toggle */}
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

            {/* Flip Camera */}
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
          <div className="relative w-full h-full flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 max-h-full">
            {/* Live Camera Viewfinder Box */}
            <div
              style={slotRatioStyle}
              className="relative overflow-hidden rounded-2xl shadow-2xl bg-black border border-stone-800 flex items-center justify-center max-h-[72vh] sm:max-h-[80vh] w-auto transition-all duration-300"
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

              {/* Status Overlay Badge (Pose X of N) */}
              <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-amber-400/40 text-xs font-semibold text-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Pose {capturedShots.length + 1} dari {selectedTemplate.photoCount}</span>
              </div>

              {/* Reset Sequence Button if at least 1 shot taken */}
              {capturedShots.length > 0 && (
                <button
                  onClick={() => setCapturedShots([])}
                  className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-md border border-stone-700 text-[11px] font-medium text-stone-300 hover:text-white"
                  title="Ulangi dari Pose 1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Ulangi</span>
                </button>
              )}

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

            {/* MINI PHOTOSTRIP PROGRESS DOCK (Shows slots 1..N with thumbnails) */}
            <div className="flex sm:flex-col items-center justify-center gap-1.5 p-2 rounded-2xl bg-stone-900/80 backdrop-blur-md border border-stone-800 shrink-0">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 sm:mb-1 hidden sm:block">
                Slots
              </span>
              {Array.from({ length: selectedTemplate.photoCount }).map((_, idx) => {
                const isTaken = idx < capturedShots.length;
                const isCurrent = idx === capturedShots.length;
                return (
                  <div
                    key={idx}
                    className={`relative w-12 h-10 sm:w-14 sm:h-12 rounded-lg overflow-hidden border transition-all flex items-center justify-center ${
                      isCurrent
                        ? "border-amber-400 shadow-md shadow-amber-500/30 ring-2 ring-amber-400/40"
                        : isTaken
                        ? "border-emerald-500/80"
                        : "border-stone-700/60 bg-stone-950/60"
                    }`}
                  >
                    {isTaken ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={capturedShots[idx]}
                        alt={`Pose ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span
                        className={`text-xs font-mono font-bold ${
                          isCurrent ? "text-amber-300 animate-pulse" : "text-stone-600"
                        }`}
                      >
                        {idx + 1}
                      </span>
                    )}

                    {isTaken && (
                      <div className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center text-[8px] text-stone-950 font-bold">
                        ✓
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ================= PHOTO PREVIEW VIEW ================= */
          <div className="relative w-full h-full flex flex-col items-center justify-center overflow-y-auto py-2">
            <div className="relative max-h-[75vh] w-auto overflow-hidden rounded-2xl shadow-2xl border border-amber-400/30 transition-all flex items-center justify-center">
              {capturedImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={capturedImage}
                  alt="Hasil Photostrip Kolase"
                  className="max-h-[75vh] w-auto object-contain rounded-2xl bg-stone-900 shadow-2xl"
                />
              )}

              {/* Success Badge */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1 bg-stone-950/85 backdrop-blur-md rounded-full border border-amber-400/40 text-[11px] font-medium text-amber-200 shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Photostrip Siap</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* BOTTOM CONTROLS & SELECTION DOCK */}
      <footer className="shrink-0 pb-6 pt-3 px-4 bg-stone-900/90 backdrop-blur-md border-t border-stone-800/80 z-20 flex flex-col gap-3">
        {previewStep === "capture" ? (
          <>
            {/* Status Notice if taking multiple poses */}
            {statusNotice && (
              <div className="text-center text-xs font-medium text-amber-300 animate-pulse -mt-1">
                {statusNotice}
              </div>
            )}

            {/* Collage Format Selector Pills */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto py-1 scrollbar-none">
              {FRAME_TEMPLATES.map((tmpl) => {
                const isSelected = selectedTemplate.id === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    onClick={() => handleSelectTemplate(tmpl)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 active:scale-95 ${
                      isSelected
                        ? "bg-gradient-to-r from-amber-500/30 via-yellow-500/20 to-amber-500/30 text-amber-200 border border-amber-400/70 shadow-sm shadow-amber-500/20"
                        : "bg-stone-800/80 text-stone-400 border border-stone-700/60 hover:text-stone-200 hover:bg-stone-800"
                    }`}
                  >
                    <Layers className="w-3 h-3 text-amber-400" />
                    <span>{tmpl.name}</span>
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
                aria-label={`Ambil Foto ${capturedShots.length + 1}`}
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
              {/* Retake All Button */}
              <button
                onClick={handleRetakeAll}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-750 active:bg-stone-700 border border-stone-700 text-stone-200 text-sm font-semibold transition-all active:scale-95"
              >
                <RotateCcw className="w-4 h-4 text-stone-400" />
                <span>Foto Ulang</span>
              </button>

              {/* Download Photostrip Button */}
              <button
                onClick={handleDownload}
                className="flex items-center justify-center p-3 rounded-xl bg-stone-800 hover:bg-stone-750 active:bg-stone-700 border border-stone-700 text-amber-200 transition-all active:scale-95"
                title="Unduh Photostrip ke Galeri"
                aria-label="Unduh Photostrip"
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
              <h3 className="text-lg font-bold text-stone-100">Photostrip Berhasil Disimpan!</h3>
              <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
                Seluruh {selectedTemplate.photoCount} foto kolase Anda telah tergabung dengan indah. Langkah berikutnya adalah merekam pesan suara untuk kedua mempelai.
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
