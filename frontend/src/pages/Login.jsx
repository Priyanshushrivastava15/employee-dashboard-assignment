import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import { request, gql } from 'graphql-request';
import { config } from '../config'; 

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) navigate('/', { replace: true });
  }, [token, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const loginMutation = gql`
        mutation Login($username: String!, $password: String!) {
          login(username: $username, password: $password) {
            token
            role
          }
        }
      `;

      const response = await request(config.API_URL, loginMutation, { username: username.trim(), password });
      dispatch(setCredentials({ 
        user: { username: username.trim(), role: response.login.role }, 
        token: response.login.token 
      }));
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  if (token) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="p-8 rounded-2xl shadow-xl w-full max-w-md border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Login</h1>
          <p className="mt-2 opacity-70" style={{ color: 'var(--text-secondary)' }}>Access your dashboard</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="text" placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-xl bg-transparent outline-none focus:ring-2"
              style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', '--tw-ring-color': 'var(--accent)' }}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-xl bg-transparent outline-none focus:ring-2"
              style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', '--tw-ring-color': 'var(--accent)' }}
            />
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full font-bold py-3 rounded-xl bg-[var(--accent)] text-white hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs opacity-50" style={{ color: 'var(--text-secondary)' }}>
          <p>Demo: admin / 123</p>
        </div>
      </div>
    </div>
  );
}