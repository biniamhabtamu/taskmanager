import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  CheckSquare, 
  Calendar, 
  BarChart3, 
  Settings, 
  Crown,
  Code,
  BookOpen,
  Heart,
  User,
  Wrench,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const menuItems = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { path: '/calendar', icon: Calendar, label: 'Calendar' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
];

const categoryItems = [
  { path: '/tasks/code', icon: Code, label: 'Code Tasks', category: 'code-tasks' },
  { path: '/tasks/learning', icon: BookOpen, label: 'Learning', category: 'learning' },
  { path: '/tasks/relationship', icon: Heart, label: 'Relationships', category: 'relationship' },
  { path: '/tasks/self', icon: User, label: 'Self Development', category: 'self-development' },
  { path: '/tasks/projects', icon: Wrench, label: 'Project Improvement', category: 'project-improvement' },
];

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { userProfile } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md"
      >
        <Menu size={20} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        variants={sidebarVariants}
        animate={isOpen ? 'open' : 'closed'}
        className="lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto"
      >
        <div className="p-6">
          {/* Close button for mobile */}
          <div className="lg:hidden flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              TaskManager
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          {/* Logo for desktop */}
          <div className="hidden lg:block mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              TaskManager
            </h2>
          </div>

          {/* Premium Badge */}
          {userProfile?.isPremium && (
            <div className="mb-6 p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
              <div className="flex items-center text-white">
                <Crown size={20} className="mr-2" />
                <span className="font-medium">Premium User</span>
              </div>
            </div>
          )}

          {/* Main Navigation */}
          <nav className="space-y-2">
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Main
              </h3>
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon size={18} className="mr-3" />
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mb-4">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Categories
              </h3>
              {categoryItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon size={18} className="mr-3" />
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link
                to="/premium"
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/premium')
                    ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200'
                    : 'text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                }`}
              >
                <Crown size={18} className="mr-3" />
                Premium
              </Link>
              
              <Link
                to="/settings"
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/settings')
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Settings size={18} className="mr-3" />
                Settings
              </Link>
            </div>
          </nav>
        </div>
      </motion.div>
    </>
  );
};