import React from 'react';
import { shouldUseDemoMode } from '../services/demoApi';

const DemoBanner: React.FC = () => {
  if (!shouldUseDemoMode()) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black py-3 px-4 text-center text-sm font-medium shadow-lg">
      <div className="container mx-auto flex items-center justify-center gap-2">
        <span className="text-lg">🎭</span>
        <span>
          <strong>DEMO MODE</strong> - This is a demonstration version with sample data. 
          All functionality works, but no real data is saved.
        </span>
        <span className="text-lg">🎭</span>
      </div>
      <div className="text-xs mt-1 opacity-90">
        Demo Credentials: Admin: <code className="bg-black/20 px-1 rounded">admin/demo123</code> | 
        User: <code className="bg-black/20 px-1 rounded">demo@akelihlecap.co.za/demo123</code>
      </div>
    </div>
  );
};

export default DemoBanner;