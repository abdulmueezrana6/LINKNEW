import React, { useEffect, useRef } from "react";

const LANGUAGES =
  "vi,fr,de,es,it,pt,ru,uk,zh-CN,zh-TW,ja,ko,th,id";

const GoogleTranslate = ({ onReady }) => {
  const initialized = useRef(false);
  const ready = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const finish = () => {
      if (cancelled || ready.current) {
        return;
      }

      ready.current = true;
      onReady?.();
    };

    // =========================
    // Get language
    // =========================

    let locationData = {};

    try {
      locationData = JSON.parse(
        localStorage.getItem("location") || "{}"
      );
    } catch {}

    let lang = locationData?.lang;

    if (!lang) {
      lang = navigator.language || "en";
    }

    lang = lang.toLowerCase();

    if (lang === "zh-cn") {
      lang = "zh-CN";
    } else if (lang === "zh-tw") {
      lang = "zh-TW";
    } else {
      lang = lang.split("-")[0];
    }

    // =========================
    // English
    // =========================

    if (lang === "en") {
      finish();
      return;
    }

    // =========================
    // Set cookie FIRST
    // =========================

    document.cookie =
      `googtrans=/en/${lang}; path=/`;

    // =========================
    // Initialize Google
    // =========================

    const initialize = () => {
      if (
        cancelled ||
        initialized.current
      ) {
        return;
      }

      if (!window.google?.translate?.TranslateElement) {
        return;
      }

      initialized.current = true;

      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            autoDisplay: false,
            includedLanguages: LANGUAGES,
          },
          "google_translate_element"
        );
      } catch (error) {
        console.warn(
          "Google Translate:",
          error
        );
      }

      // Không đợi .goog-te-combo
      finish();
    };

    window.googleTranslateElementInit =
      initialize;

    // =========================
    // Already loaded
    // =========================

    if (
      window.google?.translate?.TranslateElement
    ) {
      initialize();

      return () => {
        cancelled = true;
      };
    }

    // =========================
    // Existing script
    // =========================

    const existingScript =
      document.querySelector(
        'script[src*="translate.google.com/translate_a/element.js"]'
      );

    if (existingScript) {
      const timer = setInterval(() => {
        if (
          window.google?.translate?.TranslateElement
        ) {
          clearInterval(timer);
          initialize();
        }
      }, 20);

      return () => {
        cancelled = true;
        clearInterval(timer);
      };
    }

    // =========================
    // Load script
    // =========================

    const script =
      document.createElement("script");

    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

    script.async = true;

    document.head.appendChild(script);

    // =========================
    // Don't block app too long
    // =========================

    const timeout = setTimeout(() => {
      finish();
    }, 1200);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [onReady]);

  return (
    <div
      id="google_translate_element"
      style={{ display: "none" }}
    />
  );
};

export default GoogleTranslate;