import React, { useEffect } from "react";

const GoogleTranslate = () => {
  useEffect(() => {
    const applyLanguage = (select) => {
      let userLang;

      try {
        const location = JSON.parse(localStorage.getItem("location") || "{}");
        userLang = location?.lang;
        console.log(location);
      } catch {
        console.warn("Invalid location in localStorage");
      }

      if (userLang && select.value !== userLang) {
        select.value = userLang;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
    };

const waitForWidgetLoad = () => {
  const observer = new MutationObserver(() => {
    const select = document.querySelector(".goog-te-combo");

    if (select) {
      observer.disconnect();

      setTimeout(() => {
        let userLang;

        try {
          const location = JSON.parse(localStorage.getItem("location") || "{}");
          userLang = location?.lang;
        } catch {}

        if (userLang) {
          select.value = userLang;
          select.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }, 100);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

    if (!window.googleTranslateInitialized) {
      window.googleTranslateInitialized = true;

      window.googleTranslateElementInit = () => {
        if (!window.google?.translate) return;

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
    } else {
      waitForWidgetLoad();
    }
  }, []);

  return <div id="google_translate_element"></div>;
};

export default GoogleTranslate;
