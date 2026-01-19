import React, { useState } from 'react';
import { View } from '../App';
import { useAppContext } from '../contexts/AppContext';

interface ApplicantAuthProps {
  setView: (view: View) => void;
}

const ApplicantAuth: React.FC<ApplicantAuthProps> = ({ setView }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { applicantLogin, applicantSignup } = useAppContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLoginView) {
        const success = await applicantLogin(email, password);
        if (success) {
          setView('user-dashboard');
        } else {
          setError('Invalid email or password.');
        }
      } else {
        const result = await applicantSignup(email, password);
        if (result === 'exists') {
          setError('An account with this email already exists.');
        } else if (result) {
          setView('user-dashboard');
        } else {
          setError('An error occurred during signup. Please try again.');
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-neutral-900 p-8 rounded-lg shadow-lg border border-neutral-800">
        <h2 className="text-2xl font-bold text-center text-yellow-400 mb-6">
          {isLoginView ? 'Applicant Login' : 'Create Account'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-200">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full bg-neutral-800 border border-neutral-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              required
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
              {loading ? (isLoginView ? 'Logging in...' : 'Signing up...') : (isLoginView ? 'Login' : 'Sign Up')}
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-neutral-300 mt-6">
          {isLoginView ? "Don't have an account?" : "Already have an account?"}
          <button onClick={toggleView} className="font-medium text-yellow-400 hover:text-yellow-300 ml-1">
            {isLoginView ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default ApplicantAuth;