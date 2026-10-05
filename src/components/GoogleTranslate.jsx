
import React, { useEffect, useRef } from "react";

const GoogleTranslate = () => {
  const initialized = useRef(false);

  useEffect(() => {
    const getLanguage = () => {
      try {
        const location = JSON.parse(
          localStorage.getItem("location") || "{}"
        );

        return location?.lang || "";
      } catch {
        return "";
      }
    };

    const lang = getLanguage();

    console.log("Google Translate language:", lang);

    if (!lang || lang === "en") {
      return;
    }

    // ---------------------------------------
    // 1. Set Google Translate cookie
    // ---------------------------------------
    document.cookie = `googtrans=/en/${lang}; path=/`;

    // Một số trường hợp cần thêm cookie cho domain
    if (window.location.hostname !== "localhost") {
      document.cookie = `googtrans=/en/${lang}; path=/; domain=${window.location.hostname}`;
    }

    // ---------------------------------------
    // 2. Init Google Translate
    // ---------------------------------------
    const initGoogleTranslate = () => {
      if (
        !window.google ||
        !window.google.translate ||
        !window.google.translate.TranslateElement
      ) {
        return;
      }

      if (initialized.current) {
        return;
      }

      initialized.current = true;

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages:
            "en,vi,fr,de,es,it,pt,ru,uk,zh-CN,zh-TW,ja,ko,th,id",
          autoDisplay: false,
        },
        "google_translate_element"
      );

      // Google cần một chút thời gian tạo select
      waitForSelect(lang);
    };

    // ---------------------------------------
    // 3. Wait Google Translate select
    // ---------------------------------------
    const waitForSelect = (language) => {
      let count = 0;

      const timer = setInterval(() => {
        count++;

        const select = document.querySelector(".goog-te-combo");

        if (select) {
          console.log(
            "Google Translate select found:",
            select.value,
            "target:",
            language
          );

          // Nếu Google chưa tự dịch theo cookie
          if (select.value !== language) {
            select.value = language;

            select.dispatchEvent(
              new Event("change", {
                bubbles: true,
                cancelable: true,
              })
            );

            console.log("Translation triggered:", language);
          }

          clearInterval(timer);
        }

        // Không chờ vô hạn
        if (count >= 50) {
          clearInterval(timer);
          console.warn("Google Translate widget timeout");
        }
      }, 300);
    };

    // ---------------------------------------
    // 4. Google script callback
    // ---------------------------------------
    window.googleTranslateElementInit = initGoogleTranslate;

    // Google Translate đã load
    if (
      window.google &&
      window.google.translate &&
      window.google.translate.TranslateElement
    ) {
      initGoogleTranslate();
      return;
    }

    // ---------------------------------------
    // 5. Load script
    // ---------------------------------------
    const oldScript = document.querySelector(
      'script[src*="translate.google.com/translate_a/element.js"]'
    );

    if (!oldScript) {
      const script = document.createElement("script");

      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

      script.async = true;

      document.body.appendChild(script);
    }

    return () => {
      // Không xoá Google Translate script
    };
  }, []);

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
