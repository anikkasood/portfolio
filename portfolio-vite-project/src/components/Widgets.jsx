import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Mail, Linkedin, Github, Instagram, Share2, Youtube, MessageSquare, Phone, Video, Pin as Pinterest, RotateCw } from 'lucide-react';

/* ---------- Profile Card (Centered macOS Style) ---------- */
export function ProfileCard({ name, bio_tech, bio_photo, image, fun_fact }) {
  const [cardIndex, setCardIndex] = useState(0);
  const cards = [
    { title: "Technical Background", content: bio_tech },
    { title: "Creative Business", content: bio_photo },
    { title: "Let's Connect", content: fun_fact }
  ];

  const handleFlip = () => {
    setCardIndex((prev) => (prev + 1) % cards.length);
  };

  const actionButtons = [
    { icon: <Mail size={18} />, label: 'Email', link: "mailto:asood008@ucr.edu" },
    { icon: <Linkedin size={18} />, label: 'LinkedIn', link: "https://www.linkedin.com/in/anikasood-/" },
    { icon: <Github size={18} />, label: 'GitHub', link: "https://github.com/anikkasood?tab=repositories" },
    { icon: <Pinterest size={18} />, label: 'Pinterest', link: "https://www.pinterest.com/anikkasood/grad-photography/" },
    { icon: <Instagram size={18} />, label: 'Instagram', link: "https://www.instagram.com/anikasoodphoto/?hl=en" },
  ];

  return (
    <div className="flex flex-col w-full max-w-[500px] mx-auto select-none bg-transparent items-center text-center">
      
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

      {/* Action Buttons Row */}
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
            
            <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-600 transition-colors">
              {btn.label}
            </span>
          </a>
        ))}
      </div>

      {/* Flippable Card Section */}
      <div 
        onClick={handleFlip}
        className="relative w-full min-h-[160px] cursor-pointer perspective-1000 group"
      >
        <div className="w-full h-full text-left p-4 rounded-xl border border-white/20 shadow-sm backdrop-blur-sm transition-all duration-300 bg-white/40 hover:bg-gray-100 group-hover:bg-white/60 group-active:scale-[0.98] flex flex-col justify-between">
            <div>
            <div className="text-[11px] text-slate-600 leading-relaxed font-medium">
              {cards[cardIndex].content}
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-1">
              {cards.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1 w-3 rounded-full transition-all ${i === cardIndex ? 'bg-blue-500 w-6' : 'bg-slate-300'}`} 
                />
              ))}
            </div>
            <ArrowRight size={14} className="text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MacButton({ children, onClick, href, download, className = "" }) {
  const baseStyles = `px-4 py-1.5 bg-gradient-to-b from-[#58A6FF] to-[#007AFF] border border-black/10 shadow-[inset_0_1px_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.1)] text-white text-[13px] font-medium rounded-md transition-all duration-100 hover:brightness-110 active:brightness-90 active:shadow-inner inline-flex items-center justify-center select-none cursor-default`;
  const combinedClasses = `${baseStyles} ${className}`;
  if (href) return (<a href={href} download={download} className={combinedClasses} target="_blank" rel="noopener noreferrer">{children}</a>);
  return (<button onClick={onClick} className={combinedClasses}>{children}</button>);
}