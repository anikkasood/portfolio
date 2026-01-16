import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
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

function DockIcon({ logo, mouseX, onClick, showDot }) {
  const ref = useRef(null);
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        ref={ref}
        onClick={onClick}
        style={{ width, height: width }} 
        className="flex items-center justify-center cursor-pointer overflow-hidden rounded-[22%]"
      >
        <img src={logo} className="w-full h-full object-cover shadow-sm border border-black/5" alt="icon" />
      </motion.div>
      {showDot && (
		<div className="absolute -bottom-3 w-1 h-1 bg-black/60 rounded-full" />
		)}
    </div>
  );
}

// 1. Added props for other window states and handlers
export default function Dock({ isContactOpen, onOpenContact, isResumeOpen, onOpenResume, isPhotoOpen, onOpenPhoto }) {
  const mouseX = useMotionValue(Infinity);

  // 2. Helper function to determine if a specific icon should show a dot
  const getAppStatus = (id) => {
    switch(id) {
      case 4: return { isOpen: isContactOpen, handler: onOpenContact };
      case 1: return { isOpen: isResumeOpen, handler: onOpenResume }; // Assuming Finder is Resume for now
      // Add more cases as you build more windows
      default: return { isOpen: false, handler: undefined };
    }
  };

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="fixed bottom-2 left-1/2 -translate-x-1/2 flex items-end gap-3 p-3 px-4 bg-white/25 backdrop-blur-xl border border-black/5 rounded-xl shadow-2xl h-16"
    >
      {icons.map((app) => {
        const { isOpen, handler } = getAppStatus(app.id);
        
        return (
          <DockIcon 
            key={app.id} 
            logo={app.logo} 
            mouseX={mouseX} 
            onClick={handler}
            showDot={isOpen}
          />
        );
      })}
    </motion.div>
  );
}