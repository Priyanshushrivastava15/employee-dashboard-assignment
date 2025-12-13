import { Edit, Trash2, Flag, Maximize2 } from 'lucide-react';

const EmployeeTile = ({ emp, isFlagged, onDelete, onEdit, onFlag, onExpand, userRole }) => {
  return (
    <div className={`glass-panel glass-animate rounded-xl p-6 transition-all duration-300 group relative overflow-hidden ${isFlagged ? 'border-orange-500/50' : ''}`}>
      
      {/* Status Bar */}
      <div className={`absolute top-0 left-0 w-full h-1 ${emp.attendance >= 75 ? 'bg-green-500' : 'bg-red-500'}`} />

      <div className="flex justify-between items-start mb-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--accent)] to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
          {emp.name.charAt(0)}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
           <button onClick={() => onExpand(emp)} className="p-1.5 hover:bg-black/10 rounded-full" style={{ color: 'var(--text-secondary)' }}>
            <Maximize2 size={16} />
          </button>
          {userRole === 'admin' && (
            <>
              {/* FLAG BUTTON */}
              <button 
                onClick={() => onFlag(emp)} 
                className={`p-1.5 rounded-full transition-colors ${isFlagged ? 'bg-orange-500 text-white' : 'hover:bg-orange-50 rounded-full text-orange-400'}`}
              >
                <Flag size={16} fill={isFlagged ? "currentColor" : "none"} />
              </button>

              <button onClick={() => onEdit(emp)} className="p-1.5 hover:bg-blue-50 rounded-full text-blue-400">
                <Edit size={16} />
              </button>
              <button onClick={() => onDelete(emp.id)} className="p-1.5 hover:bg-red-50 rounded-full text-red-400">
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="pl-1">
        <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>{emp.name}</h3>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Class: {emp.class} • Age {emp.age}</p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
            <span>Attendance</span>
            <span className={emp.attendance < 75 ? "text-red-500" : "text-green-500"}>{emp.attendance}%</span>
          </div>
          <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden">
            <div 
              className={`h-full ${emp.attendance >= 75 ? 'bg-green-500' : 'bg-red-500'}`} 
              style={{ width: `${emp.attendance}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTile;