import React from 'react';

export default function MenuBar() {
  return (
    <div className="
      fixed top-0 left-0 right-0 h-8 
      bg-white/10 backdrop-blur-md 
      border-b border-black/10 
      flex items-center px-4 
      z-[5000] select-none
    ">
      <div className="flex items-center gap-4">
      
        {/* Your Title Text */}
        <span className="text-white text-[13px] font-medium">
          Anika Sood
        </span>
		  {/* The Apple Icon or Brand Name */}
        <span className="text-white text-[10px] text-sm font-bold tracking-tight">
          (^_−)☆
        </span>
      </div>
    </div>
  );
}