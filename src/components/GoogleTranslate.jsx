import React, { useEffect, useRef } from "react";

const GoogleTranslate = ({ onReady }) => {
  const initialized = useRef(false);
  const finished = useRef(false);

  useEffect(() => {
    let interval;
    let timeout;

    const finish = () => {
      if (finished.current) {
        return;
      }

      finished.current = true;

      clearInterval(interval);
      clearTimeout(timeout);

      onReady?.();
    };

    let location = {};

    try {
      location = JSON.parse(
        localStorage.getItem("location") || "{}"
      );
    } catch {}

    const lang = location?.lang || "en";

    if (lang === "en") {
      finish();
      return;
    }

    // Set cookie ngay lập tức
    document.cookie = `googtrans=/en/${lang}; path=/`;

    const init = () => {
      if (initialized.current) {
        return;
      }

      if (
        !window.google?.translate?.TranslateElement
      ) {
        return;
      }

      initialized.current = true;

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
          includedLanguages:
            "vi,fr,de,es,it,pt,ru,uk,zh-CN,zh-TW,ja,ko,th,id",
        },
        "google_translate_element"
      );

      let attempts = 0;

      interval = setInterval(() => {
        attempts++;

        const select =
          document.querySelector(".goog-te-combo");

        if (select) {
          if (select.value !== lang) {
            select.value = lang;

            select.dispatchEvent(
              new Event("change", {
                bubbles: true,
              })
            );
          }

          // Không chờ 800ms
          finish();
          return;
        }

        if (attempts >= 20) {
          finish();
        }
      }, 50);
    };

    window.googleTranslateElementInit = init;

    // Script đã load
    if (window.google?.translate?.TranslateElement) {
      init();
    } else {
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

    // Fallback
    timeout = setTimeout(() => {
      finish();
    }, 2000);

    return () => {
      clearInterval(interval);
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