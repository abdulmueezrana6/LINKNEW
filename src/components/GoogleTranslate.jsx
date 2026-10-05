import React, { useEffect, useRef } from "react";

const GoogleTranslate = ({ onReady }) => {
  const initializedRef = useRef(false);
  const readyRef = useRef(false);

  useEffect(() => {
    let interval = null;
    let timeout = null;

    const ready = () => {
      if (readyRef.current) {
        return;
      }

      readyRef.current = true;

      if (interval) {
        clearInterval(interval);
      }

      if (timeout) {
        clearTimeout(timeout);
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

    if (!lang || lang === "en") {
      ready();
      return;
    }

    // Google Translate cookie
    document.cookie = `googtrans=/en/${lang}; path=/`;

    const initGoogleTranslate = () => {
      if (initializedRef.current) {
        return;
      }

      if (
        !window.google ||
        !window.google.translate ||
        !window.google.translate.TranslateElement
      ) {
        return;
      }

      initializedRef.current = true;

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
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
          return;
        }

        console.log(
          "Google Translate:",
          select.value,
          "=>",
          lang
        );

        if (select.value !== lang) {
          select.value = lang;

          select.dispatchEvent(
            new Event("change", {
              bubbles: true,
              cancelable: true,
            })
          );

          // Cho Google thời gian thay đổi DOM
          setTimeout(() => {
            ready();
          }, 800);
        } else {
          ready();
        }

        if (attempts >= 20) {
          ready();
        }
      }, 250);

      // Fallback riêng cho Google Translate
      timeout = setTimeout(() => {
        console.warn("Google Translate did not initialize.");
        ready();
      }, 4500);
    };

    window.googleTranslateElementInit =
      initGoogleTranslate;

    // Google Translate đã tồn tại
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

    // Fallback cuối cùng
    timeout = setTimeout(() => {
      ready();
    }, 5000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }

      if (timeout) {
        clearTimeout(timeout);
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
