import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetHealthQuery } from './redux/api/employeeApi';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { Loader2 } from 'lucide-react';

const PrivateRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  // --- The Wake Up Call ---
  // This runs as soon as the app loads anywhere
  const { isLoading } = useGetHealthQuery(); 

  // If server is sleeping, this "isLoading" will stay true for 30-60s
  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <h2 className="text-xl font-bold text-slate-800">Waking up the server...</h2>
        <p className="text-slate-500 text-center max-w-md">
          Since we are on a free tier, the backend goes to sleep after inactivity. 
          Please wait about 30 seconds for the first load!
        </p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;