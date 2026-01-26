import { motion, useDragControls } from "framer-motion";
import { useEffect, useState } from "react";

export default function Window({
  title,
  children,
  onClose,
  initialPos,
  onFocus,
  zIndex = 100,
  size = "600px",
  height = "auto"
}) {
  const controls = useDragControls();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <motion.div
      drag={!isMobile} 
      dragControls={controls}
      dragMomentum={false}
      dragListener={false}
      onMouseDown={onFocus}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        position: "fixed",
        left: initialPos?.x ?? 100,
        top: initialPos?.y ?? 100,
        zIndex,
        width: size,
        height: height,
        maxWidth: "96vw",
        maxHeight: "85vh",
        resize: isMobile ? "none" : "both",
        overflow: "auto",
      }}
      className="
        min-w-[300px] min-h-[200px]
        bg-white/80 backdrop-blur-2xl
        rounded-xl shadow-2xl border border-white/40
        flex flex-col
        select-none
        scrollbar-hide
      "
    >
      {/* Title Bar */}
      <div
        onPointerDown={(e) => !isMobile && controls.start(e)}
        className="
          h-10 flex items-center px-4
          bg-gray-100/50 border-b border-gray-200/50
          cursor-grab active:cursor-grabbing
          relative shrink-0
        "
      >
        <div className="flex gap-2 z-10">
          <div
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="
              w-3.5 h-3.5 rounded-full
              bg-[#FF605C] border border-[#E0443E]
              cursor-pointer active:brightness-90
              flex items-center justify-center group
            "
          >
            <span className="text-[10px] text-black/40 hidden group-hover:block">
              ✕
            </span>
          </div>
          <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD44] border border-[#DEA123]" />
          <div className="w-3.5 h-3.5 rounded-full bg-[#00CA4E] border border-[#14AE46]" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center text-[13px] font-semibold text-gray-700/80 pointer-events-none">
          {title}
        </div>
      </div>

      {/* Content Area */}
      <div className={`flex-1 min-h-0 text-slate-800 pointer-events-auto ${isMobile ? 'overflow-auto' : 'overflow-hidden'}`}>
        {children}
      </div>

      {/* Invisible Resize Handle */}
      {!isMobile && (
        <div className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50" />
      )}
    </motion.div>
  );
}