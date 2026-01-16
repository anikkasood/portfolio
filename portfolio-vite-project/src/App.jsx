import Dock from './components/Dock';
import Window from './components/Window';
import PhotoGallery from './components/PhotoGallery';
import DesktopFile from './components/DesktopFile';
import { useState, useEffect } from 'react';

import wallPaper from './assets/wallpaper.jpg';
import img1 from './assets/15-Sequoia-Sunrise.png';
import img2 from './assets/photography-highlights/IMG_6581.JPG';
import img3 from './assets/photography-highlights/IMG_3596.JPG';

const albumPhotos = [img1, img2, img3];

function App() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(true); 
  const [focusedWindow, setFocusedWindow] = useState("contact");
  
  const [resumePos, setResumePos] = useState({ x: 100, y: 100 });
  const [contactPos, setContactPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleCenter = () => {
      const isMobile = window.innerWidth < 768;
      
      // Exact percentages used in the Window 'size' prop below
      const widthPercent = isMobile ? 0.9 : 0.6; 
      const heightPercent = isMobile ? 0.8 : 0.7; 

      const winW = window.innerWidth * widthPercent; 
      const winH = window.innerHeight * heightPercent; 
      
      setContactPos({
        x: (window.innerWidth - winW) / 2,
        y: (window.innerHeight - winH) / 2,
      });
    };

    handleCenter();
    window.addEventListener('resize', handleCenter);
    return () => window.removeEventListener('resize', handleCenter);
  }, []);

  const openContact = () => {
    if (isContactOpen) {
      setFocusedWindow("contact");
      return;
    }
    setIsContactOpen(true);
    setFocusedWindow("contact");
  };

  const openResume = () => {
    if (isResumeOpen) {
      setFocusedWindow("resume");
      return;
    }
    const isMobile = window.innerWidth < 768;
    const winW = isMobile ? window.innerWidth * 0.85 : window.innerWidth * 0.4;
    const winH = isMobile ? window.innerHeight * 0.7 : window.innerHeight * 0.5;
    
    const maxX = window.innerWidth - winW - 20;
    const maxY = window.innerHeight - winH - 20;
    const randomX = Math.max(10, Math.floor(Math.random() * maxX));
    const randomY = Math.max(10, Math.floor(Math.random() * maxY));

    setResumePos({ x: randomX, y: randomY });
    setIsResumeOpen(true);
    setFocusedWindow("resume");
  };

  return (
    <div 
      className="fixed inset-0 w-screen h-screen m-0 p-0 bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ 
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, .3), rgba(0, 0, 0, 0.2)), url(${wallPaper})` 
      }}
    >
      {/* Desktop File Layer */}
      <div className="absolute top-10 right-6 flex flex-col gap-6 items-center z-10"> 
        <DesktopFile name="Resume" icon="📄" onOpen={openResume} />
      </div>
     
      {isContactOpen && (
        <Window 
          title="About + Contact Me" 
          onClose={() => setIsContactOpen(false)} 
          initialPos={contactPos}
          onFocus={() => setFocusedWindow("contact")}
          zIndex={focusedWindow === "contact" ? 50 : 10}
          // Use standard Tailwind classes for desktop, and let the initialPos handle the centering math
          size="w-[90vw] md:w-[60vw] h-[80vh] md:h-[70vh]"
        >
          <div className="flex flex-col h-full items-center justify-center text-slate-700 p-2 text-center">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Anika Sood Photography</h2>
            <p className="text-sm md:text-base font-medium">This window is now perfectly centered on all devices.</p>
          </div>
        </Window>
      )}

      {isResumeOpen && (
        <Window 
          title="Resume" 
          onClose={() => setIsResumeOpen(false)} 
          initialPos={resumePos}
          onFocus={() => setFocusedWindow("resume")}
          zIndex={focusedWindow === "resume" ? 50 : 10}
          size="w-[85vw] md:w-[40vw] h-[70vh] md:h-[50vh]"
        >
          <div className="flex flex-col h-full items-center justify-center text-slate-700 p-2 text-center">
            <h2 className="text-xl md:text-2xl font-bold mb-4">My Resume</h2>
            <p>Resume content here.</p>
          </div>
        </Window>
      )}
      
      <Dock 
        isContactOpen={isContactOpen} 
        onOpenContact={openContact}
        isResumeOpen={isResumeOpen}
        onOpenResume={openResume} 
      />
    </div>
  );
}

export default App;