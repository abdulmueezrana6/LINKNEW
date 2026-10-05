import React, { useEffect, useRef } from "react";

const GoogleTranslate = ({ targetLanguage, onReady }) => {
  const initialized = useRef(false);
  const readyCalled = useRef(false);

  useEffect(() => {
    if (!targetLanguage || targetLanguage === "en") {
      onReady?.();
      return;
    }

    let checkInterval;
    let script;

    const finish = () => {
      if (readyCalled.current) {
        return;
      }

      readyCalled.current = true;

      clearInterval(checkInterval);

      // Chờ browser paint phần DOM đã dịch
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            onReady?.();
          });
        });
      });
    };

    const checkTranslation = () => {
      const html = document.documentElement;

      const translated =
        html.classList.contains("translated-ltr") ||
        html.classList.contains("translated-rtl");

      const select = document.querySelector(
        ".goog-te-combo"
      );

      const selectedLanguage =
        select?.value || "";

      if (
        translated ||
        selectedLanguage === targetLanguage
      ) {
        finish();
      }
    };

    const initGoogleTranslate = () => {
      if (initialized.current) {
        return;
      }

      if (
        !window.google ||
        !window.google.translate
      ) {
        return;
      }

      initialized.current = true;

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
        },
        "google_translate_element"
      );

      // Google Translate cần thời gian tạo iframe/select
      checkInterval = setInterval(() => {
        checkTranslation();
      }, 50);

      // Check ngay
      checkTranslation();
    };

    window.googleTranslateElementInit = initGoogleTranslate;

    // Google Translate đã tồn tại
    if (
      window.google &&
      window.google.translate
    ) {
      initGoogleTranslate();
    } else {
      // Script chưa tồn tại
      script = document.createElement("script");

      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

      script.async = true;

      document.head.appendChild(script);
    }

    return () => {
      clearInterval(checkInterval);

      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [targetLanguage, onReady]);

  return (
    <div
      id="google_translate_element"
      style={{
        display: "none",
      }}
    />
  );
};

export default GoogleTranslate;