'use client';

import { BarChart3 } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-black/80 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">QuickPoll</h1>
              <p className="text-xs text-gray-400">Instant Polling</p>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white font-medium transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-300 hover:text-white font-medium transition-colors">
              How it Works
            </a>
            <button className="bg-white text-black px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}