import { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google'; // New Import
import Dock from './components/Dock';
import Window from './components/Window';
import DesktopFile from './components/DesktopFile';
import { ProfileCard } from './components/Widgets';
import MenuBar from './components/MenuBar';
import Notification from './components/Notification'; 
import BookingWindow from './components/Booking/BookingWindow';
import Finder from './components/Finder';

// Assets
import wallPaper from './assets/wallpaper6.jpg';
import profileImg from './assets/headshot.jpg'; 
import resumePDF from './assets/Resume_AnikaSood.pdf'; 

// Replace this string with the Client ID you copied from Google Cloud Console
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

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      const contactWidth = mobile ? window.innerWidth * 0.92 : 500;
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
      const winW = isMobile ? window.innerWidth * 0.92 : 700;
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
      <div 
        className="fixed inset-0 w-screen h-screen bg-cover bg-center bg-no-repeat overflow-hidden font-sans"
        style={{ backgroundImage: `url(${wallPaper})` }}
      >
        <MenuBar />
        <Notification 
          title="Welcome to my corner of the web!" 
          message="Here's my twist on the MacOS and a portfolio of my software engineering + photography work. Click around & explore! (＾◡＾)っ" 
        />
       
        <div className="absolute top-20 right-6 flex flex-col gap-6 items-center z-10"> 
          <DesktopFile name="Resume.pdf" icon="📄" onOpen={openResume} />
        </div>

        {isReservOpen && (
          <Window 
            title="Calendar — Bookings" 
            onClose={() => setIsReservOpen(false)} 
            initialPos={reservPos}
            onFocus={() => setFocusedWindow("reserv")}
            zIndex={focusedWindow === "reserv" ? 200 : 100}
            size={isMobile ? "92vw" : "700px"}
            height={isMobile ? "80vh" : "650px"}
          >
            <BookingWindow />
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
            size={isMobile ? "92vw" : "500px"}
            height={isMobile ? "80vh" : "auto"}
          >
            <div className="overflow-y-auto overflow-x-hidden bg-transparent p-6 md:p-10">
              <ProfileCard 
                name="Anika Sood"
                image={profileImg}
                bio="I'm actively seeking early-career software engineering roles..."
                fun_fact="Fun fact- I built this site from scratch & have published an article about the process on Medium. ◝(ᵔᗜᵔ)◜ "
              />
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