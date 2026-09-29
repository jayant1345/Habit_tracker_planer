'use client';

import React, { useState, useEffect } from 'react';
import {
  DownloadCloud,
  Smartphone,
  X,
  Sparkles,
  Check,
  Share,
  PlusSquare,
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if running in standalone mode (already installed)
    const isRunningStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone: boolean }).standalone === true;
    setIsStandalone(isRunningStandalone);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Listen for beforeinstallprompt (Android / Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      const isDismissed = sessionStorage.getItem('morpankh_pwa_dismissed') === 'true';
      if (!isRunningStandalone && !isDismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Register Service Worker for offline PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => console.log('MorPankh PWA Service Worker Registered'))
        .catch((err) => console.error('SW registration failed:', err));
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      setShowBanner(false);
    }
  };

  if (isStandalone) return null;

  return (
    <>
      {/* Floating Bottom / Banner Prompt */}
      {showBanner && (
        <div className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-gold-500/40 bg-peacock-950/95 p-4 shadow-2xl backdrop-blur-xl md:bottom-6 md:right-6 md:left-auto">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 text-peacock-950 font-bold shadow-gold-sm">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Install MorPankh Mobile App</h4>
                <p className="text-[11px] text-peacock-300">
                  Add to home screen for offline access & watch sync
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowBanner(false);
                sessionStorage.setItem('morpankh_pwa_dismissed', 'true');
              }}
              className="text-peacock-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 flex space-x-2">
            <button
              onClick={handleInstallClick}
              className="flex-1 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 py-2 text-center text-xs font-bold text-peacock-950 shadow-gold-sm hover:from-gold-400"
            >
              Install Now (PWA)
            </button>
            <button
              onClick={() => {
                setShowBanner(false);
                sessionStorage.setItem('morpankh_pwa_dismissed', 'true');
              }}
              className="rounded-xl border border-peacock-800 px-3 py-2 text-xs font-semibold text-peacock-300"
            >
              Later
            </button>
          </div>
        </div>
      )}

      {/* iOS Installation Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-gold-500/40 bg-peacock-950 p-6 text-center shadow-2xl">
            <Smartphone className="mx-auto h-10 w-10 text-gold-400" />
            <h3 className="mt-3 text-base font-bold text-white">
              Install MorPankh on iOS Safari
            </h3>
            <p className="mt-1 text-xs text-peacock-300">
              Follow these simple steps to install MorPankh on your iPhone or iPad:
            </p>

            <div className="mt-4 space-y-2.5 text-left text-xs text-peacock-200">
              <div className="flex items-center space-x-2 rounded-xl bg-peacock-900 p-2.5 border border-peacock-800">
                <Share className="h-4 w-4 text-gold-400" />
                <span>1. Tap the <strong>Share</strong> button at bottom of Safari</span>
              </div>
              <div className="flex items-center space-x-2 rounded-xl bg-peacock-900 p-2.5 border border-peacock-800">
                <PlusSquare className="h-4 w-4 text-gold-400" />
                <span>2. Scroll down and tap <strong>Add to Home Screen</strong></span>
              </div>
              <div className="flex items-center space-x-2 rounded-xl bg-peacock-900 p-2.5 border border-peacock-800">
                <Check className="h-4 w-4 text-emerald-400" />
                <span>3. Tap <strong>Add</strong> in the top-right corner</span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-xl bg-gold-500 py-2.5 text-xs font-bold text-peacock-950"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
