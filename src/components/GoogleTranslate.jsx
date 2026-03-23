import React, { useEffect } from "react";

const GoogleTranslate = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en", 
          autoDisplay: false, 
        },
        "google_translate_element" 
      );
      setTimeout(waitForWidgetLoad, 1000); 
    };
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const waitForWidgetLoad = () => {
  const observer = new MutationObserver(() => {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      const location = JSON.parse(localStorage.getItem("location"));
      const userLang = location.lang;
      if (select.value !== userLang) {
        select.value = userLang;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
};

  return <div id="google_translate_element"></div>;
};

export default GoogleTranslate;