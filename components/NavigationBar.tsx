'use client';

import { useState } from 'react';
import { Search, LogIn, User, ChevronDown } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useRef } from 'react';

export default function NavigationBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showToolbar, setShowToolbar] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setShowToolbar(false);
      }
    };

    if (showToolbar) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showToolbar]);

  const handleAuthClick = () => {
    if (user) {
      setShowToolbar(!showToolbar);
    } else {
      // TODO: Implement login modal/navigation
      console.log('Login clicked');
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setShowToolbar(false);
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Spacer for left side */}
          <div className="flex-1" />

          {/* Search Field - Centered */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5 z-10" />
            <input
              type="text"
              placeholder="Search stops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 pl-10 pr-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all shadow-lg"
            />
          </div>

          {/* Spacer for right side */}
          <div className="flex-1 flex justify-end">
            {/* Login Button - Far Right */}
            <div className="relative" ref={toolbarRef}>
              {loading ? (
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 animate-pulse shadow-lg" />
              ) : user ? (
                <>
                  <button
                    onClick={handleAuthClick}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 transition-all shadow-lg"
                    title={user.email || 'User'}
                  >
                    <User className="w-5 h-5 text-white" />
                  </button>
                  {showToolbar && (
                    <div className="absolute right-0 top-12 mt-2 w-48 bg-zinc-900/95 backdrop-blur-md border border-white/20 rounded-lg shadow-xl overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm text-white/90 font-medium truncate">
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left text-sm text-white/80 hover:bg-white/10 transition-colors flex items-center gap-2"
                      >
                        <LogIn className="w-4 h-4 rotate-180" />
                        Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={handleAuthClick}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 transition-all shadow-lg"
                  title="Login"
                >
                  <LogIn className="w-5 h-5 text-white" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
