import React, { useEffect, useRef } from "react";

const GoogleTranslate = ({ onReady }) => {
  const initializedRef = useRef(false);
  const readyRef = useRef(false);

  useEffect(() => {
    let interval = null;
    let fallback = null;

    const ready = () => {
      if (readyRef.current) return;

      readyRef.current = true;

      if (interval) {
        clearInterval(interval);
        interval = null;
      }

      if (fallback) {
        clearTimeout(fallback);
        fallback = null;
      }

      onReady?.();
    };

    const getLanguage = () => {
      try {
        const location = JSON.parse(
          localStorage.getItem("location") || "{}"
        );

        return location?.lang || "en";
      } catch {
        return "en";
      }
    };

    const lang = getLanguage();

    // English = ngôn ngữ gốc, không cần Google Translate
    if (!lang || lang === "en") {
      ready();
      return;
    }

    // Set cookie TRƯỚC khi Google Translate khởi tạo
    document.cookie = `googtrans=/en/${lang}; path=/`;

    const initGoogleTranslate = () => {
      if (initializedRef.current) return;

      if (
        !window.google?.translate?.TranslateElement
      ) {
        return;
      }

      initializedRef.current = true;

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
          includedLanguages: lang,
        },
        "google_translate_element"
      );

      let attempts = 0;

      interval = setInterval(() => {
        attempts++;

        const select = document.querySelector(
          ".goog-te-combo"
        );

        if (!select) {
          if (attempts >= 20) {
            ready();
          }

          return;
        }

        // Google đã nhận đúng language
        if (select.value === lang) {
          ready();
          return;
        }

        // Đổi language ngay lập tức
        select.value = lang;

        select.dispatchEvent(
          new Event("change", {
            bubbles: true,
          })
        );

        // Không chờ 800ms
        ready();
      }, 100);

      // Fallback tối đa 3 giây
      fallback = setTimeout(() => {
        console.warn(
          "Google Translate initialization timeout."
        );

        ready();
      }, 3000);
    };

    window.googleTranslateElementInit =
      initGoogleTranslate;

    // Google Translate đã load
    if (
      window.google?.translate?.TranslateElement
    ) {
      initGoogleTranslate();
    } else {
      const existingScript = document.querySelector(
        'script[src*="translate.google.com/translate_a/element.js"]'
      );

      if (!existingScript) {
        const script = document.createElement("script");

        script.src =
          "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

        script.async = true;

        document.body.appendChild(script);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }

      if (fallback) {
        clearTimeout(fallback);
      }
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

