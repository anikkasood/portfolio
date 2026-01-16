import { useState } from 'react';
import PhotoGallery from './PhotoGallery';

// Mock Data - Replace URLs with your actual image paths
const ALBUMS = {
  Portraits: [
    "https://picsum.photos/id/64/400/600",
    "https://picsum.photos/id/65/400/300",
    "https://picsum.photos/id/66/400/500",
  ],
  Concerts: [
    "https://picsum.photos/id/76/400/300",
    "https://picsum.photos/id/77/400/400",
  ],
  Fashion: [
    "https://picsum.photos/id/88/400/500",
    "https://picsum.photos/id/89/400/300",
  ]
};

export default function Finder() {
  const [currentAlbum, setCurrentAlbum] = useState(null);

  return (
    <div className="flex h-full bg-white text-slate-800">
      {/* Sidebar */}
      <div className="w-48 bg-gray-100/50 border-r border-gray-200 p-4 flex flex-col gap-6">
        <div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Favorites</p>
          <ul className="space-y-1">
            <li 
              onClick={() => setCurrentAlbum(null)}
              className={`text-sm px-2 py-1 rounded-md cursor-pointer ${!currentAlbum ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
            >
              📂 All Albums
            </li>
          </ul>
        </div>
        
        <div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Albums</p>
          <ul className="space-y-1">
            {Object.keys(ALBUMS).map(album => (
              <li 
                key={album}
                onClick={() => setCurrentAlbum(album)}
                className={`text-sm px-2 py-1 rounded-md cursor-pointer ${currentAlbum === album ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
              >
                🖼️ {album}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-12 border-b border-gray-100 flex items-center px-6 justify-between shrink-0">
          <h2 className="text-sm font-bold text-gray-700">{currentAlbum || "All Albums"}</h2>
          {currentAlbum && (
            <button 
              onClick={() => setCurrentAlbum(null)}
              className="text-xs text-blue-500 hover:underline"
            >
              Back to Albums
            </button>
          )}
        </div>

        <div className="flex-1 overflow-hidden p-4">
          {!currentAlbum ? (
            /* Grid of Albums */
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
              {Object.keys(ALBUMS).map(album => (
                <div 
                  key={album} 
                  onClick={() => setCurrentAlbum(album)}
                  className="group cursor-pointer flex flex-col items-center"
                >
                  <div className="w-full aspect-square bg-gray-100 rounded-xl overflow-hidden mb-2 border border-black/5 group-hover:shadow-md transition-all">
                    <img 
                      src={ALBUMS[album][0]} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      alt={album}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600">{album}</span>
                </div>
              ))}
            </div>
          ) : (
            /* Gallery of specific Album */
            <PhotoGallery images={ALBUMS[currentAlbum]} />
          )}
        </div>
      </div>
    </div>
  );
}