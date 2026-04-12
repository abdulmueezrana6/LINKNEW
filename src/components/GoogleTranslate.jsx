import React, { useEffect } from "react";

const GoogleTranslate = () => {
  useEffect(() => {
    // Tránh load lại nhiều lần
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

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const waitForWidgetLoad = () => {
    const interval = setInterval(() => {
      const select = document.querySelector(".goog-te-combo");

      if (select) {
        const location = JSON.parse(localStorage.getItem("location") || "{}");
        const userLang = location.lang;

        if (userLang && select.value !== userLang) {
          select.value = userLang;

          // ✅ Fix mạnh hơn cho iOS
          const event = document.createEvent("HTMLEvents");
          event.initEvent("change", true, true);
          select.dispatchEvent(event);
        }

        clearInterval(interval);
      }
    }, 500); // polling thay vì MutationObserver (ổn định hơn trên iOS)
  };

    return (
    <div
      id="google_translate_element"
      style={{
        opacity: loaded ? 1 : 0,
        transition: "opacity 0.3s ease",
        minHeight: 40, // tránh layout shift
      }}
    />
  );
};

export default GoogleTranslate;
