import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useGetEmployeesQuery, useDeleteEmployeeMutation, useAddEmployeeMutation, useUpdateEmployeeMutation } from '../redux/api/employeeApi';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import EmployeeGrid from '../components/EmployeeGrid';
import EmployeeTile from '../components/EmployeeTile';
import Modal from '../components/Modal';
import { Plus, X, User } from 'lucide-react';
import { setSidebar } from '../redux/slices/uiSlice'; // Import the new action

function Dashboard() {
  const { data, isLoading, error } = useGetEmployeesQuery({ page: 1, limit: 20 });
  const [deleteEmployee] = useDeleteEmployeeMutation();
  const [addEmployee] = useAddEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeMutation();
  
  const { viewMode, theme, isSidebarOpen } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedEmp, setExpandedEmp] = useState(null);
  const [editingId, setEditingId] = useState(null); 
  const [formData, setFormData] = useState({ name: '', age: '', class: '', attendance: '' });

  // 1. Theme Engine
  useEffect(() => {
    const activeTheme = theme === 'holo' ? 'aurora' : theme;
    document.documentElement.setAttribute('data-theme', activeTheme);
  }, [theme]);

  // 2. RESPONSIVE FIX: Auto-close sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        dispatch(setSidebar(false));
      }
    };
    
    // Check on mount
    handleResize();

    // Optional: Check on window resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  // --- Handlers ---
  const handleDelete = async (id) => {
    if(confirm("Are you sure you want to delete this record? This cannot be undone.")) {
      await deleteEmployee(id);
    }
  };

  const handleEdit = (emp) => {
    setEditingId(emp.id); 
    setFormData({ name: emp.name, age: emp.age, class: emp.class, attendance: emp.attendance });
    setIsModalOpen(true); 
  };

  const handleFlag = (emp) => {
    alert(`Flagged employee: ${emp.name}`);
  };

  const handleOpenAdd = () => {
    setEditingId(null);   
    setFormData({ name: '', age: '', class: '', attendance: '' }); 
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        age: Number(formData.age),
        class: formData.class,
        subjects: ["Math", "Science"],
        attendance: Number(formData.attendance)
      };

      if (editingId) {
        await updateEmployee({ id: editingId, ...payload }).unwrap();
      } else {
        await addEmployee(payload).unwrap();
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Operation failed.");
    }
  };

  // --- Components ---
  const ExpandedView = () => {
    if (!expandedEmp) return null;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="glass-panel w-full max-w-lg rounded-2xl p-6 relative shadow-2xl overflow-y-auto max-h-[90vh]">
          <button 
            onClick={() => setExpandedEmp(null)} 
            className="absolute top-4 right-4 p-2 hover:bg-black/10 rounded-full transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <X size={24} />
          </button>
          
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[var(--accent)] to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl mb-4">
              {expandedEmp.name.charAt(0)}
            </div>
            <h2 className="text-2xl font-bold text-center" style={{ color: 'var(--text-primary)' }}>{expandedEmp.name}</h2>
            <p className="text-lg opacity-80" style={{ color: 'var(--text-secondary)' }}>{expandedEmp.class} Student</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl border border-[var(--border)] bg-black/5 text-center">
              <p className="text-xs opacity-60 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Status</p>
              <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Active</p>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border)] bg-black/5 text-center">
              <p className="text-xs opacity-60 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Attendance</p>
              <p className={`text-lg font-bold ${expandedEmp.attendance >= 75 ? 'text-green-500' : 'text-red-500'}`}>
                {expandedEmp.attendance}%
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  };

  if (isLoading) return (
    <div className="min-h-screen transition-colors duration-500" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Sidebar />
      <div className={`transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col ${isSidebarOpen ? 'md:ml-72' : 'md:ml-20'}`}>
        <Navbar />
        <main className="px-4 md:px-6 pb-12 pt-8">
           <div className="h-10 w-32 bg-gray-200/20 rounded animate-pulse mb-8"></div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => <div key={i} className="h-48 rounded-xl border border-[var(--border)] animate-pulse p-6 bg-black/5"></div>)}
           </div>
        </main>
      </div>
    </div>
  );

  if (error) return <div className="h-screen flex items-center justify-center text-red-500">Connection Error.</div>;

  const isEmpty = !data?.getEmployees?.employees?.length;

  return (
    <div className="min-h-screen transition-colors duration-500" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Sidebar />
      
      {/* RESPONSIVE LAYOUT LOGIC:
         - Mobile: ml-0 (Sidebar is an overlay, doesn't push content)
         - Desktop Open: ml-72
         - Desktop Closed: ml-20
      */}
      <div 
        className={`transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col min-h-screen
          ${isSidebarOpen ? 'md:ml-72' : 'md:ml-20'}
        `}
      >
        <Navbar />
        {expandedEmp && <ExpandedView />}

        <main className="px-4 md:px-6 pb-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Overview</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user?.username}</p>
            </div>
            
            {user?.role === 'admin' && (
              <button 
                onClick={handleOpenAdd}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-lg shadow-[var(--accent)]/20 transition-all active:scale-95 w-full md:w-auto"
                style={{ background: 'linear-gradient(135deg, var(--accent), #6366f1)' }}
              >
                <Plus size={20} />
                <span>Add Employee</span>
              </button>
            )}
          </div>

          {!data?.getEmployees?.employees?.length ? (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-dashed" style={{ borderColor: 'var(--border)' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-black/5" style={{ color: 'var(--accent)' }}><User size={32} /></div>
              <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>No employees found</h3>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="overflow-x-auto pb-4"> {/* Responsive Table Container */}
               <EmployeeGrid employees={data?.getEmployees?.employees || []} onDelete={handleDelete} onEdit={handleEdit} onFlag={handleFlag} onExpand={setExpandedEmp} userRole={user?.role} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {data?.getEmployees?.employees?.map(emp => (
                <EmployeeTile key={emp.id} emp={emp} onDelete={handleDelete} onEdit={handleEdit} onFlag={handleFlag} onExpand={setExpandedEmp} userRole={user?.role} />
              ))}
            </div>
          )}
        </main>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Update Record" : "New Employee"}>
        <form onSubmit={handleSubmit} className="space-y-4">
           {/* Form inputs same as before... */}
           <input required placeholder="Full Name" className="w-full p-3 rounded-xl bg-black/5 border outline-none focus:ring-2" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', '--tw-ring-color': 'var(--accent)' }} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
           <div className="grid grid-cols-2 gap-4">
              <input type="number" required placeholder="Age" className="w-full p-3 rounded-xl bg-black/5 border outline-none focus:ring-2" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }} value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
              <input required placeholder="Class" className="w-full p-3 rounded-xl bg-black/5 border outline-none focus:ring-2" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }} value={formData.class} onChange={e => setFormData({...formData, class: e.target.value})} />
           </div>
           <input type="number" required placeholder="Attendance %" className="w-full p-3 rounded-xl bg-black/5 border outline-none focus:ring-2" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }} value={formData.attendance} onChange={e => setFormData({...formData, attendance: e.target.value})} />
           <button type="submit" className="w-full py-4 rounded-xl font-bold text-white shadow-lg" style={{ background: 'var(--accent)' }}>Confirm</button>
        </form>
      </Modal>
    </div>
  );
}

export default Dashboard;