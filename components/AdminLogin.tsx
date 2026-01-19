
import React, { useState } from 'react';
import { View } from '../App';
import { useAppContext } from '../contexts/AppContext';

interface AdminLoginProps {
  setView: (view: View) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ setView }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin, adminUsername } = useAppContext();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const success = await adminLogin(password);
      if (success) {
        setView('admin-dashboard');
      } else {
        setError('Invalid password. Please try again.');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-neutral-900 p-8 rounded-lg shadow-lg border border-neutral-800">
        <h2 className="text-2xl font-bold text-center text-yellow-400 mb-6">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-neutral-200">Username</label>
            <input
              type="text"
              id="username"
              value={adminUsername}
              readOnly
              className="mt-1 block w-full bg-neutral-800 border border-neutral-700 rounded-md shadow-sm py-2 px-3 text-neutral-300 sm:text-sm cursor-not-allowed"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-200">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full bg-neutral-800 border border-neutral-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              required
            />
          </div>
          {error && <p className="text-yellow-500 text-sm">{error}</p>}
          <div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-yellow-400 text-black font-bold py-2 px-4 rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;