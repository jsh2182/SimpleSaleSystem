import React, { useEffect, useRef, createContext, useContext } from "react";
import {motion,  AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaInfoCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaQuestionCircle,
} from "react-icons/fa";
import clsx from "clsx";
import Button from "./Button";
import useIsMobile from "../hooks/useIsMobile";

const ModalContext = createContext({
  onClose: () => {},
  type: "info",
  resolvedColor: "#3b82f6",
});

export default function Modal({
  show,
  setShow,
  onClose,
  children,
  type = "info", // info | warning | error | confirm
  color = null, // e.g. "green-500"
  autoClose = null, // ms
  draggable = false,
  rootClose =true,
  size
}) {
  const modalRef = useRef();
  const isMobile = useIsMobile();
  const defaultColors = {
    info: "#3b82f6", // blue-500
    warning: "#eab308", // yellow-500
    error: "#eb5534", // red-500
    confirm: "#6b7280", // gray-500
  };

  const colorMap = {
    "blue-500": "#3b82f6",
    "green-500": "#22c55e",
    "green-600": "#16a34a",
    "red-500": "#ef4444",
    "yellow-500": "#eab308",
    "gray-500": "#6b7280",
    "gray-600": "#4b5563",
  };

  const resolvedColor =
    colorMap[color] || color || defaultColors[type] || "#3b82f6";
  const sizeClasses = {
    xs: "max-w-xs",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    fullscreen: "w-full h-full max-w-none rounded-none", // تمام صفحه
  };
  const close = () => {
    setShow?.();
    onClose?.();
  };

  // Escape key close
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") close();
    };
    if (show) {
      window.addEventListener("keydown", handleKey);
    }
    return () => window.removeEventListener("keydown", handleKey);
  }, [show]);

  // Auto-close
  useEffect(() => {
    if (show && autoClose) {
      const timeout = setTimeout(() => close(), autoClose);
      return () => clearTimeout(timeout);
    }
  }, [show, autoClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rtl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={rootClose? close:undefined}
        >
          <motion.div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={clsx(
              "bg-cyan-50 rounded-xl shadow-xl w-full text-right  border-2 relative  max-h-full overflow-auto scroll-thin",//overflow-hidden
              sizeClasses[size] || sizeClasses.md, isMobile ?"overflow-auto":""
            )}
            style={{ borderColor: resolvedColor }}
            drag={draggable}
            dragConstraints={{ top: -300, bottom: 300, left: -300, right: 300 }}
            dragElastic={0.2}
            dragMomentum={false}
          >
            <ModalContext.Provider
              value={{ onClose: close, type, resolvedColor }}
            >
              {children}

              {autoClose && (
                <div className="absolute bottom-0 left-0 w-full h-1  rounded-b-xl">{/*overflow-hidden*/}
                  <div
                    className="h-full"
                    style={{
                      backgroundColor: resolvedColor,
                      animation: `shrinkBar ${autoClose}ms linear forwards`,
                    }}
                  />
                </div>
              )}
            </ModalContext.Provider>
          </motion.div>

          {/* Add keyframe animation in JSX */}
          <style>
            {`
              @keyframes shrinkBar {
                from { width: 0%; }
                to { width: 100%; }
              }
            `}
          </style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Header
Modal.Header = function ModalHeader({ children }) {
  const { onClose, type, resolvedColor } = useContext(ModalContext);

  const iconMap = {
    info: <FaInfoCircle className="text-xl" style={{ color: resolvedColor }} />,
    warning: (
      <FaExclamationTriangle
        className="text-xl"
        style={{ color: resolvedColor }}
      />
    ),
    error: (
      <FaTimesCircle className="text-xl" style={{ color: resolvedColor }} />
    ),
    confirm: (
      <FaQuestionCircle className="text-xl" style={{ color: resolvedColor }} />
    ),
  };

  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
      <div className="flex items-center gap-2 rtl:space-x-reverse">
        {iconMap[type]}
        <h2 className="text-lg font-semibold text-gray-800">{children}</h2>
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-700 text-xl"
        aria-label="بستن"
      >
        <FaTimes />
      </button>
    </div>
  );
};

// Body
Modal.Body = function ModalBody({ children, className }) {
  return (
    <div className={clsx("px-5 py-4 text-sm text-gray-700 leading-relaxed", className)}>
      {children}
    </div>
  );
};

// Footer
Modal.Footer = function ModalFooter({ children, onConfirm = null, className }) {
  const { onClose, type, resolvedColor } = useContext(ModalContext);

  if (type === "confirm" && typeof onConfirm === "function") {
    return (
      <div className= {clsx("px-5 py-3 border-t border-gray-200 bg-gray-50 flex justify-start gap-2 border-b rounded-b-xl", className)}>
        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="px-4 py-2 rounded text-white hover:brightness-75"
          style={{ backgroundColor: resolvedColor }}
        >
          تایید
        </Button>
        <Button
          onClick={onClose}
          className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          انصراف
        </Button>
      </div>
    );
  }

  // حالت عادی
  return (
    <div className={clsx("px-5 py-3 border-t border-gray-200 bg-gray-50 flex justify-end gap-2  border-b rounded-b-xl", className)}>
      {children}
    </div>
  );
};
