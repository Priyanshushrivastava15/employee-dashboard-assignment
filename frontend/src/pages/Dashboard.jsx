import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetEmployeesQuery, useDeleteEmployeeMutation, useAddEmployeeMutation, useUpdateEmployeeMutation } from '../redux/api/employeeApi';
import Navbar from '../components/Navbar';
import EmployeeGrid from '../components/EmployeeGrid';
import EmployeeTile from '../components/EmployeeTile';
import Modal from '../components/Modal';
import { User, Plus } from 'lucide-react';

function Dashboard() {
  const { data, isLoading, error } = useGetEmployeesQuery({ page: 1, limit: 20 });
  const [deleteEmployee] = useDeleteEmployeeMutation();
  const [addEmployee] = useAddEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeMutation();
  
  const viewMode = useSelector((state) => state.ui.viewMode);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); 
  
  const [formData, setFormData] = useState({
    name: '', age: '', class: '', attendance: ''
  });

  // --- Handlers ---

  const handleDelete = async (id) => {
    if(confirm("Are you sure you want to delete this employee?")) {
      await deleteEmployee(id);
    }
  };

  const handleEdit = (emp) => {
    setEditingId(emp.id); 
    setFormData({         
      name: emp.name, 
      age: emp.age, 
      class: emp.class, 
      attendance: emp.attendance 
    });
    setIsModalOpen(true); 
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
      setFormData({ name: '', age: '', class: '', attendance: '' });
      setEditingId(null);
    } catch (err) {
      console.error("Failed to save employee:", err);
      alert("Failed to save. Please try again.");
    }
  };

  // --- LOADING STATE (SKELETON) ---
  if (isLoading) return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-32 bg-slate-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="h-48 bg-white rounded-xl border border-slate-100 shadow-sm animate-pulse p-6">
              <div className="flex justify-between mb-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full"></div>
                <div className="w-8 h-8 bg-slate-100 rounded"></div>
              </div>
              <div className="h-4 w-3/4 bg-slate-100 rounded mb-2"></div>
              <div className="h-3 w-1/2 bg-slate-100 rounded mb-4"></div>
              <div className="h-2 w-full bg-slate-100 rounded mt-4"></div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );

  if (error) return <div className="h-screen flex items-center justify-center text-red-500">Error connecting to backend.</div>;

  // --- EMPTY STATE CHECK ---
  const isEmpty = !data?.getEmployees?.employees?.length;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
            <p className="text-slate-500">Manage your team members</p>
          </div>
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/20"
          >
            <Plus size={18} />
            <span>Add Employee</span>
          </button>
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-dashed border-slate-300 shadow-sm">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
              <User size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No employees found</h3>
            <p className="text-slate-500 mt-2 mb-6 max-w-sm">
              Your team is currently empty. Start by adding your first employee to the system.
            </p>
            <button 
              onClick={handleOpenAdd}
              className="text-blue-600 font-medium hover:underline flex items-center gap-1"
            >
              Add Employee Now &rarr;
            </button>
          </div>
        ) : (
          viewMode === 'grid' ? (
            <EmployeeGrid 
              employees={data?.getEmployees?.employees || []} 
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data?.getEmployees?.employees?.map(emp => (
                <EmployeeTile 
                  key={emp.id} 
                  emp={emp} 
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          )
        )}
      </main>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? "Edit Employee" : "Add New Employee"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input 
              required type="text" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
              <input 
                required type="number" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Class/Grade</label>
              <input 
                required type="text" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.class} onChange={(e) => setFormData({...formData, class: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Attendance (%)</label>
            <input 
              required type="number" max="100" min="0" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.attendance} onChange={(e) => setFormData({...formData, attendance: e.target.value})}
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all mt-4"
          >
            {editingId ? "Update Employee" : "Save Employee"}
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default Dashboard;