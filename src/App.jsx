import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home, PlusCircle, PieChart, Settings, LogOut } from 'lucide-react';
import { supabase } from './supabaseClient';
import Auth from './components/Auth';

function Dashboard() {
  const { t } = useTranslation();
  return <div className="p-4 text-center text-xl">{t('dashboard')} Content</div>;
}

function App() {
  const { t, i18n } = useTranslation();
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ru' : 'en';
    i18n.changeLanguage(newLang);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!session) {
    return <Auth />;
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-900 text-white pb-16">
        {/* Header */}
        <header className="p-4 flex justify-between items-center bg-gray-800 shadow-md">
          <h1 className="text-xl font-bold font-sans">{t('app_name')}</h1>
          <div className="flex gap-4 items-center">
            <button 
              onClick={toggleLanguage} 
              className="bg-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-600 transition"
            >
              {i18n.language.toUpperCase()}
            </button>
            <button onClick={handleLogout} className="text-gray-400 hover:text-white">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* Additional routes will go here as we build them */}
          </Routes>
        </main>

        {/* Bottom Navigation (Mobile Friendly) */}
        <nav className="fixed bottom-0 w-full bg-gray-800 border-t border-gray-700 flex justify-around p-3">
          <Link to="/" className="flex flex-col items-center text-gray-400 hover:text-white focus:text-white">
            <Home size={24} />
            <span className="text-xs mt-1">{t('dashboard')}</span>
          </Link>
          <button className="flex flex-col items-center text-green-400 hover:text-green-300">
            <PlusCircle size={28} />
            <span className="text-xs mt-1">{t('add_expense')}</span>
          </button>
          <button className="flex flex-col items-center text-gray-400 hover:text-white">
            <PieChart size={24} />
            <span className="text-xs mt-1">{t('analytics')}</span>
          </button>
          <button className="flex flex-col items-center text-gray-400 hover:text-white">
            <Settings size={24} />
            <span className="text-xs mt-1">{t('settings')}</span>
          </button>
        </nav>
      </div>
    </Router>
  );
}

export default App;
