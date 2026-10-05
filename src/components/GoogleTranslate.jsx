import React, { useEffect, useRef } from "react";

const GoogleTranslate = ({ targetLanguage, onReady }) => {
  const readyRef = useRef(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!targetLanguage || targetLanguage === "en") {
      onReady?.();
      return;
    }

    let interval = null;
    let observer = null;
    let timeout = null;

    const finish = () => {
      if (readyRef.current) return;

      readyRef.current = true;

      if (interval) {
        clearInterval(interval);
        interval = null;
      }

      if (observer) {
        observer.disconnect();
        observer = null;
      }

      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      // Cho Google Translate hoàn tất DOM mutation + browser paint
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          onReady?.();
        });
      });
    };

    const isTranslated = () => {
      const html = document.documentElement;

      const translated =
        html.classList.contains("translated-ltr") ||
        html.classList.contains("translated-rtl");

      const select = document.querySelector(".goog-te-combo");

      const selectedLanguage = select?.value || "";

      return (
        translated ||
        selectedLanguage === targetLanguage
      );
    };

    const selectLanguage = () => {
      const select = document.querySelector(".goog-te-combo");

      if (!select) return false;

      if (select.value !== targetLanguage) {
        select.value = targetLanguage;

        select.dispatchEvent(
          new Event("change", {
            bubbles: true,
          })
        );
      }

      return true;
    };

    const startWatching = () => {
      if (readyRef.current) return;

      // Thử chọn language ngay khi select xuất hiện
      selectLanguage();

      // Kiểm tra trạng thái translation
      interval = setInterval(() => {
        if (isTranslated()) {
          finish();
        } else {
          selectLanguage();
        }
      }, 100);

      // Theo dõi Google Translate thay đổi DOM
      observer = new MutationObserver(() => {
        if (isTranslated()) {
          finish();
        }
      });

      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
      });

      // Check ngay
      if (isTranslated()) {
        finish();
      }
    };

    const initGoogleTranslate = () => {
      if (initializedRef.current) {
        startWatching();
        return;
      }

      if (
        !window.google ||
        !window.google.translate
      ) {
        return;
      }

      initializedRef.current = true;

      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            autoDisplay: false,
          },
          "google_translate_element"
        );
      } catch (error) {
        console.error(
          "Google Translate initialization error:",
          error
        );
      }

      // Cho Google tạo .goog-te-combo
      setTimeout(() => {
        startWatching();
      }, 100);
    };

    // Google callback global
    window.googleTranslateElementInit =
      initGoogleTranslate;

    // Google Translate đã load
    if (
      window.google &&
      window.google.translate
    ) {
      initGoogleTranslate();
    } else {
      // Script đã tồn tại nhưng chưa load
      const existingScript = document.querySelector(
        'script[src*="translate.google.com/translate_a/element.js"]'
      );

      if (!existingScript) {
        const script = document.createElement("script");

        script.src =
          "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

        script.async = true;

        document.head.appendChild(script);
      }
    }

    /*
     * QUAN TRỌNG:
     * Không được để loading vô hạn.
     */
    timeout = setTimeout(() => {
      if (!readyRef.current) {
        console.warn(
          "Google Translate timeout - continue application."
        );

        finish();
      }
    }, 3000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }

      if (observer) {
        observer.disconnect();
      }

      if (timeout) {
        clearTimeout(timeout);
      }

      /*
       * KHÔNG remove Google Translate script.
       *
       * Nếu remove script ở đây rồi render lại:
       *
       * initializedRef.current === true
       *
       * => Google Translate không init lại.
       */
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