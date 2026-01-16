import React from 'react';

export default function DesktopFile({ name, icon, onOpen }) {
  return (
    <div 
      onClick={onOpen} // Changed from onDoubleClick to onClick
      className="flex flex-col items-center w-24 p-2 cursor-pointer group select-none"
    >
      <div className="w-16 h-16 mb-1 transition-transform group-active:scale-95">
        <div className="flex items-center justify-center w-full h-full text-5xl">
          {icon || "📁"}
        </div>
      </div>
      <span className="text-white text-[13px] px-1.5 py-0.5 rounded-sm text-center font-medium drop-shadow-md group-hover:bg-blue-600/80 transition-colors">
        {name}
      </span>
    </div>
  );
}