// Header.tsx
import React from 'react';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button 
            className="lg:hidden p-2 text-gray-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            onClick={onMenuClick}
            aria-label="Toggle sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h2 className="ml-2 text-xl font-semibold text-gray-800 dark:text-white">Dashboard</h2>
        </div>
        
        <div className="flex items-center">
          <div className="ml-3 relative">
            <div>
              <button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-indigo-200 flex items-center justify-center">
                  <span className="text-indigo-700 font-semibold">U</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};