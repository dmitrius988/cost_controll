import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';

export default function ProfileSetup({ session, onComplete }) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: name })
        .eq('id', session.user.id);
        
      if (error) throw error;
      onComplete(); // Triggers the parent App to refetch the profile
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-2 text-center">
          {t('profile_setup')}
        </h1>
        <p className="text-gray-400 text-sm mb-6 text-center">
          {t('whats_your_name')}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder={t('enter_name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500 text-lg text-center"
              required
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50"
          >
            {loading ? '...' : t('save_name')}
          </button>
        </form>
      </div>
    </div>
  );
}
