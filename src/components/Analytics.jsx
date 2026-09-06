import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Analytics() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  
  useEffect(() => {
    fetchCurrentMonthExpenses();
  }, []);

  const fetchCurrentMonthExpenses = async () => {
    try {
      setLoading(true);
      // Get first day of current month
      const date = new Date();
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('expenses')
        .select(`
          amount, currency, category,
          profiles:created_by (full_name)
        `)
        .gte('date', firstDay);

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error('Error fetching analytics:', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center text-gray-400">Loading...</div>;
  }

  // Aggregate Data by Category
  const categoryMap = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
    return acc;
  }, {});

  const categoryData = Object.keys(categoryMap).map((key) => ({
    name: t(`cat_${key.toLowerCase()}`) !== `cat_${key.toLowerCase()}` ? t(`cat_${key.toLowerCase()}`) : key,
    value: categoryMap[key]
  })).sort((a, b) => b.value - a.value);

  // Aggregate Data by Person
  const personMap = expenses.reduce((acc, curr) => {
    const personName = curr.profiles?.full_name || 'User';
    acc[personName] = (acc[personName] || 0) + Number(curr.amount);
    return acc;
  }, {});

  const personData = Object.keys(personMap).map((key) => ({
    name: key,
    value: personMap[key]
  }));

  // Calculate Totals grouped by currency
  const totalsByCurrency = expenses.reduce((acc, curr) => {
    acc[curr.currency] = (acc[curr.currency] || 0) + Number(curr.amount);
    return acc;
  }, {});

  return (
    <div className="p-4 pb-20 space-y-6">
      <div className="bg-gray-800 p-4 rounded-lg shadow text-center">
        <h2 className="text-gray-400 text-sm font-semibold uppercase">{t('total_spent')} ({t('this_month')})</h2>
        <div className="text-3xl font-bold text-white mt-1 flex flex-col items-center gap-1">
          {Object.keys(totalsByCurrency).length > 0 ? (
            Object.entries(totalsByCurrency).map(([currency, sum]) => (
              <span key={currency}>{sum.toLocaleString()} {currency}</span>
            ))
          ) : (
            <span>0 UZS</span>
          )}
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4 text-center">{t('spending_by_category')}</h3>
        {categoryData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => value.toLocaleString()} 
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10">{t('no_expenses')}</div>
        )}
      </div>

      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4 text-center">{t('spending_by_person')}</h3>
        {personData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={personData}>
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(0)}k` : val} />
                <Tooltip 
                  cursor={{ fill: '#374151' }}
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                  formatter={(value) => value.toLocaleString()}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10">{t('no_expenses')}</div>
        )}
      </div>
    </div>
  );
}
