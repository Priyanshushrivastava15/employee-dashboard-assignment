import { Edit, Trash2, Flag, Eye } from 'lucide-react';

const EmployeeGrid = ({ employees, onDelete, onEdit, onFlag, onExpand, userRole }) => {
  // 10-Column Header Definition
  const headers = ['ID', 'Name', 'Role', 'Department', 'Age', 'Subjects', 'Attendance', 'Status', 'Performance', 'Actions'];

  return (
    <div className="glass-panel rounded-xl overflow-hidden overflow-x-auto">
      <table className="w-full text-left text-sm" style={{ color: 'var(--text-secondary)' }}>
        <thead className="border-b bg-black/5" style={{ borderColor: 'var(--border)' }}>
          <tr>
            {headers.map(h => (
              <th key={h} className="p-4 font-semibold whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {employees.map((emp, index) => (
            <tr key={emp.id} className="hover:bg-black/5 transition-colors">
              <td className="p-4 font-mono text-xs opacity-70">#{emp.id.slice(-6)}</td>
              <td className="p-4 font-medium" style={{ color: 'var(--text-primary)' }}>{emp.name}</td>
              <td className="p-4">Student</td>
              <td className="p-4">{emp.class}</td>
              <td className="p-4">{emp.age}</td>
              <td className="p-4 max-w-[200px] truncate">{emp.subjects.join(', ')}</td>
              <td className="p-4">
                <div className={`font-bold ${emp.attendance >= 75 ? 'text-green-500' : 'text-red-500'}`}>
                  {emp.attendance}%
                </div>
              </td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded text-xs ${emp.attendance >= 75 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {emp.attendance >= 75 ? 'Active' : 'At Risk'}
                </span>
              </td>
              <td className="p-4">Good</td>
              <td className="p-4">
                <div className="flex gap-2">
                  <button onClick={() => onExpand(emp)} title="View Details" className="p-1.5 hover:text-[var(--accent)] transition-colors"><Eye size={16}/></button>
                  {/* RBAC */}
                  {userRole === 'admin' && (
                    <>
                      <button onClick={() => onEdit(emp)} title="Edit" className="p-1.5 hover:text-blue-500 transition-colors"><Edit size={16}/></button>
                      <button onClick={() => onFlag(emp)} title="Flag" className="p-1.5 hover:text-orange-500 transition-colors"><Flag size={16}/></button>
                      <button onClick={() => onDelete(emp.id)} title="Delete" className="p-1.5 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                    </>
                  )}
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