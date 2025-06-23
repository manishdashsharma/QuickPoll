'use client';

import { BarChart3, Menu, X } from 'lucide-react';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { useState } from 'react';

export default function Navbar() {
  const { isSignedIn, user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-black/80 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-black" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-white">QuickPoll</h1>
              <p className="text-xs text-gray-400">Instant Polling</p>
            </div>
            <h1 className="text-xl font-bold text-white sm:hidden">QuickPoll</h1>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            {isSignedIn ? (
              <div className="flex items-center gap-3">
                <span className="text-gray-300 text-sm hidden lg:block">
                  Welcome, {user?.firstName || user?.username || 'User'}
                </span>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                />
              </div>
            ) : (
              <>
                <a href="#features" className="text-gray-300 hover:text-white font-medium transition-colors">
                  Features
                </a>
                <a href="#how-it-works" className="text-gray-300 hover:text-white font-medium transition-colors">
                  How it Works
                </a>
                <SignInButton mode="modal">
                  <button className="bg-white text-black px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Sign In
                  </button>
                </SignInButton>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center gap-3">
            {isSignedIn && (
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            )}
            <button
              onClick={toggleMobileMenu}
              className="text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-700">
            <div className="flex flex-col space-y-4 pt-4">
              {isSignedIn ? (
                <div className="text-gray-300 text-sm px-2">
                  Welcome, {user?.firstName || user?.username || 'User'}!
                </div>
              ) : (
                <>
                  <a 
                    href="#features" 
                    className="text-gray-300 hover:text-white font-medium transition-colors px-2 py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Features
                  </a>
                  <a 
                    href="#how-it-works" 
                    className="text-gray-300 hover:text-white font-medium transition-colors px-2 py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    How it Works
                  </a>
                  <div className="px-2">
                    <SignInButton mode="modal">
                      <button className="w-full bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                        Sign In
                      </button>
                    </SignInButton>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}