import { useState } from 'react';
import TabCreate from './TabCreate';
import TabManage from './TabManage';
import TabAdmin from './TabAdmin';
import AuthGuard from './AuthGuard';

export default function ReservationSystem() {
  const [activeTab, setActiveTab] = useState('create');
  const [user, setUser] = useState(null); // Will hold Google User info

  const tabs = [
    { id: 'create', label: 'New Reservation' },
    { id: 'manage', label: 'My Bookings' },
    { id: 'admin', label: 'Admin Portal' },
  ];

  const renderContent = () => {
    // Admin and Manage tabs require login
    if (activeTab !== 'create' && !user) {
      return <AuthGuard onLogin={setUser} />;
    }

    switch (activeTab) {
      case 'create': return <TabCreate user={user} onLogin={setUser} />;
      case 'manage': return <TabManage user={user} />;
      case 'admin': return <TabAdmin user={user} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* macOS Style Tab Bar */}
      <div className="flex bg-gray-100/80 border-b border-gray-200 p-1 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === tab.id 
              ? "bg-white shadow-sm text-blue-600" 
              : "text-gray-500 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-6">
        {renderContent()}
      </div>
    </div>
  );
}