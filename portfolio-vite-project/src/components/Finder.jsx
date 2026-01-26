import { useState } from 'react';
import PhotoGallery from './PhotoGallery';
// 1. This must be a STATIC string. No variables allowed here!
const allImages = import.meta.glob('../photo-albums/*/*.{png,jpg,jpeg,PNG,JPG}', {
  eager: true,
  import: 'default',
});

// 2. We'll create a helper to filter the big list by folder name
const getImagesFromFolder = (folderName) => {
  return Object.keys(allImages)
    .filter((path) => path.includes(`/photo-albums/${folderName}/`))
    .map((path) => allImages[path]);
};

const ALBUMS = {
  // --- Featured / High Energy ---
  
  "Anvita's Graduation": getImagesFromFolder('anvita-grad'),
  "Zoya & Friends": getImagesFromFolder('zoya-grad'),
    "Zoe": getImagesFromFolder('dance-zoe'),
   

  "Reb's Grad": getImagesFromFolder('reb-grad'),
 "Dayglow Live": getImagesFromFolder('dayglow'),
  "Wedding": getImagesFromFolder('wedding'),
   "Almost Monday": getImagesFromFolder('almost-monday'), // Kept lowercase for band aesthetic
    "Sunaina Grad": getImagesFromFolder('sunaina-grad'),
  "Em's Graduation": getImagesFromFolder('em-grad'),

  "Fashion/Editorial": getImagesFromFolder('fashion'),
  "Yimon Portraits": getImagesFromFolder('yimon-grad'),
  "Emily's Portraits": getImagesFromFolder('emily-grad'),

  "Class of 2025": getImagesFromFolder('2025-grad'),
  "Dalia Grad": getImagesFromFolder('dalia-grad'),
  

  "Denise Grad": getImagesFromFolder('denise-grad'),
  "Sai Portraits": getImagesFromFolder('sai-grad'),
  "Kelsey's Session": getImagesFromFolder('kelsey-grad'),
  
  "Alyssa Grad": getImagesFromFolder('alyssa-grad'),
  
};

export default function Finder() {
  const [currentAlbum, setCurrentAlbum] = useState(null);

  return (
    <div className="flex h-full bg-white text-slate-800 flex-col md:flex-row">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      {/* --- DESKTOP SIDEBAR (Hidden on Mobile) --- */}
      <div className="hidden md:flex w-48 bg-gray-100/50 border-r border-gray-200 p-4 flex-col gap-6">
        <div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Favorites</p>
          <ul className="space-y-1">
            <li 
              onClick={() => setCurrentAlbum(null)}
              className={`text-sm px-2 py-1.5 rounded-md cursor-pointer transition-colors ${!currentAlbum ? 'bg-blue-100 text-blue-600 font-medium' : 'hover:bg-gray-200'}`}
            >
              All Albums
            </li>
          </ul>
        </div>
        
        <div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Albums</p>
          <ul className="space-y-1 overflow-y-auto max-h-[calc(100vh-300px)] scrollbar-hide">
            {Object.keys(ALBUMS).map(album => (
              <li 
                key={album}
                onClick={() => setCurrentAlbum(album)}
                className={`text-sm px-2 py-1.5 rounded-md cursor-pointer transition-colors ${currentAlbum === album ? 'bg-blue-100 text-blue-600 font-medium' : 'hover:bg-gray-200'}`}
              >
                {album}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* --- MOBILE DROPDOWN NAVIGATION (Visible only on Mobile) --- */}
      <div className="block md:hidden border-b border-gray-200 p-4 bg-white sticky top-0 z-20">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Album</label>
          <select 
            value={currentAlbum || ""} 
            onChange={(e) => setCurrentAlbum(e.target.value || null)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
          >
            <option value="">All Albums</option>
            {Object.keys(ALBUMS).map(album => (
              <option key={album} value={album}>{album}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-10 md:h-12 border-b border-gray-100 flex items-center px-4 md:px-6 justify-between shrink-0">
          <h2 className="text-xs md:text-sm font-bold text-gray-700 truncate mr-2">
            {currentAlbum || "All Albums"}
          </h2>
          {currentAlbum && (
            <button 
              onClick={() => setCurrentAlbum(null)}
              className="text-[11px] md:text-xs font-medium text-blue-500 hover:text-blue-600 whitespace-nowrap"
            >
              Back to Overview
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {!currentAlbum ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 animate-in fade-in zoom-in-95 duration-300">
              {Object.keys(ALBUMS).map(album => (
                <div 
                  key={album} 
                  onClick={() => setCurrentAlbum(album)}
                  className="group cursor-pointer flex flex-col items-start"
                >
                  <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2 md:mb-3 border border-black/5 group-hover:shadow-lg transition-all">
                    <img 
                      src={ALBUMS[album][0]} 
                      className="w-full h-full object-cover" 
                      alt={album}
                    />
                  </div>
                  <span className="text-xs md:text-sm font-semibold text-gray-700 leading-tight">{album}</span>
                  <span className="text-[10px] md:text-xs text-gray-400">{ALBUMS[album].length} photos</span>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <PhotoGallery images={ALBUMS[currentAlbum]} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
