import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetHealthQuery } from '../redux/api/employeeApi';
import { Loader2, AlertCircle } from 'lucide-react'; 

const StatusCheck = () => {
  const navigate = useNavigate();
  
  // Explicitly fetch the health status with polling in case the server is slow to start
  const { isSuccess, isError, isFetching, isLoading, error } = useGetHealthQuery(undefined, {
    pollingInterval: 3000, // Check every 3 seconds
    refetchOnMountOrArgChange: true,
  });
  
  const isChecking = isLoading || isFetching;

  // Navigate on success
  useEffect(() => {
    if (isSuccess) {
      // Server is awake and responsive. Navigate to the login page.
      navigate('/login', { replace: true });
    }
  }, [isSuccess, navigate]);

  // Fallback for permanent error
  if (isError) {
    console.error("Backend health check failed:", error);
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            <AlertCircle size={48} className="text-red-500" />
            <h2 className="text-xl font-bold">Connection Error</h2>
            <p className="max-w-sm opacity-70" style={{ color: 'var(--text-secondary)' }}>
                The backend service is unreachable. Please ensure the server is running and accessible at the configured URL.
            </p>
            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-[var(--accent)] text-white rounded-lg mt-4">
                Retry Connection
            </button>
        </div>
    );
  }

  // Display the dedicated loading/wake-up screen
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Loader2 size={32} className="text-[var(--accent)] animate-spin" />
      <h2 className="text-xl font-bold">Waking up the backend service...</h2>
      <p style={{ color: 'var(--text-secondary)' }} className="opacity-70">This might take a few moments if the server has been idle.</p>
    </div>
  );
};

export default StatusCheck;