import React, { useEffect, useRef } from "react";

const GoogleTranslate = ({ targetLanguage, onReady }) => {
  const initialized = useRef(false);
  const readyCalled = useRef(false);

  useEffect(() => {
    if (!targetLanguage || targetLanguage === "en") {
      onReady?.();
      return;
    }

    let observer = null;
    let script = null;
    let checkTimer = null;
    let stableTimer = null;

    const finish = () => {
      if (readyCalled.current) {
        return;
      }

      readyCalled.current = true;

      if (observer) {
        observer.disconnect();
      }

      if (checkTimer) {
        clearInterval(checkTimer);
      }

      if (stableTimer) {
        clearTimeout(stableTimer);
      }

      // Chờ browser render DOM cuối cùng
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          onReady?.();
        });
      });
    };

    const waitForTranslation = () => {
      if (readyCalled.current) {
        return;
      }

      const combo = document.querySelector(
        ".goog-te-combo"
      );

      if (!combo) {
        return;
      }

      /*
       * Google Translate đã tạo select.
       * Chọn language.
       */
      if (combo.value !== targetLanguage) {
        combo.value = targetLanguage;

        combo.dispatchEvent(
          new Event("change", {
            bubbles: true,
          })
        );

        return;
      }

      /*
       * Đã chọn đúng language.
       *
       * Đợi DOM ổn định trước khi bỏ spinner.
       */
      clearTimeout(stableTimer);

      stableTimer = setTimeout(() => {
        finish();
      }, 300);
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
          layout:
            window.google.translate.TranslateElement
              .InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );

      /*
       * Theo dõi DOM của Google Translate.
       */
      observer = new MutationObserver(() => {
        waitForTranslation();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
      });

      /*
       * Check liên tục trong thời gian ngắn.
       */
      checkTimer = setInterval(() => {
        waitForTranslation();
      }, 100);
    };

    window.googleTranslateElementInit =
      initGoogleTranslate;

    /*
     * Google Translate đã load.
     */
    if (
      window.google &&
      window.google.translate
    ) {
      initGoogleTranslate();
    } else {
      /*
       * Load Google Translate.
       */
      script = document.createElement("script");

      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

      script.async = true;

      document.head.appendChild(script);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }

      if (checkTimer) {
        clearInterval(checkTimer);
      }

      if (stableTimer) {
        clearTimeout(stableTimer);
      }

      /*
       * Không remove Google Translate script ở đây.
       *
       * React StrictMode có thể mount/unmount component
       * nhiều lần trong development.
       */
    };
  }, [targetLanguage, onReady]);

  return (
    <div
      id="google_translate_element"
      style={{
        position: "absolute",
        width: 0,
        height: 0,
        overflow: "hidden",
        opacity: 0,
        pointerEvents: "none",
      }}
    />
  );
};

export default GoogleTranslate;
