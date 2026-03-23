import React, { useEffect } from "react";

const GoogleTranslate = () => {
  useEffect(() => {
    // 1. Tạo script Google Translate
    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    // 2. Hàm callback khi Google Translate load xong
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
        },
        "google_translate_element"
      );

      // 3. Chờ dropdown xuất hiện bằng MutationObserver
      waitForWidgetLoad();
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // 4. Hàm chờ widget load
  const waitForWidgetLoad = () => {
    const observer = new MutationObserver(() => {
      const select = document.querySelector(".goog-te-combo");
      if (select) {
        const location = JSON.parse(localStorage.getItem("location") || "{}");
        const userLang = location.lang;

        if (userLang && select.value !== userLang) {
          select.value = userLang;

          // iOS cần event có bubbles để trigger Google Translate
          select.dispatchEvent(new Event("change", { bubbles: true }));
        }

        observer.disconnect(); // Dừng quan sát khi đã set ngôn ngữ
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  };

  return <div id="google_translate_element"></div>;
};

export default GoogleTranslate;