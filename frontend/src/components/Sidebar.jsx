import { X, Users, BarChart2, Settings, Home, FileText, ChevronRight, Menu, ChevronLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar, setSidebar } from '../redux/slices/uiSlice';
import { useState } from 'react';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { isSidebarOpen } = useSelector((state) => state.ui);
  const [openMenu, setOpenMenu] = useState(null);

  const menuItems = [
    { title: 'Dashboard', icon: Home, subItems: ['Overview', 'Analytics', 'Real-time'] },
    { title: 'Employees', icon: Users, subItems: ['All Staff', 'Attendance', 'Leaves', 'Departments'] },
    { title: 'Reports', icon: FileText, subItems: ['Payroll', 'Performance', 'Audit Logs'] },
    { title: 'System', icon: Settings, subItems: ['Roles', 'Global Settings'] },
  ];

  return (
    <>
      {/* Mobile Overlay - Only visible on mobile when open */}
      <div 
        className={`md:hidden fixed inset-0 bg-black/80 z-[60] transition-opacity duration-300 backdrop-blur-sm ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => dispatch(setSidebar(false))}
      />

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 left-0 h-full z-[70] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] border-r shadow-2xl overflow-hidden
          ${isSidebarOpen ? 'w-72' : 'w-0 md:w-20'} 
        `}
        style={{ 
          backgroundColor: 'var(--bg-secondary)', 
          borderColor: 'var(--border)', 
          color: 'var(--text-primary)' 
        }}
      >
        {/* HEADER */}
        <div 
          className="h-20 flex items-center px-5 border-b shrink-0" 
          style={{ borderColor: 'var(--border)' }}
        >
            {/* Toggle Button */}
            <button 
                onClick={() => dispatch(toggleSidebar())}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors shrink-0 z-50 relative"
                style={{ color: 'var(--text-secondary)' }}
            >
                {isSidebarOpen ? <ChevronLeft size={24} /> : <Menu size={24} />} 
            </button>

            {/* Logo */}
            <div 
              className={`flex items-center gap-3 ml-4 transition-all duration-300 ease-in-out whitespace-nowrap
                ${isSidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5 pointer-events-none'}
              `}
            >
               <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold bg-gradient-to-tr from-blue-600 to-violet-600 shadow-lg shrink-0">
                 E
               </div>
               <span className="font-bold text-lg tracking-tight">EmpManager</span>
            </div>

             {/* Mobile Close Button */}
             <button 
               onClick={() => dispatch(setSidebar(false))} 
               className={`md:hidden absolute right-4 p-2 ${!isSidebarOpen && 'hidden'}`}
             >
                <X size={24} />
             </button>
        </div>

        {/* MENU ITEMS */}
        <div className="p-3 space-y-2 overflow-y-auto h-[calc(100%-5rem)] overflow-x-hidden">
          {menuItems.map((item, idx) => (
            <div key={idx} className="group relative">
              <button 
                onClick={() => isSidebarOpen ? setOpenMenu(openMenu === item.title ? null : item.title) : dispatch(toggleSidebar())}
                className={`w-full flex items-center p-3.5 rounded-xl transition-all duration-200 hover:bg-white/5 relative overflow-hidden
                  ${!isSidebarOpen ? 'justify-center' : 'justify-start'}
                  ${openMenu === item.title && isSidebarOpen ? 'bg-white/5' : ''}
                `}
              >
                {/* Active/Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-center gap-4 relative z-10">
                  <item.icon 
                    size={22} 
                    className="shrink-0 transition-colors duration-300" 
                    style={{ color: openMenu === item.title || (!isSidebarOpen && "var(--accent)") ? 'var(--accent)' : 'var(--text-secondary)' }}
                  />
                  
                  <span className={`font-medium whitespace-nowrap transition-all duration-300 ${!isSidebarOpen ? 'opacity-0 w-0 translate-x-10' : 'opacity-100 w-auto translate-x-0'}`}>
                    {item.title}
                  </span>
                </div>

                {isSidebarOpen && (
                  <ChevronRight 
                    size={16} 
                    className={`ml-auto transition-transform duration-300 ${openMenu === item.title ? 'rotate-90' : ''}`} 
                    style={{ color: 'var(--text-secondary)' }}
                  />
                )}
              </button>

              {/* Submenu */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isSidebarOpen && openMenu === item.title ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                <div className="ml-12 border-l-2 space-y-1 py-1" style={{ borderColor: 'var(--border)' }}>
                  {item.subItems.map((sub) => (
                    <button 
                        key={sub} 
                        onClick={() => alert(`Navigating to ${sub}... (Placeholder)`)}
                        className="block w-full text-left py-2 px-3 text-sm rounded-lg hover:text-[var(--accent)] transition-colors" 
                        style={{ color: 'var(--text-secondary)' }}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tooltip (Desktop Closed) */}
              {!isSidebarOpen && (
                <div 
                  className="absolute left-16 top-2 ml-4 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none shadow-xl md:block hidden animate-in slide-in-from-left-2"
                  style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                >
                  {item.title}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;