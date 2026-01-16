import { motion, useDragControls } from "framer-motion";

export default function Window({ 
  title, 
  children, 
  onClose, 
  initialPos, 
  onFocus, 
  zIndex = 10,
  size = "w-[40vw] h-[50vh]" 
}) {
  const controls = useDragControls();

  return (
    <motion.div
      drag
      dragControls={controls}
      dragMomentum={false}
      dragListener={false}
      onMouseDown={onFocus}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ 
        left: initialPos?.x, 
        top: initialPos?.y,
        zIndex: zIndex 
      }}
      className={`
        fixed ${size}
        min-w-[320px] min-h-[300px] 
        bg-white/80 backdrop-blur-2xl 
        rounded-xl shadow-2xl border border-white/40 
        flex flex-col overflow-hidden
      `}
    >
      {/* 1. The Title Bar (Drag Handle) */}
      <div 
        onPointerDown={(e) => controls.start(e)} 
        className="h-10 flex-shrink-0 flex items-center px-4 bg-gray-100/50 border-b border-gray-200/50 relative cursor-grab active:cursor-grabbing"
      >
        <div className="flex gap-2 z-50">
          <div 
            onClick={(e) => {
              e.stopPropagation(); 
              onClose();
            }} 
            className="w-3 h-3 rounded-full bg-[#FF605C] border border-[#E0443E] cursor-pointer active:brightness-90" 
          />
          <div className="w-3 h-3 rounded-full bg-[#FFBD44] border border-[#DEA123]" />
          <div className="w-3 h-3 rounded-full bg-[#00CA4E] border border-[#14AE46]" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-600 pointer-events-none select-none">
          {title}
        </div>
      </div>

      {/* 2. Window Content Area */}
      <div className="flex-1 overflow-auto p-6 text-slate-800 flex flex-col min-h-0">
        {children}
      </div>
    </motion.div>
  );
}