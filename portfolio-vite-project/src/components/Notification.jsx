import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Notification({ title, message, duration = 14000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          className="fixed top-12 right-4 w-80 z-[10000] select-none"
        >
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl flex flex-col relative overflow-hidden group">
            
            {/* Main Content Area */}
            <div className="p-4 flex gap-3">
                <button 
                  onClick={() => setIsVisible(false)}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={14} />
                </button>

                <div className="flex-1">
                  <h4 className="text-[13px] font-bold text-slate-900 mb-0.5">
                      {title}
                  </h4>
                  <p className="text-[12px] text-slate-600 leading-snug font-medium">
                      {message}
                  </p>
                </div>
            </div>

            {/* Progress Bar Container */}
            <div className="h-1 w-full bg-black/5 flex justify-end">
                <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: duration / 1000, ease: "linear" }}
                    className="h-full bg-blue-500/60"
                />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}