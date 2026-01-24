import { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google'; 
import { Gradient } from './Gradient'; // Ensure you have created this file
import Dock from './components/Dock';
import Window from './components/Window';
import DesktopFile from './components/DesktopFile';
import { ProfileCard } from './components/Widgets';
import MenuBar from './components/MenuBar';
import Notification from './components/Notification'; 
import BookingWindow from './components/Booking/BookingWindow';
import Finder from './components/Finder';

// Assets
import profileImg from './assets/headshot.jpg'; 
import resumePDF from './assets/Resume_AnikaSood.pdf'; 

const GOOGLE_CLIENT_ID = "18540558321-hpfvnipe07j1ibjuesevcprsidpfd9io.apps.googleusercontent.com";

function MacButton({ children, href, download, className = "", onClick }) {
  const baseStyles = `px-5 py-2 bg-blue-50 text-[#007AFF] text-[13px] font-semibold rounded-lg transition-all duration-200 hover:bg-blue-100 active:scale-95 inline-flex items-center justify-center select-none cursor-pointer`;
  
  if (href) {
    return (
      <a href={href} download={download} className={`${baseStyles} ${className}`}>
        {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={`${baseStyles} ${className}`}>
      {children}
    </button>
  );
}

function App() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(true); 
  const [isFinderOpen, setIsFinderOpen] = useState(false);
  const [isReservOpen, setIsReservOpen] = useState(false);
  
  const [focusedWindow, setFocusedWindow] = useState("contact");
  const [isMobile, setIsMobile] = useState(false);
  
  const [resumePos, setResumePos] = useState({ x: 100, y: 100 });
  const [contactPos, setContactPos] = useState({ x: 0, y: 0 });
  const [finderPos, setFinderPos] = useState({ x: 50, y: 50 });
  const [reservPos, setReservPos] = useState({ x: 80, y: 80 });

  // Initialize Gradient Animation
  useEffect(() => {
    const gradient = new Gradient();
    gradient.initGradient('#gradient-canvas');
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Match the width logic used in the Window component (92vw vs 40vw)
      const contactWidth = mobile ? window.innerWidth * 0.92 : window.innerWidth * 0.40;
      const x = (window.innerWidth - contactWidth) / 2;
      const y = window.innerHeight * 0.10; 
      setContactPos({ x, y });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getRandomPos = (winWidth, winHeight) => {
    const padding = 20;
    const menuBarHeight = 35;
    const dockHeight = 80;

    const maxX = window.innerWidth - winWidth - padding;
    const maxY = window.innerHeight - winHeight - dockHeight;

    const x = Math.max(padding, Math.floor(Math.random() * maxX));
    const y = Math.max(menuBarHeight, Math.floor(Math.random() * maxY));

    return { x, y };
  };

  const openContact = () => {
    setFocusedWindow("contact");
    setIsContactOpen(true);
  };

  const openFinder = () => {
    if (!isFinderOpen) {
      const winW = isMobile ? window.innerWidth * 0.92 : 900;
      const winH = isMobile ? window.innerHeight * 0.70 : 600;
      setFinderPos(getRandomPos(winW, winH));
    }
    setFocusedWindow("finder");
    setIsFinderOpen(true);
  };

 const openReserv = () => {
  if (!isReservOpen) {
    const winW = isMobile ? window.innerWidth * 0.92 : 950;
    const winH = isMobile ? window.innerHeight * 0.80 : 650;
    setReservPos(getRandomPos(winW, winH));
  }
  setFocusedWindow("reserv");
  setIsReservOpen(true);
};
  const openResume = () => {
    if (!isResumeOpen) {
      const winW = isMobile ? window.innerWidth * 0.95 : Math.min(window.innerWidth * 0.8, 1100);
      const winH = window.innerHeight * 0.75;
      setResumePos(getRandomPos(winW, winH));
    }
    setFocusedWindow("resume");
    setIsResumeOpen(true);
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="fixed inset-0 w-screen h-screen overflow-hidden font-sans">
        {/* Animated Gradient Background */}
        <canvas id="gradient-canvas" data-transition-in />

        <MenuBar />
        <Notification 
          title="Welcome!" 
          message="Here's my twist on the MacOS and a portfolio of my software engineering + photography work. Click around & explore! (＾◡＾)っ" 
        />
       
        <div className="absolute top-20 right-6 flex flex-col gap-6 items-center z-10"> 
          <div style={{ 
            textShadow: '0px 0px 1px #4b5667ff' // adds a slight "glow" to smooth the outline
          }}>
            <DesktopFile name="Resume.pdf" icon="📄" onOpen={openResume} />
          </div>
        </div>

        {isReservOpen && (
          <Window 
            title="Calendar — Bookings" 
            onClose={() => setIsReservOpen(false)} 
            initialPos={reservPos}
            onFocus={() => setFocusedWindow("reserv")}
            zIndex={focusedWindow === "reserv" ? 200 : 100}
            size={isMobile ? "92vw" : "950px"}
            height={isMobile ? "80vh" : "800px"}
          >
            <BookingWindow onOpenContact={openContact} />
          </Window>
        )}

        {isFinderOpen && (
          <Window 
            title="Finder — Photography" 
            onClose={() => setIsFinderOpen(false)} 
            initialPos={finderPos}
            onFocus={() => setFocusedWindow("finder")}
            zIndex={focusedWindow === "finder" ? 200 : 100}
            size={isMobile ? "92vw" : "900px"}
            height={isMobile ? "70vh" : "600px"}
          >
            <Finder />
          </Window>
        )}

        {isContactOpen && (
          <Window 
            title="Contact" 
            onClose={() => setIsContactOpen(false)} 
            initialPos={contactPos}
            onFocus={() => setFocusedWindow("contact")}
            zIndex={focusedWindow === "contact" ? 200 : 100}
            size={isMobile ? "92vw" : "40vw"}
            height={isMobile ? "80vh" : "570px"}
          >
            <div className="overflow-y-auto overflow-x-hidden bg-transparent p-6 md:p-10">
              <ProfileCard 
                name="Anika Sood"
                image={profileImg}
                bio_tech={
                  <>
                    I am a <strong>BS/MS Computer Science student at UC Riverside</strong> (graduating 2026) looking for my first <strong>early-career SWE role</strong>. I’m drawn to software engineering because it’s all about <strong> building things, creativity, & problem solving.</strong> Over the past few summers, I’ve had some great internships that shaped me into the engineer I am today. To learn more about my technical skills, feel free to <strong>check out my resume on the Desktop!</strong>
                  </>
                }
                bio_photo={
                  <>
                    Over the past 5 years, I have also been running a <strong>professional photography business</strong> focusing on portraits, fashion, and live concerts. Managing a business while finishing my degrees has taught me a lot about <strong>design patterns, communication, and organization</strong>.
                  </>
                }              
                fun_fact={
                  <>
                    This site is a <strong>hybrid space</strong> for both of my worlds. Feel free to reach out if you’re interested in chatting about <strong>software engineering opportunities</strong>, or if you just want to <strong>book a shoot!</strong>
                  </>
                }/>
            </div>
          </Window>
        )}

        {isResumeOpen && (
          <Window 
            title="Resume.pdf" 
            onClose={() => setIsResumeOpen(false)} 
            initialPos={resumePos}
            onFocus={() => setFocusedWindow("resume")}
            zIndex={focusedWindow === "resume" ? 200 : 100}
            size={isMobile ? "95vw" : "50vw"}
            height="75vh"
          >
            <div className="flex flex-col h-full bg-[#f5f5f7] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shrink-0">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Document</span>
                  <span className="text-xs font-semibold text-gray-700">Anika_Sood_Resume.pdf</span>
                </div>
                <MacButton href={resumePDF} download="Anika_Sood_Resume.pdf">
                  Download
                </MacButton>
              </div>
              <div className="flex-1 w-full bg-gray-100 overflow-hidden relative">
                {isMobile ? (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Resume Preview</h3>
                    <p className="text-sm text-gray-500 mb-6">PDF embedding is restricted on mobile devices.</p>
                    <MacButton href={resumePDF} className="w-full py-3">View Full PDF</MacButton>
                  </div>
                ) : (
                  <iframe src={`${resumePDF}#view=FitH`} title="Resume" className="w-full h-full border-none" />
                )}
              </div>
            </div>
          </Window>
        )}

        <Dock 
          isContactOpen={isContactOpen} 
          onOpenContact={openContact}
          isFinderOpen={isFinderOpen}       
          onOpenFinder={openFinder}
          isReservOpen={isReservOpen}    
          onOpenReserv={openReserv}      
        />
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;