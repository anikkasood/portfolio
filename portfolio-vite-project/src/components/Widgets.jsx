import { Mail, Linkedin, Github, Instagram, Share2, Youtube, MessageSquare, Phone, Video, Pin as Pinterest } from 'lucide-react';

/* ---------- Profile Card (Centered macOS Style) ---------- */
export function ProfileCard({ name, bio, image }) {
  const actionButtons = [
    { icon: <Mail size={18} />, label: 'Email', link: "mailto:asood008@ucr.edu" },
    { icon: <Linkedin size={18} />, label: 'LinkedIn', link: "#" },
    { icon: <Github size={18} />, label: 'GitHub', link: "#" },
    { icon: <Pinterest size={18} />, label: 'Pinterest', link: "#" },
    { icon: <Instagram size={18} />, label: 'Instagram', link: "#" },
  ];

  return (
    <div className="flex flex-col w-full max-w-[400px] mx-auto select-none bg-transparent items-center text-center">
      
      {/* Top Section: Photo + Name Stacked & Centered */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="w-24 h-24 rounded-full bg-slate-200/30 border border-white/20 overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
          {image ? (
            <img 
              src={image} 
              alt={name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              Photo
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">
            {name}
          </h2>
          <p className="text-[15px] text-slate-500 font-medium">
            Software Engineer + Photographer
          </p>
        </div>
      </div>

      {/* Action Buttons Row - Circular Minimal Style */}
      <div className="w-full flex justify-between items-center gap-2 mb-6 border-b border-slate-200/30 pb-2">
        {actionButtons.map((btn, i) => (
          <a 
            key={i} 
            href={btn.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 flex-1 group active:scale-90 transition-transform"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-slate-500 bg-slate-100/60 transition-all duration-200 group-hover:bg-slate-200/80 group-hover:text-slate-900 shadow-sm">
              {btn.icon}
            </div>
            
            <span className="text-[10px] font-medium text-slate-400 group-hover:text-slate-600 transition-colors">
              {btn.label}
            </span>
          </a>
        ))}
      </div>

      {/* About Section - Left aligned text for readability but centered container */}
      <div className="w-full text-left px-2">
        <span className="text-sm font-bold text-slate-900 block mb-1">
          About
        </span>
        <p className="text-[12px] text-slate-600 leading-relaxed font-medium">
          {bio}
        </p>
      </div>
    </div>
  );
}

export function MacButton({ children, onClick, href, download, className = "" }) {
  const baseStyles = `
    px-4 py-1.5 
    /* macOS System Blue Gradient */
    bg-gradient-to-b from-[#58A6FF] to-[#007AFF]
    
    /* Fine Border and Shadow */
    border border-black/10 shadow-[inset_0_1px_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.1)]
    
    /* Text Styling */
    text-white 
    text-[13px] 
    font-medium
    
    /* Shape and Transition */
    rounded-md 
    transition-all 
    duration-100 
    
    /* Hover and Active States */
    hover:brightness-110
    active:brightness-90
    active:shadow-inner
    
    inline-flex items-center justify-center
    select-none
    cursor-default
  `;

  const combinedClasses = `${baseStyles} ${className}`;

  if (href) {
    return (
      <a 
        href={href} 
        download={download} 
        className={combinedClasses} 
        target="_blank" 
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={combinedClasses}>
      {children}
    </button>
  );
}