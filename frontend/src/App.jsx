import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
// IMPORT NEW STATUS CHECK PAGE
import StatusCheck from './pages/StatusCheck'; 

const PrivateRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  // If no token, redirect to the StatusCheck route (which then goes to login)
  return token ? children : <Navigate to="/status" replace />;
};

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        {/* NEW ROUTE: This runs the health check first */}
        <Route path="/status" element={<StatusCheck />} />
        
        {/* Login is the target page after the server wakes up */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Dashboard */}
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />

        {/* Redirect any bad URLs to the status check */}
        <Route path="*" element={<Navigate to="/status" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;