import React, { useRef, useState, useEffect } from "react";

const OverlayScrollbar = ({
  children,
  maxHeight = 400,
  scrollbarPosition = "right", // ← "right" یا "left"
}) => {
  const scrollRef = useRef(null);
  const trackRef = useRef(null);
  const thumbRef = useRef(null);
  const isLeft = scrollbarPosition === "left";
  const [showScrollbar, setShowScrollbar] = useState(false);
  const [thumbHeight, setThumbHeight] = useState(20);
  const [thumbTop, setThumbTop] = useState(0);
  const dragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartScrollTop = useRef(0);
  const hideTimeout = useRef(null);

  // محاسبه ارتفاع و موقعیت thumb
  const updateThumb = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const thumbHeight = Math.max(
      (clientHeight / scrollHeight) * clientHeight,
      20
    );
    const thumbTop = (scrollTop / scrollHeight) * clientHeight;

    setThumbHeight(thumbHeight);
    setThumbTop(thumbTop);
  };

  // نمایش scrollbar و تنظیم تایمر برای مخفی کردن
  const showAndHideScrollbar = () => {
    setShowScrollbar(true);
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => setShowScrollbar(false), 1500);
  };

  // هنگام اسکرول، موقعیت thumb رو بروز کن و scrollbar رو نمایش بده
  const handleScroll = () => {
    updateThumb();
    showAndHideScrollbar();
  };

  // درگ شروع شد
  const onThumbMouseDown = (e) => {
    e.preventDefault();
    dragging.current = true;
    dragStartY.current = e.clientY;
    dragStartScrollTop.current = scrollRef.current.scrollTop;
    showAndHideScrollbar();
  };

  // درگ حرکت کرد
  const onDocumentMouseMove = (e) => {
    if (!dragging.current) return;
    e.preventDefault();

    const el = scrollRef.current;
    const track = trackRef.current;
    if (!el || !track) return;

    const deltaY = e.clientY - dragStartY.current;
    const scrollableHeight = el.scrollHeight - el.clientHeight;
    const trackHeight = track.clientHeight - thumbHeight;

    // مقدار جدید اسکرول محاسبه می‌شود
    const newScrollTop =
      dragStartScrollTop.current + (deltaY * scrollableHeight) / trackHeight;

    el.scrollTop = Math.min(Math.max(newScrollTop, 0), scrollableHeight);
    updateThumb();
    showAndHideScrollbar();
  };

  // درگ تموم شد
  const onDocumentMouseUp = () => {
    dragging.current = false;
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateThumb();

    el.addEventListener("scroll", handleScroll);
    document.addEventListener("mousemove", onDocumentMouseMove);
    document.addEventListener("mouseup", onDocumentMouseUp);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousemove", onDocumentMouseMove);
      document.removeEventListener("mouseup", onDocumentMouseUp);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, [thumbHeight]);

  return (
    <div style={{ position: "relative", maxHeight, overflow: "hidden" }}>
      {/* اسکرول اصلی و محتوا */}
      <div
        ref={scrollRef}
        className="hide-scrollbar-webkit"
        style={{
          maxHeight,
          overflowY: "scroll",
          overflowX: "auto",
          [isLeft ? "paddingLeft" : "paddingRight"]: showScrollbar ? 12 : 0,
        }}
      >
        {children}
      </div>

      {/* ردیف اسکرول‌بار */}
      <div
        ref={trackRef}
        style={{
          position: "absolute",
          top: 0,
          [isLeft ? "left" : "right"]: 2,
          width: 8,
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.1)",
          borderRadius: 4,
          opacity: showScrollbar ? 1 : 0,
          transition: "opacity 0.3s",
          cursor: "pointer",
        }}
      >
        {/* Thumb قابل درگ */}
        <div
          ref={thumbRef}
          onMouseDown={onThumbMouseDown}
          style={{
            position: "absolute",
            top: thumbTop,
            [isLeft ? "left" : "right"]: 0,
            width: "100%",
            height: thumbHeight,
            backgroundColor: "rgba(0,0,0,0.4)",
            borderRadius: 4,
            cursor: "grab",
          }}
        />
      </div>
    </div>
  );
};

export default OverlayScrollbar;
