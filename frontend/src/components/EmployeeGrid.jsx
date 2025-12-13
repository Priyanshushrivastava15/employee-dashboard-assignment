import { Edit, Trash2, Flag, Eye } from 'lucide-react';

const EmployeeGrid = ({ employees, flaggedIds, onDelete, onEdit, onFlag, onExpand, userRole }) => {
  const headers = ['ID', 'Name', 'Role', 'Class', 'Age', 'Subjects', 'Attendance', 'Status', 'Performance', 'Actions'];

  const getPerformance = (attendance) => {
    if (attendance >= 90) return { label: 'Excellent', color: 'text-purple-500' };
    if (attendance >= 75) return { label: 'Good', color: 'text-green-500' };
    if (attendance >= 50) return { label: 'Average', color: 'text-yellow-500' };
    return { label: 'Poor', color: 'text-red-500' };
  };

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
          {employees.map((emp) => {
            const perf = getPerformance(emp.attendance);
            const isFlagged = flaggedIds.includes(emp.id);
            
            return (
              <tr key={emp.id} className="hover:bg-black/5 transition-colors">
                {/* DISPLAY REAL ID */}
                <td className="p-4 font-mono font-bold text-xs opacity-70">
                  #{emp.employeeId || '...'}
                </td>
                
                <td className="p-4 font-medium" style={{ color: 'var(--text-primary)' }}>{emp.name}</td>
                <td className="p-4">Employee</td> {/* <--- CHANGED FROM STUDENT */}
                <td className="p-4">{emp.class}</td>
                <td className="p-4">{emp.age}</td>
                
                <td className="p-4 max-w-[200px] truncate" title={emp.subjects ? emp.subjects.join(', ') : ''}>
                  {emp.subjects ? emp.subjects.join(', ') : ''}
                </td>
                
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
                
                <td className={`p-4 font-semibold ${perf.color}`}>
                  {perf.label}
                </td>

                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => onExpand(emp)} title="View Details" className="p-1.5 hover:text-[var(--accent)] transition-colors"><Eye size={16}/></button>
                    {userRole === 'admin' && (
                      <>
                        <button onClick={() => onEdit(emp)} title="Edit" className="p-1.5 hover:text-blue-500 transition-colors"><Edit size={16}/></button>
                        
                        <button 
                          onClick={() => onFlag(emp)} 
                          title={isFlagged ? "Unflag" : "Flag"} 
                          className={`p-1.5 rounded-full transition-colors ${isFlagged ? 'bg-orange-500 text-white shadow-md' : 'hover:text-orange-500'}`}
                        >
                          <Flag size={16} fill={isFlagged ? "currentColor" : "none"} />
                        </button>

                        <button onClick={() => onDelete(emp.id)} title="Delete" className="p-1.5 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeGrid;