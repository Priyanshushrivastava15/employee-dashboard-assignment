import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  useGetEmployeesQuery, 
  useGetEmployeeQuery, 
  useGetUniqueClassesQuery, 
  useDeleteEmployeeMutation, 
  useAddEmployeeMutation, 
  useUpdateEmployeeMutation 
} from '../redux/api/employeeApi';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import EmployeeGrid from '../components/EmployeeGrid';
import EmployeeTile from '../components/EmployeeTile';
import Modal from '../components/Modal';
import { Plus, X, Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { setSidebar, setPage, toggleFlag } from '../redux/slices/uiSlice';

// --- Single Employee Detail View (Popup) ---
const ExpandedView = ({ employeeId, onClose }) => {
  const { data, isLoading, error } = useGetEmployeeQuery(employeeId);
  const emp = data?.getEmployee;

  if (!employeeId) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-2xl rounded-2xl p-8 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-black/10 rounded-full transition-colors" style={{ color: 'var(--text-secondary)' }}>
          <X size={24} />
        </button>
        
        {isLoading ? (
          <div className="flex flex-col items-center py-10 gap-4">
            <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
            <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-10">Failed to load details.</div>
        ) : (
          <>
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[var(--accent)] to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                {emp.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-3">
                   <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{emp.name}</h2>
                   <span className="px-2 py-1 rounded text-xs font-mono bg-black/20 text-[var(--text-secondary)]">#{emp.employeeId || 'N/A'}</span>
                </div>
                <p className="text-lg opacity-80" style={{ color: 'var(--text-secondary)' }}>Class: {emp.class}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 rounded-xl border border-[var(--border)] bg-black/5">
                <p className="text-sm opacity-60" style={{ color: 'var(--text-secondary)' }}>Age</p>
                <p className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>{emp.age}</p>
              </div>
              <div className="p-4 rounded-xl border border-[var(--border)] bg-black/5">
                <p className="text-sm opacity-60" style={{ color: 'var(--text-secondary)' }}>Attendance</p>
                <p className={`text-xl font-semibold ${emp.attendance >= 75 ? 'text-green-500' : 'text-red-500'}`}>{emp.attendance}%</p>
              </div>
            </div>
            
            <div className="mt-6">
               <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Subjects</h3>
               <div className="flex flex-wrap gap-2">
                 {emp.subjects.map((s, i) => (
                   <span key={i} className="px-3 py-1 rounded-full text-sm border border-[var(--border)]" style={{ color: 'var(--text-secondary)' }}>
                     {s}
                   </span>
                 ))}
               </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// --- Main Dashboard Component ---
function Dashboard() {
  const { viewMode, theme, isSidebarOpen, page, flaggedIds } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const LIMIT = 10;
  const currentPage = Number(page) || 1;
  const startIndex = (currentPage - 1) * LIMIT;
  
  // Local State for Search/Sort/Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // 1. Fetch Employees (With Search & Filter)
  const { data, isLoading, error } = useGetEmployeesQuery({ 
    page: currentPage, 
    limit: LIMIT,
    sortBy, 
    filter: { 
      searchName: searchTerm || undefined,
      class: filterClass || undefined 
    }
  });

  // 2. Fetch Unique Classes for the Dropdown
  const { data: classData } = useGetUniqueClassesQuery();
  const availableClasses = classData?.getUniqueClasses || [];

  const [deleteEmployee] = useDeleteEmployeeMutation();
  const [addEmployee] = useAddEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeMutation();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedEmpId, setExpandedEmpId] = useState(null);
  const [editingId, setEditingId] = useState(null); 
  const [formData, setFormData] = useState({ name: '', age: '', class: '', subjects: '', attendance: '' });

  const employees = data?.getEmployees?.employees || [];
  const totalPages = data?.getEmployees?.totalPages || 1;

  // Sync Theme
  useEffect(() => {
    const activeTheme = theme === 'holo' ? 'aurora' : theme;
    document.documentElement.setAttribute('data-theme', activeTheme);
  }, [theme]);

  // Handle Mobile Sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        dispatch(setSidebar(false));
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  const handleDelete = async (id) => {
    if(confirm("Delete record?")) await deleteEmployee(id);
  };

  const handleEdit = (emp) => {
    setEditingId(emp.id); 
    setFormData({ 
      name: emp.name, 
      age: emp.age, 
      class: emp.class, 
      subjects: emp.subjects ? emp.subjects.join(', ') : '', 
      attendance: emp.attendance 
    });
    setIsModalOpen(true); 
  };

  const handleFlag = (emp) => { 
    dispatch(toggleFlag(emp.id));
  };

  const handleOpenAdd = () => {
    setEditingId(null);   
    setFormData({ name: '', age: '', class: '', subjects: '', attendance: '' }); 
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const subjectsArray = formData.subjects.split(',').map(s => s.trim()).filter(s => s.length > 0);
      const payload = {
        name: formData.name,
        age: Number(formData.age),
        class: formData.class,
        subjects: subjectsArray.length ? subjectsArray : ["General"],
        attendance: Number(formData.attendance)
      };

      if (editingId) await updateEmployee({ id: editingId, ...payload }).unwrap();
      else await addEmployee(payload).unwrap();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Operation failed. Check inputs.");
    }
  };

  // --- Loading State ---
  if (isLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <div className="w-10 h-10 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
      <p>Loading System...</p>
    </div>
  );

  // --- Error State (Detailed) ---
  if (error) {
    console.error("Dashboard Error:", error);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <AlertCircle size={48} className="text-red-500 mb-2" />
        <h2 className="text-2xl font-bold">Connection Error</h2>
        <p className="max-w-md opacity-70">
          We couldn't connect to the server. Please ensure your backend is running.
        </p>
        <div className="bg-black/10 p-4 rounded-lg text-xs font-mono text-left w-full max-w-lg overflow-auto border border-red-500/20">
          {JSON.stringify(error, null, 2)}
        </div>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-[var(--accent)] text-white rounded-lg mt-4">
          Retry
        </button>
      </div>
    );
  }

  const isEmpty = !employees.length;

  return (
    <div className="min-h-screen transition-colors duration-500" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Sidebar />
      
      <div className={`transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col ${isSidebarOpen ? 'md:ml-72' : 'md:ml-20'}`}>
        <Navbar />
        {expandedEmpId && <ExpandedView employeeId={expandedEmpId} onClose={() => setExpandedEmpId(null)} />}

        <main className="px-4 md:px-6 pb-20">
          
          {/* Header & Actions */}
          <div className="flex flex-col gap-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Overview</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Page {currentPage} of {totalPages}</p>
              </div>

              {user?.role === 'admin' && (
                <button 
                  onClick={handleOpenAdd}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white shadow-lg shadow-[var(--accent)]/20 transition-all hover:scale-105 active:scale-95 shrink-0"
                  style={{ background: 'linear-gradient(135deg, var(--accent), #6366f1)' }}
                >
                  <Plus size={20} />
                  <span>Add Record</span>
                </button>
              )}
            </div>

            {/* --- FILTERS BAR --- */}
            <div 
              className="flex flex-wrap items-center gap-4 p-4 rounded-xl border backdrop-blur-sm"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
            >
               {/* Search Input */}
               <div className="relative group flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-[var(--accent)]" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search name, subject..." 
                    className="w-full pl-10 pr-4 py-2 rounded-lg border outline-none focus:ring-2 transition-all"
                    style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)', '--tw-ring-color': 'var(--accent)' }}
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); dispatch(setPage(1)); }}
                  />
               </div>
               
               <div className="h-8 w-px bg-[var(--border)] hidden sm:block"></div>

               {/* Class Filter */}
               <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                 <Filter size={16} />
                 <span>Filter:</span>
               </div>
               
               <select 
                 className="p-2 rounded-lg border text-sm outline-none focus:ring-2 cursor-pointer min-w-[140px]"
                 style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                 value={filterClass}
                 onChange={(e) => { setFilterClass(e.target.value); dispatch(setPage(1)); }}
               >
                 <option value="">All Classes</option>
                 {availableClasses.map((cls) => (
                   <option key={cls} value={cls}>{cls}</option>
                 ))}
               </select>

               {/* Sort Dropdown */}
               <div className="flex items-center gap-2 text-sm font-medium ml-2" style={{ color: 'var(--text-secondary)' }}>
                 <ArrowUpDown size={16} />
                 <span>Sort:</span>
               </div>

               <select 
                 className="p-2 rounded-lg border text-sm outline-none focus:ring-2 cursor-pointer min-w-[140px]"
                 style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                 value={sortBy}
                 onChange={(e) => setSortBy(e.target.value)}
               >
                 <option value="name">Name (A-Z)</option>
                 <option value="age">Age (Youngest)</option>
                 <option value="attendance">Attendance (Low)</option>
                 <option value="-attendance">Attendance (High)</option>
               </select>
            </div>
          </div>

          {/* --- CONTENT AREA --- */}
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-dashed" style={{ borderColor: 'var(--border)' }}>
              <p className="opacity-50" style={{ color: 'var(--text-secondary)' }}>No records found matching your criteria.</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="overflow-x-auto pb-4">
               <EmployeeGrid 
                 employees={employees} 
                 flaggedIds={flaggedIds} 
                 startIndex={startIndex}
                 onDelete={handleDelete} 
                 onEdit={handleEdit} 
                 onFlag={handleFlag} 
                 onExpand={(emp) => setExpandedEmpId(emp.id)} 
                 userRole={user?.role} 
               />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {employees.map(emp => (
                <EmployeeTile 
                  key={emp.id} 
                  emp={emp} 
                  isFlagged={flaggedIds.includes(emp.id)} 
                  onDelete={handleDelete} 
                  onEdit={handleEdit} 
                  onFlag={handleFlag} 
                  onExpand={(emp) => setExpandedEmpId(emp.id)} 
                  userRole={user?.role} 
                />
              ))}
            </div>
          )}

          {/* --- PAGINATION --- */}
          {!isEmpty && (
            <div className="flex justify-center items-center gap-6 mt-12">
              <button onClick={() => dispatch(setPage(Math.max(1, currentPage - 1)))} disabled={currentPage === 1} className="p-3 rounded-full hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all" style={{ color: 'var(--text-primary)' }}><ChevronLeft size={24} /></button>
              <span className="font-mono font-bold px-4 py-2 rounded-lg bg-black/5" style={{ color: 'var(--text-primary)' }}>{currentPage} / {totalPages}</span>
              <button onClick={() => dispatch(setPage(Math.min(totalPages, currentPage + 1)))} disabled={currentPage === totalPages} className="p-3 rounded-full hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all" style={{ color: 'var(--text-primary)' }}><ChevronRight size={24} /></button>
            </div>
          )}
        </main>
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Update Record" : "New Record"}>
        <form onSubmit={handleSubmit} className="space-y-5">
           <input required placeholder="Full Name" className="w-full p-3 rounded-xl bg-black/5 border outline-none focus:ring-2" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', '--tw-ring-color': 'var(--accent)' }} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
           <div className="grid grid-cols-2 gap-4">
              <input type="number" required placeholder="Age" className="w-full p-3 rounded-xl bg-black/5 border outline-none focus:ring-2" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }} value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
              <input required placeholder="Class" className="w-full p-3 rounded-xl bg-black/5 border outline-none focus:ring-2" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }} value={formData.class} onChange={e => setFormData({...formData, class: e.target.value})} />
           </div>
           <input required placeholder="Subjects (e.g. Math, Science)" className="w-full p-3 rounded-xl bg-black/5 border outline-none focus:ring-2" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }} value={formData.subjects} onChange={e => setFormData({...formData, subjects: e.target.value})} />
           <input type="number" required placeholder="Attendance %" className="w-full p-3 rounded-xl bg-black/5 border outline-none focus:ring-2" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }} value={formData.attendance} onChange={e => setFormData({...formData, attendance: e.target.value})} />
           <button type="submit" className="w-full py-4 rounded-xl font-bold text-white shadow-lg" style={{ background: 'var(--accent)' }}>Confirm Action</button>
        </form>
      </Modal>
    </div>
  );
}

export default Dashboard;