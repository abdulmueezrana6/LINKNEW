import React, { useEffect, useState, useRef } from "react";

const GoogleTranslate = () => {
  const hasTranslated = useRef(false); // ✅ đặt ở đây

  useEffect(() => {
    if (window.googleTranslateElementInit) return;

    window.googleTranslateElementInit = () => {
      if (!window.google || !window.google.translate) return;

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
        },
        "google_translate_element"
      );

      waitForWidgetLoad();
    };

    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;

    document.body.appendChild(script);
  }, []);

  const waitForWidgetLoad = () => {
    const interval = setInterval(() => {
      const select = document.querySelector(".goog-te-combo");

      if (select && !hasTranslated.current) {
        hasTranslated.current = true; // ✅ đánh dấu đã translate

        const location = JSON.parse(localStorage.getItem("location") || "{}");
        const userLang = location.lang;

        if (userLang && select.value !== userLang) {
          select.value = userLang;

          const event = document.createEvent("HTMLEvents");
          event.initEvent("change", true, true);
          select.dispatchEvent(event);
        }

        clearInterval(interval);
      }
    }, 300);
  };

  return <div id="google_translate_element"></div>;
};

export default GoogleTranslate;
