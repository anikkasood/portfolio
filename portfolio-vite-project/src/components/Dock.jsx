import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import finderLogo from '../assets/dock-icons/finder_icon.PNG';
import calendarLogo from '../assets/dock-icons/calendar_icon.PNG';
import contactLogo from '../assets/dock-icons/contact_icon.PNG';  

const icons = [
  { id: 1, logo: finderLogo, label: "Photography Portfolio" },
  { id: 3, logo: calendarLogo, label: "Book a Photoshoot" },
  { id: 4, logo: contactLogo, label: "About + Contact" },
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

      {showDot && (
        <div className="absolute -bottom-3 w-1.5 h-1.5 bg-black/50 rounded-full" />
      )}
    </div>
  );
}

export default function Dock({ 
  isContactOpen, 
  onOpenContact, 
  isFinderOpen,    
  onOpenFinder,     
  isReservOpen,    // Received from App
  onOpenReserv     // Received from App
}) {
  const mouseX = useMotionValue(Infinity);
  const [isDockHovered, setIsDockHovered] = useState(false);

  const getAppStatus = (id) => {
    switch(id) {
      case 1: // Finder
        return { isOpen: isFinderOpen, handler: onOpenFinder };
      case 3: // Bookings
        return { isOpen: isReservOpen, handler: onOpenReserv };
      case 4: // Contacts
        return { isOpen: isContactOpen, handler: onOpenContact };
      default: 
        return { isOpen: false, handler: undefined };
    }
  };

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => {
        mouseX.set(Infinity);
        setIsDockHovered(false);
      }}
      onMouseEnter={() => setIsDockHovered(true)}
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-3 p-3 px-4 bg-white/20 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-2xl h-[70px] transition-z duration-200 ${
        isDockHovered ? "z-[9999]" : "z-20"
      }`}
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