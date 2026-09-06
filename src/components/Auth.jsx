import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useTranslation } from 'react-i18next';

export default function Auth() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin
      }
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setMessage('Magic link sent! Check your email to sign in.');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-2 text-center">
          Cost Control
        </h1>
        <p className="text-gray-400 text-sm mb-6 text-center">
          Sign in via magic link with your email below
        </p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>
        
        {message && (
          <div className="mt-6 p-3 bg-green-900/50 border border-green-800 rounded text-center text-sm text-green-400">
            {message}
          </div>
        )}
        
        {errorMsg && (
          <div className="mt-6 p-3 bg-red-900/50 border border-red-800 rounded text-center text-sm text-red-400">
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
}
