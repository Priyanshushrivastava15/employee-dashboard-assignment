import { Edit, Trash2 } from 'lucide-react';

const EmployeeTile = ({ emp, onDelete, onEdit }) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white font-bold text-lg">
          {emp.name.charAt(0)}
        </div>
        <div className="flex gap-1">
          <button 
              onClick={() => onEdit(emp)}
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          >
            <Edit size={18} />
          </button>
          <button 
              onClick={() => onDelete(emp.id)}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      <h3 className="font-bold text-lg text-slate-900 mb-1">{emp.name}</h3>
      <p className="text-slate-500 text-sm mb-4">{emp.class} • Age {emp.age}</p>
      
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold text-slate-500">
          <span>Attendance</span>
          <span className={emp.attendance < 75 ? "text-red-500" : "text-green-600"}>{emp.attendance}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${emp.attendance >= 75 ? 'bg-green-500' : 'bg-red-500'}`} 
            style={{ width: `${emp.attendance}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeTile;