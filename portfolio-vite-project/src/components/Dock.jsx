import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import finderLogo from '../assets/dock-icons/finder_icon.PNG';
import terminalLogo from '../assets/dock-icons/terminal_icon.PNG';
import calendarLogo from '../assets/dock-icons/calendar_icon.PNG';
import contactLogo from '../assets/dock-icons/contact_icon.PNG';  

const icons = [
  { id: 1, logo: finderLogo, label: "Finder" },
  { id: 2, logo: terminalLogo, label: "Terminal" },
  { id: 3, logo: calendarLogo, label: "Calendar" },
  { id: 4, logo: contactLogo, label: "Contacts" },
];

function DockIcon({ logo, label, mouseX, onClick, showDot }) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <div 
      className="relative flex flex-col items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip Label */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 10, x: "-50%" }}
            transition={{ duration: 0.15 }}
            className="absolute -top-12 left-1/2 px-3 py-1 bg-white/80 backdrop-blur-md border border-white/40 rounded-md shadow-lg text-[12px] font-medium text-slate-800 whitespace-nowrap pointer-events-none z-[100]"
          >
            {label}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/80 border-r border-b border-white/40 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        ref={ref}
        onClick={onClick}
        style={{ width, height: width }} 
        className="flex items-center justify-center cursor-pointer overflow-hidden rounded-[22%]"
      >
        <img src={logo} className="w-full h-full object-cover shadow-sm border border-black/5" alt={label} />
      </motion.div>

      {/* The Active Indicator Dot */}
      {showDot && (
        <div className="absolute -bottom-3 w-1.5 h-1.5 bg-black/50 rounded-full" />
      )}
    </div>
  );
}

export default function Dock({ isContactOpen, onOpenContact, isResumeOpen, onOpenResume }) {
  const mouseX = useMotionValue(Infinity);

  const getAppStatus = (id) => {
    switch(id) {
      case 4: // Contacts
        return { isOpen: isContactOpen, handler: onOpenContact };
      case 1: // Finder (Decoupled from Resume)
        return { isOpen: false, handler: () => console.log("Finder clicked") };
      case 2: // Terminal
        return { isOpen: false, handler: () => console.log("Terminal clicked") };
      default: 
        return { isOpen: false, handler: undefined };
    }
  };

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-3 p-3 px-4 bg-white/20 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-2xl h-[70px] z-20"
    >
      {icons.map((app) => {
        const { isOpen, handler } = getAppStatus(app.id);
        
        return (
          <DockIcon 
            key={app.id} 
            logo={app.logo} 
            label={app.label}
            mouseX={mouseX} 
            onClick={handler}
            showDot={isOpen}
          />
        );
      })}
    </motion.div>
  );
}