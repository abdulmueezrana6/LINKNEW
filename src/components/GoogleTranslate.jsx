import React, { useEffect, useRef } from "react";

const GoogleTranslate = () => {
  const translatedRef = useRef(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const getUserLanguage = () => {
      try {
        const location = JSON.parse(
          localStorage.getItem("location") || "{}"
        );

        return location?.lang || "";
      } catch (error) {
        console.error("Invalid location data:", error);
        return "";
      }
    };

    const applyTranslation = () => {
      const select = document.querySelector(".goog-te-combo");

      if (!select) {
        return false;
      }

      const userLang = getUserLanguage();

      if (!userLang) {
        return true;
      }

      // Đã đúng ngôn ngữ rồi
      if (select.value === userLang) {
        translatedRef.current = true;
        return true;
      }

      // Chọn ngôn ngữ
      select.value = userLang;

      const event = new Event("change", {
        bubbles: true,
      });

      select.dispatchEvent(event);

      translatedRef.current = true;

      return true;
    };

    const waitForGoogleTranslate = () => {
      // Nếu đã chạy rồi thì không cần chạy lại
      if (translatedRef.current) {
        return;
      }

      if (applyTranslation()) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        return;
      }

      // Google Translate chưa load xong
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          if (applyTranslation()) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }, 300);
      }
    };

    // Google Translate đã tồn tại
    if (
      window.google &&
      window.google.translate &&
      window.google.translate.TranslateElement
    ) {
      waitForGoogleTranslate();
      return;
    }

    // Callback global
    window.googleTranslateElementInit = () => {
      if (
        !window.google ||
        !window.google.translate ||
        !window.google.translate.TranslateElement
      ) {
        return;
      }

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
        },
        "google_translate_element"
      );

      waitForGoogleTranslate();
    };

    // Tránh load script nhiều lần
    const existingScript = document.querySelector(
      'script[src*="translate.google.com/translate_a/element.js"]'
    );

    if (!existingScript) {
      const script = document.createElement("script");

      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

      script.async = true;

      document.body.appendChild(script);
    } else {
      waitForGoogleTranslate();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return <div id="google_translate_element" />;
};

export default GoogleTranslate;
