import { useState } from 'react';
import { Menu, LogOut, Sun, Moon, Zap, ChevronDown, LayoutGrid, List } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme, toggleSidebar, toggleViewMode } from '../redux/slices/uiSlice';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, viewMode } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="glass-panel sticky top-4 mx-4 md:mx-6 rounded-2xl z-40 px-4 md:px-6 h-16 flex items-center justify-between transition-all duration-300 mt-4 mb-6">
      
      {/* LEFT: Mobile Menu & Breadcrumb */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Mobile Toggle */}
        <button 
          onClick={() => dispatch(toggleSidebar())} 
          className="md:hidden p-2 rounded-lg hover:bg-black/5 transition-colors"
          style={{ color: 'var(--text-primary)' }}
        >
          <Menu size={24} />
        </button>
        
        {/* Title - Hide subtext on mobile to save space */}
        <div className="flex flex-col">
          <span className="hidden md:block text-xs font-bold uppercase tracking-wider opacity-50" style={{ color: 'var(--text-secondary)' }}>Dashboard</span>
          <span className="text-lg font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>Overview</span>
        </div>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-2">

        {/* View Switcher - Now visible on mobile */}
        <div className="flex bg-black/5 p-1 rounded-full border" style={{ borderColor: 'var(--border)' }}>
          <button 
            onClick={() => dispatch(toggleViewMode())}
            className={`p-1.5 rounded-full transition-all ${viewMode === 'grid' ? 'shadow-sm' : 'opacity-50'}`}
            style={{ 
              backgroundColor: viewMode === 'grid' ? 'var(--bg-primary)' : 'transparent',
              color: viewMode === 'grid' ? 'var(--accent)' : 'var(--text-secondary)'
            }}
          >
            <List size={16} />
          </button>
          <button 
            onClick={() => dispatch(toggleViewMode())}
            className={`p-1.5 rounded-full transition-all ${viewMode === 'tile' ? 'shadow-sm' : 'opacity-50'}`}
            style={{ 
              backgroundColor: viewMode === 'tile' ? 'var(--bg-primary)' : 'transparent',
              color: viewMode === 'tile' ? 'var(--accent)' : 'var(--text-secondary)'
            }}
          >
            <LayoutGrid size={16} />
          </button>
        </div>
        
        {/* Theme Switcher */}
        <div className="hidden sm:flex bg-black/5 p-1 rounded-full border" style={{ borderColor: 'var(--border)' }}>
          {[
             { id: 'light', icon: Sun },
             { id: 'dark', icon: Moon },
             { id: 'holo', icon: Zap }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => dispatch(setTheme(t.id))}
              className={`p-1.5 rounded-full transition-all ${theme === t.id ? 'shadow-sm scale-105' : 'opacity-50'}`}
              style={{ 
                color: theme === t.id ? 'var(--accent)' : 'var(--text-secondary)',
                backgroundColor: theme === t.id ? 'var(--bg-primary)' : 'transparent'
              }}
            >
              <t.icon size={16} />
            </button>
          ))}
        </div>

        {/* Mobile Theme Toggle (Simple Cycle) - To save space on phones */}
        <button 
           className="sm:hidden p-2 rounded-full border bg-black/5" 
           style={{ borderColor: 'var(--border)', color: 'var(--accent)' }}
           onClick={() => dispatch(setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'holo' : 'light'))}
        >
           {theme === 'light' ? <Sun size={18} /> : theme === 'dark' ? <Moon size={18} /> : <Zap size={18} />}
        </button>

        {/* User Profile - Compact on mobile */}
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 pl-1 pr-1 md:pr-3 py-1 rounded-full hover:bg-black/5 transition-all border border-transparent"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--accent)] to-indigo-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div className="hidden md:block text-left">
               <div className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{user?.username}</div>
            </div>
          </button>

          {isMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-48 glass-panel rounded-xl py-2 z-20 animate-in fade-in zoom-in-95 border shadow-xl">
                <button onClick={() => { dispatch(logout()); navigate('/login'); }} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2">
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;