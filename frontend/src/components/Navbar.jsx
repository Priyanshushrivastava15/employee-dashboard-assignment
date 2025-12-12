import { useState } from 'react';
import { Menu, User, LayoutGrid, List, LogOut, ChevronDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar, toggleViewMode } from '../redux/slices/uiSlice';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { viewMode } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    if(confirm('Are you sure you want to log out?')) {
      dispatch(logout());
      navigate('/login');
    }
  };

  return (
    <nav className="glass sticky top-0 z-50 h-16 px-6 flex items-center justify-between shadow-sm bg-white/80 backdrop-blur-md border-b border-slate-200/50">
      {/* Left: Brand */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-violet-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
            E
          </div>
          <h1 className="hidden md:block text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight">
            EmpManager<span className="font-light opacity-70">Pro</span>
          </h1>
        </div>
      </div>

      {/* Center: View Toggles (Desktop) */}
      <div className="hidden md:flex bg-slate-100/50 p-1 rounded-lg border border-slate-200/50">
        <button 
          onClick={() => dispatch(toggleViewMode())}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <List size={16} />
          <span>Grid</span>
        </button>
        <button 
          onClick={() => dispatch(toggleViewMode())}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${viewMode === 'tile' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <LayoutGrid size={16} />
          <span>Tiles</span>
        </button>
      </div>

      {/* Right: Profile Menu */}
      <div className="relative">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-3 hover:bg-slate-50 p-1.5 pr-3 rounded-full transition-all border border-transparent hover:border-slate-100"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 border border-white shadow-sm flex items-center justify-center text-blue-700 font-semibold">
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-slate-700 leading-none">{user?.username || 'Admin'}</p>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">{user?.role || 'Viewer'}</p>
          </div>
          <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown */}
        {isMenuOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-20 animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 py-3 border-b border-slate-50 md:hidden">
                <p className="text-sm font-semibold text-slate-900">{user?.username}</p>
                <p className="text-xs text-slate-500">{user?.role}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;