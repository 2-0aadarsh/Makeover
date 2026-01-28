import { useEffect } from "react";

const GLOBAL_LOCK_KEY = "__bodyScrollLockCount";

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

    return () => {
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

