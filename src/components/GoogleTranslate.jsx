import React, { useEffect, useRef } from "react";

const GoogleTranslate = ({
  targetLanguage,
  onReady,
}) => {
  const initialized = useRef(false);
  const readyCalled = useRef(false);

  useEffect(() => {
    if (!targetLanguage || targetLanguage === "en") {
      onReady?.();
      return;
    }

    let script = null;
    let observer = null;
    let checkInterval = null;
    let stableTimer = null;

    let mutationCount = 0;

    const finish = () => {
      if (readyCalled.current) {
        return;
      }

      readyCalled.current = true;

      if (observer) {
        observer.disconnect();
      }

      if (checkInterval) {
        clearInterval(checkInterval);
      }

      if (stableTimer) {
        clearTimeout(stableTimer);
      }

      /*
       * Cho Google Translate hoàn thành batch DOM cuối cùng
       */
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            onReady?.();
          });
        });
      });
    };

    const checkGoogleTranslate = () => {
      if (readyCalled.current) {
        return;
      }

      const html = document.documentElement;

      const translated =
        html.classList.contains("translated-ltr") ||
        html.classList.contains("translated-rtl");

      const combo = document.querySelector(
        ".goog-te-combo"
      );

      const iframe = document.querySelector(
        ".goog-te-banner-frame"
      );

      /*
       * Google Translate đã khởi tạo
       */
      if (translated || combo || iframe) {
        /*
         * Nếu đã có mutation:
         * đợi DOM ổn định rồi mới bỏ spinner.
         */
        if (mutationCount > 0) {
          clearTimeout(stableTimer);

          stableTimer = setTimeout(() => {
            finish();
          }, 150);
        }
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

      /*
       * Theo dõi toàn bộ UI.
       */
      const appElement = document.getElementById("app");

      if (appElement) {
        observer = new MutationObserver((mutations) => {
          if (readyCalled.current) {
            return;
          }

          mutationCount += mutations.length;

          /*
           * Google Translate thường thực hiện
           * nhiều mutation liên tiếp.
           */
          clearTimeout(stableTimer);

          stableTimer = setTimeout(() => {
            checkGoogleTranslate();
          }, 100);
        });

        observer.observe(appElement, {
          subtree: true,
          childList: true,
          characterData: true,
        });
      }

      /*
       * Poll nhẹ để phát hiện Google Translate
       * đã khởi tạo.
       */
      checkInterval = setInterval(() => {
        checkGoogleTranslate();
      }, 50);
    };

    window.googleTranslateElementInit =
      initGoogleTranslate;

    /*
     * Google Translate đã được load trước đó.
     */
    if (
      window.google &&
      window.google.translate
    ) {
      initGoogleTranslate();
    } else {
      /*
       * Load script.
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

      if (checkInterval) {
        clearInterval(checkInterval);
      }

      if (stableTimer) {
        clearTimeout(stableTimer);
      }

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
