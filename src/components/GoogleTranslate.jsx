import React, { useEffect, useRef } from "react";

const GoogleTranslate = ({ onReady }) => {
  const initialized = useRef(false);
  const readyCalled = useRef(false);

  useEffect(() => {
    const location = JSON.parse(
      localStorage.getItem("location") || "{}"
    );

    const lang = location?.lang || "en";

    // English không cần translate
    if (lang === "en") {
      onReady?.();
      return;
    }

    document.cookie = `googtrans=/en/${lang}; path=/`;

    const markReady = () => {
      if (readyCalled.current) {
        return;
      }

      readyCalled.current = true;

      setTimeout(() => {
        onReady?.();
      }, 300);
    };

    const initGoogleTranslate = () => {
      if (
        initialized.current ||
        !window.google?.translate?.TranslateElement
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

      let count = 0;

      const timer = setInterval(() => {
        count++;

        const select = document.querySelector(".goog-te-combo");

        if (select) {
          if (select.value !== lang) {
            select.value = lang;

            select.dispatchEvent(
              new Event("change", {
                bubbles: true,
              })
            );

            // Chờ Google thực hiện DOM translation
            setTimeout(markReady, 500);
          } else {
            markReady();
          }

          clearInterval(timer);
        }

        // Timeout để không treo spinner mãi
        if (count >= 40) {
          clearInterval(timer);
          markReady();
        }
      }, 300);
    };

    window.googleTranslateElementInit = initGoogleTranslate;

    if (window.google?.translate?.TranslateElement) {
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
  }, [onReady]);

  return (
    <div
      id="google_translate_element"
      style={{ display: "none" }}
    />
  );
};

export default GoogleTranslate;
