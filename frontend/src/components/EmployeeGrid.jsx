import { Edit, Trash2 } from 'lucide-react';

const EmployeeGrid = ({ employees, onDelete, onEdit }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="p-4 font-semibold">Name</th>
            <th className="p-4 font-semibold">Class</th>
            <th className="p-4 font-semibold">Age</th>
            <th className="p-4 font-semibold">Attendance</th>
            <th className="p-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {employees.map((emp) => (
            <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
              <td className="p-4 font-medium text-slate-900">{emp.name}</td>
              <td className="p-4">
                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-semibold">
                  {emp.class}
                </span>
              </td>
              <td className="p-4">{emp.age}</td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${emp.attendance >= 75 ? 'bg-green-500' : 'bg-red-500'}`} 
                      style={{ width: `${emp.attendance}%` }}
                    />
                  </div>
                  <span>{emp.attendance}%</span>
                </div>
              </td>
              <td className="p-4 text-right">
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => onEdit(emp)} 
                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-full transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => onDelete(emp.id)}
                    className="p-2 hover:bg-red-50 text-red-600 rounded-full transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeGrid;