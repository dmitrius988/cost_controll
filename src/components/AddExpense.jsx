import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function AddExpense() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('UZS');
  const [category, setCategory] = useState('Groceries');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const categories = ['Groceries', 'Transport', 'Rent', 'Entertainment', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not logged in');

      const { error } = await supabase.from('expenses').insert([{
        amount: parseFloat(amount),
        currency,
        category,
        description,
        date,
        created_by: user.id
      }]);

      if (error) throw error;
      
      // Success: redirect back to dashboard
      navigate('/');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{t('add_expense')}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-4 rounded-lg shadow">
        <div>
          <label className="block text-sm text-gray-400 mb-1">{t('amount')}</label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
              placeholder="0.00"
            />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-24 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            >
              <option value="UZS">UZS</option>
              <option value="USD">USD</option>
              <option value="RUB">RUB</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">{t('category')}</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {t(`cat_${cat.toLowerCase()}`) !== `cat_${cat.toLowerCase()}` 
                  ? t(`cat_${cat.toLowerCase()}`) 
                  : cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">{t('description')}</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            placeholder="Milk, bread, etc."
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">{t('date')}</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded transition disabled:opacity-50"
        >
          {loading ? t('adding') : t('save')}
        </button>
      </form>
    </div>
  );
}
