import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';

export default function Dashboard() {
  const { t } = useTranslation();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('expenses')
        .select(`
          id, amount, currency, category, description, date,
          profiles:created_by (id, full_name, avatar_url)
        `)
        .order('date', { ascending: false })
        .limit(20);

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{t('recent_expenses')}</h2>
      
      {expenses.length === 0 ? (
        <div className="text-center text-gray-400 mt-10">
          {t('no_expenses')}
        </div>
      ) : (
        <div className="space-y-3">
          {expenses.map((expense) => (
            <div key={expense.id} className="bg-gray-800 p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <div className="font-semibold text-white">
                  {t(`cat_${expense.category.toLowerCase()}`) !== `cat_${expense.category.toLowerCase()}` 
                    ? t(`cat_${expense.category.toLowerCase()}`) 
                    : expense.category}
                </div>
                <div className="text-sm text-gray-400">
                  {expense.description} • {expense.date}
                </div>
                <div className="text-xs text-blue-400 mt-1">
                  Added by: {expense.profiles?.full_name || 'User'}
                </div>
              </div>
              <div className="text-lg font-bold text-red-400">
                -{expense.amount.toLocaleString()} {expense.currency}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
