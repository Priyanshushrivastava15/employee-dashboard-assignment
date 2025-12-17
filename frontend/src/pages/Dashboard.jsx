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

const ExpandedView = ({ employeeId, onClose }) => {
  const { data, isLoading, error } = useGetEmployeeQuery(employeeId);
  const emp = data?.getEmployee;

  if (!employeeId) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in">
      <div className="glass-panel w-full max-w-2xl rounded-2xl p-8 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-black/10 rounded-full transition-colors" style={{ color: 'var(--text-secondary)' }}>
          <X size={24} />
        </button>
        
        {isLoading ? (
          <div className="flex flex-col items-center py-10 gap-4">
            <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div> 
            <p style={{ color: 'var(--text-secondary)' }}>Loading employee details...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-10">Error loading details.</div>
        ) : (
          <>
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[var(--accent)] to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                {emp.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-3">
                   <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{emp.name}</h2>
                   <span className="px-2 py-1 rounded text-xs font-mono bg-black/20 text-[var(--text-secondary)]">#{emp.employeeId}</span>
                </div>
                <p className="text-lg opacity-80" style={{ color: 'var(--text-secondary)' }}>Class {emp.class}</p>
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

export default function Dashboard() {
  const dispatch = useDispatch();
  const { viewMode, theme, isSidebarOpen, page, flaggedIds } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);

  const LIMIT = 10;
  const currentPage = Number(page) || 1;
  const startIndex = (currentPage - 1) * LIMIT;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const { data, isLoading, error } = useGetEmployeesQuery({ 
    page: currentPage, 
    limit: LIMIT,
    sortBy, 
    filter: { 
      searchName: searchTerm || undefined,
      class: filterClass || undefined 
    }
  });

  const { data: classData } = useGetUniqueClassesQuery();
  const [deleteEmployee] = useDeleteEmployeeMutation();
  const [addEmployee] = useAddEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeMutation();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedEmpId, setExpandedEmpId] = useState(null);
  const [editingId, setEditingId] = useState(null); 
  const [formData, setFormData] = useState({ name: '', age: '', class: '', subjects: '', attendance: '' });

  const employees = data?.getEmployees?.employees || [];
  const totalPages = data?.getEmployees?.totalPages || 1;

  useEffect(() => {
    const activeTheme = theme === 'holo' ? 'aurora' : theme;
    document.documentElement.setAttribute('data-theme', activeTheme);
  }, [theme]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) dispatch(setSidebar(false));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const subjectsArray = formData.subjects.split(',').map(s => s.trim()).filter(Boolean);
      const payload = { ...formData, age: Number(formData.age), attendance: Number(formData.attendance), subjects: subjectsArray };

      if (editingId) await updateEmployee({ id: editingId, ...payload }).unwrap();
      else await addEmployee(payload).unwrap();
      setIsModalOpen(false);
    } catch (err) {
      alert("Failed to save record.");
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <div className="w-10 h-10 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p>Loading records...</p>
    </div>
  );

  return (
    <div className="min-h-screen transition-all" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Sidebar />
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'md:ml-72' : 'md:ml-20'}`}>
        <Navbar />
        {expandedEmpId && <ExpandedView employeeId={expandedEmpId} onClose={() => setExpandedEmpId(null)} />}

        <main className="p-4 md:p-6 pb-20">
          <div className="flex flex-col gap-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Dashboard</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Page {currentPage} of {totalPages}</p>
              </div>

              {user?.role === 'admin' && (
                <button 
                  onClick={() => { setEditingId(null); setFormData({ name: '', age: '', class: '', subjects: '', attendance: '' }); setIsModalOpen(true); }}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white shadow-lg"
                  style={{ background: 'linear-gradient(135deg, var(--accent), #6366f1)' }}
                >
                  <Plus size={20} /> Add Employee
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl border backdrop-blur-sm" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
               <div className="relative w-full sm:flex-1">
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input 
                    type="text" placeholder="Search..." 
                    className="w-full pl-10 pr-4 py-2 rounded-lg border bg-transparent outline-none"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); dispatch(setPage(1)); }}
                  />
               </div>
               
               <select 
                 className="p-2 rounded-lg border text-sm w-full sm:w-auto"
                 style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                 value={filterClass}
                 onChange={(e) => { setFilterClass(e.target.value); dispatch(setPage(1)); }}
               >
                 <option value="">All Classes</option>
                 {classData?.getUniqueClasses?.map(cls => <option key={cls} value={cls}>{cls}</option>)}
               </select>

               <select 
                 className="p-2 rounded-lg border text-sm w-full sm:w-auto"
                 style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                 value={sortBy}
                 onChange={(e) => setSortBy(e.target.value)}
               >
                 <option value="name">Name (A-Z)</option>
                 <option value="attendance">Attendance (Low)</option>
                 <option value="-attendance">Attendance (High)</option>
               </select>
            </div>
          </div>

          {viewMode === 'grid' ? (
             <div className="overflow-x-auto"><EmployeeGrid employees={employees} userRole={user?.role} onExpand={setExpandedEmpId} /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {employees.map(emp => <EmployeeTile key={emp.id} emp={emp} userRole={user?.role} onExpand={setExpandedEmpId} />)}
            </div>
          )}
        </main>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit" : "New"}>
        <form onSubmit={handleSubmit} className="space-y-4">
           <input required placeholder="Name" className="w-full p-3 rounded-lg border bg-transparent" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
           <div className="grid grid-cols-2 gap-2">
              <input type="number" required placeholder="Age" className="w-full p-3 rounded-lg border bg-transparent" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
              <input required placeholder="Class" className="w-full p-3 rounded-lg border bg-transparent" value={formData.class} onChange={e => setFormData({...formData, class: e.target.value})} />
           </div>
           <input placeholder="Subjects (comma separated)" className="w-full p-3 rounded-lg border bg-transparent" value={formData.subjects} onChange={e => setFormData({...formData, subjects: e.target.value})} />
           <input type="number" required placeholder="Attendance %" className="w-full p-3 rounded-lg border bg-transparent" value={formData.attendance} onChange={e => setFormData({...formData, attendance: e.target.value})} />
           <button type="submit" className="w-full py-3 rounded-lg font-bold text-white bg-[var(--accent)]">Save</button>
        </form>
      </Modal>
    </div>
  );
}