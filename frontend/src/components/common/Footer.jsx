import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-slate-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
              <span className="text-white text-xs font-black">W</span>
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-200">WasteNot</span>
          </div>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            Reducing food waste, one meal at a time. &copy; {new Date().getFullYear()} WasteNot.
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Home</Link>
            <Link to="/register" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Register</Link>
            <Link to="/login" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
