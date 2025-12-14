import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // <-- Import useSelector
import { setCredentials } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import { request, gql } from 'graphql-request';
import { config } from '../config'; 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 1. Check Redux state for existing token
  const token = useSelector((state) => state.auth.token);

  // --- NEW LOGIC: Redirect Guard ---
  useEffect(() => {
    if (token) {
      // If a token exists, the user is already logged in. Redirect to Dashboard.
      navigate('/', { replace: true });
    }
  }, [token, navigate]); 
  // ---------------------------------

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const mutation = gql`
        mutation Login($username: String!, $password: String!) {
          login(username: $username, password: $password) {
            token
            role
          }
        }
      `;

      const data = await request(config.API_URL, mutation, { 
        username: username.trim(), 
        password 
      });
      
      dispatch(setCredentials({ 
        user: { username: username.trim(), role: data.login.role }, 
        token: data.login.token 
      }));

      // No explicit navigate('/') is needed here, as the useEffect hook handles the redirect immediately after setCredentials updates the token state.
      
    } catch (err) {
      console.error(err);
      setError('Invalid Credentials. Please check username/password and ensure the server is active.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Prevent rendering the form if the token exists (while the redirect is executing)
  if (token) {
      return (
         <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
         </div>
      );
  }

  return (
    // Updated background to use theme variable
    <div className="min-h-screen flex items-center justify-center transition-colors duration-500" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Updated card styling to use theme variables */}
      <div 
        className="p-8 rounded-2xl shadow-xl w-full max-w-md border" 
        style={{ 
          backgroundColor: 'var(--bg-secondary)', 
          borderColor: 'var(--border)', 
          color: 'var(--text-primary)' 
        }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Welcome Back</h1>
          <p className="mt-2 opacity-70" style={{ color: 'var(--text-secondary)' }}>Sign in to manage your employees</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center border border-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3" size={20} style={{ color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                // Updated input styling to use theme variables
                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 outline-none transition-all"
                style={{ 
                    backgroundColor: 'var(--bg-primary)', 
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)',
                    '--tw-ring-color': 'var(--accent)' 
                }}
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3" size={20} style={{ color: 'var(--text-secondary)' }} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                // Updated input styling to use theme variables
                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 outline-none transition-all"
                style={{ 
                    backgroundColor: 'var(--bg-primary)', 
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)',
                    '--tw-ring-color': 'var(--accent)' 
                }}
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full font-bold py-3 rounded-xl transition-all shadow-lg shadow-[var(--accent)]/20 disabled:opacity-70 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'var(--accent)', color: 'white' }}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs opacity-50" style={{ color: 'var(--text-secondary)' }}>
          <p>Demo Admin: <strong>admin</strong> / <strong>123</strong></p>
        </div>
      </div>
    </div>
  );
};

export default Login;