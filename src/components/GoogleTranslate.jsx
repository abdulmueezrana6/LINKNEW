import React, { useEffect, useRef } from "react";

const SCRIPT_ID = "google-translate-script";
const ELEMENT_ID = "google_translate_element";

const GoogleTranslate = ({
  targetLanguage,
  onReady,
}) => {
  const readyRef = useRef(false);

  useEffect(() => {
    if (!targetLanguage || targetLanguage === "en") {
      onReady?.();
      return;
    }

    let cancelled = false;
    let checkTimer = null;
    let fallbackTimer = null;
    let observer = null;

    const finish = () => {
      if (cancelled || readyRef.current) {
        return;
      }

      readyRef.current = true;

      if (checkTimer) {
        clearInterval(checkTimer);
      }

      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
      }

      if (observer) {
        observer.disconnect();
      }

      /*
       * Cho browser paint DOM cuối cùng.
       */
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!cancelled) {
            onReady?.();
          }
        });
      });
    };

    /*
     * Đặt cookie để Google Translate tự chọn
     * ngôn ngữ ngay khi khởi tạo.
     */
    const setTranslateCookie = () => {
      const value = `/en/${targetLanguage}`;

      document.cookie =
        `googtrans=${value}; path=/`;

      /*
       * Một số trường hợp cần domain hiện tại.
       */
      const hostname = window.location.hostname;

      if (
        hostname &&
        hostname !== "localhost" &&
        hostname !== "127.0.0.1"
      ) {
        document.cookie =
          `googtrans=${value}; path=/; domain=${hostname}`;
      }
    };

    /*
     * Kiểm tra Google Translate đã sẵn sàng.
     */
    const checkReady = () => {
      if (cancelled || readyRef.current) {
        return;
      }

      const combo = document.querySelector(
        ".goog-te-combo"
      );

      if (!combo) {
        return;
      }

      /*
       * Nếu Google Translate chưa chọn language,
       * chọn thủ công.
       */
      if (combo.value !== targetLanguage) {
        combo.value = targetLanguage;

        combo.dispatchEvent(
          new Event("change", {
            bubbles: true,
          })
        );

        return;
      }

      /*
       * Google Translate đã chọn đúng language.
       *
       * Chờ thêm một khoảng ngắn để nó hoàn thành
       * việc thay đổi text.
       */
      setTimeout(() => {
        if (cancelled || readyRef.current) {
          return;
        }

        finish();
      }, 250);
    };

    /*
     * Callback global của Google Translate.
     */
    window.googleTranslateElementInit = () => {
      if (cancelled) {
        return;
      }

      if (
        !window.google ||
        !window.google.translate
      ) {
        return;
      }

      /*
       * Tránh init nhiều lần.
       */
      if (
        window.__googleTranslateInitialized
      ) {
        checkTimer = setInterval(
          checkReady,
          100
        );

        return;
      }

      window.__googleTranslateInitialized = true;

      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            autoDisplay: false,
            multilanguagePage: true,
          },
          ELEMENT_ID
        );
      } catch (error) {
        console.error(
          "Google Translate init error:",
          error
        );
      }

      /*
       * Chờ combo xuất hiện.
       */
      checkTimer = setInterval(
        checkReady,
        100
      );

      checkReady();

      /*
       * Theo dõi thay đổi DOM của Google Translate
       * nhưng KHÔNG phụ thuộc hoàn toàn vào observer.
       */
      observer = new MutationObserver(() => {
        checkReady();
      });

      observer.observe(document.documentElement, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true,
      });
    };

    /*
     * Cookie phải được set TRƯỚC khi load script.
     */
    setTranslateCookie();

    /*
     * Element phải tồn tại trước khi init.
     */
    let translateElement =
      document.getElementById(ELEMENT_ID);

    if (!translateElement) {
      translateElement =
        document.createElement("div");

      translateElement.id = ELEMENT_ID;

      translateElement.style.position =
        "absolute";

      translateElement.style.width = "1px";
      translateElement.style.height = "1px";
      translateElement.style.overflow = "hidden";
      translateElement.style.opacity = "0";
      translateElement.style.pointerEvents =
        "none";

      document.body.appendChild(
        translateElement
      );
    }

    /*
     * Google Translate đã tồn tại.
     */
    if (
      window.google &&
      window.google.translate
    ) {
      window.googleTranslateElementInit();
    } else {
      /*
       * Google Translate script đã tồn tại
       * nhưng đang loading.
       */
      let existingScript =
        document.getElementById(
          SCRIPT_ID
        );

      if (!existingScript) {
        existingScript =
          document.createElement("script");

        existingScript.id = SCRIPT_ID;

        existingScript.src =
          "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

        existingScript.async = true;

        document.head.appendChild(
          existingScript
        );
      }
    }

    /*
     * Fallback bắt buộc.
     *
     * Google Translate có thể bị:
     * - ad blocker
     * - network lỗi
     * - CSP
     * - Google timeout
     *
     * Không được để spinner quay vô hạn.
     */
    fallbackTimer = setTimeout(() => {
      if (!readyRef.current) {
        console.warn(
          "Google Translate timeout. Continue application."
        );

        finish();
      }
    }, 7000);

    return () => {
      cancelled = true;

      if (checkTimer) {
        clearInterval(checkTimer);
      }

      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
      }

      if (observer) {
        observer.disconnect();
      }
    };
  }, [targetLanguage, onReady]);

  return null;
};

export default GoogleTranslate;
