import { useEffect } from "react";

const GLOBAL_LOCK_KEY = "__bodyScrollLockCount";
const MODAL_SCROLL_SELECTOR = "[data-modal-scroll]";

const getScrollY = () => {
  if (typeof window === "undefined") return 0;
  return (
    window.scrollY ||
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
};

/**
 * Locks body scroll and keeps background fixed.
 * Elements with data-modal-scroll can still be scrolled via wheel, touch, and Page Up/Down.
 */
const useBodyScrollLock = (isLocked) => {
  useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined") {
      return undefined;
    }

    if (!isLocked) {
      return undefined;
    }

    const body = document.body;
    const dataset = body.dataset || {};
    const currentScroll = getScrollY();

    if (typeof window[GLOBAL_LOCK_KEY] !== "number") {
      window[GLOBAL_LOCK_KEY] = 0;
    }
    window[GLOBAL_LOCK_KEY] += 1;

    if (window[GLOBAL_LOCK_KEY] === 1) {
      dataset.scrollLockOverflow = body.style.overflow || "";
      dataset.scrollLockPosition = body.style.position || "";
      dataset.scrollLockTop = body.style.top || "";
      dataset.scrollLockWidth = body.style.width || "";
      dataset.scrollLockScrollY = String(currentScroll);

      body.style.overflow = "hidden";
      body.style.position = "fixed";
      body.style.top = `-${currentScroll}px`;
      body.style.width = "100%";
    }

    const onWheel = (e) => {
      const scrollEl = e.target.closest(MODAL_SCROLL_SELECTOR);
      if (scrollEl) {
        scrollEl.scrollBy({ top: e.deltaY, left: 0, behavior: "smooth" });
        e.preventDefault();
      } else {
        e.preventDefault();
      }
    };

    const onTouchMove = (e) => {
      const scrollEl = e.target.closest(MODAL_SCROLL_SELECTOR);
      if (!scrollEl) {
        e.preventDefault();
      }
    };

    const onKeyDown = (e) => {
      const key = e.key;
      if (key !== "PageDown" && key !== "PageUp" && key !== "Home" && key !== "End") {
        return;
      }
      const scrollEl = document.activeElement?.closest(MODAL_SCROLL_SELECTOR);
      if (scrollEl) {
        const pageHeight = scrollEl.clientHeight;
        const maxScroll = scrollEl.scrollHeight - pageHeight;
        const smoothOpt = { behavior: "smooth" };
        if (key === "PageDown") {
          scrollEl.scrollTo({ top: Math.min(scrollEl.scrollTop + pageHeight, maxScroll), ...smoothOpt });
          e.preventDefault();
        } else if (key === "PageUp") {
          scrollEl.scrollTo({ top: Math.max(scrollEl.scrollTop - pageHeight, 0), ...smoothOpt });
          e.preventDefault();
        } else if (key === "Home") {
          scrollEl.scrollTo({ top: 0, ...smoothOpt });
          e.preventDefault();
        } else if (key === "End") {
          scrollEl.scrollTo({ top: maxScroll, ...smoothOpt });
          e.preventDefault();
        }
      } else {
        e.preventDefault();
      }
    };

    document.addEventListener("wheel", onWheel, { capture: true, passive: false });
    document.addEventListener("touchmove", onTouchMove, { capture: true, passive: false });
    document.addEventListener("keydown", onKeyDown, { capture: true });

    return () => {
      document.removeEventListener("wheel", onWheel, { capture: true });
      document.removeEventListener("touchmove", onTouchMove, { capture: true });
      document.removeEventListener("keydown", onKeyDown, { capture: true });

      window[GLOBAL_LOCK_KEY] = Math.max(
        0,
        (window[GLOBAL_LOCK_KEY] || 1) - 1
      );

      if (window[GLOBAL_LOCK_KEY] === 0) {
        body.style.overflow = dataset.scrollLockOverflow || "";
        body.style.position = dataset.scrollLockPosition || "";
        body.style.top = dataset.scrollLockTop || "";
        body.style.width = dataset.scrollLockWidth || "";

        const savedScroll = parseInt(dataset.scrollLockScrollY || "0", 10) || 0;
        delete dataset.scrollLockOverflow;
        delete dataset.scrollLockPosition;
        delete dataset.scrollLockTop;
        delete dataset.scrollLockWidth;
        delete dataset.scrollLockScrollY;

        window.scrollTo(0, savedScroll);
      }
    };
  }, [isLocked]);
};

export default useBodyScrollLock;
