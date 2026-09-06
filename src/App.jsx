import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, PieChart, Settings, LogOut } from 'lucide-react';
import { supabase } from './supabaseClient';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import AddExpense from './components/AddExpense';

function Analytics() {
  const { t } = useTranslation();
  return <div className="p-4 text-center text-xl">{t('analytics')} (Coming Soon)</div>;
}

function SettingsScreen() {
  const { t } = useTranslation();
  return <div className="p-4 text-center text-xl">{t('settings')} (Coming Soon)</div>;
}

function NavLinks() {
  const { t } = useTranslation();
  const location = useLocation();
  
  const getNavClass = (path) => {
    const base = "flex flex-col items-center ";
    if (path === '/add' && location.pathname === path) return base + "text-green-400";
    if (path === '/add') return base + "text-green-600 hover:text-green-400";
    
    return base + (location.pathname === path ? "text-blue-400" : "text-gray-400 hover:text-white");
  };

  return (
    <nav className="fixed bottom-0 w-full bg-gray-800 border-t border-gray-700 flex justify-around p-3 z-50">
      <Link to="/" className={getNavClass('/')}>
        <Home size={24} />
        <span className="text-xs mt-1">{t('dashboard')}</span>
      </Link>
      <Link to="/add" className={getNavClass('/add')}>
        <PlusCircle size={28} />
        <span className="text-xs mt-1">{t('add_expense')}</span>
      </Link>
      <Link to="/analytics" className={getNavClass('/analytics')}>
        <PieChart size={24} />
        <span className="text-xs mt-1">{t('analytics')}</span>
      </Link>
      <Link to="/settings" className={getNavClass('/settings')}>
        <Settings size={24} />
        <span className="text-xs mt-1">{t('settings')}</span>
      </Link>
    </nav>
  );
}

function App() {
  const { t, i18n } = useTranslation();
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    
    return () => subscription.unsubscribe();
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
        <header className="p-4 flex justify-between items-center bg-gray-800 shadow-md sticky top-0 z-50">
          <h1 className="text-xl font-bold font-sans">{t('app_name')}</h1>
          <div className="flex gap-4 items-center">
            <button 
              onClick={toggleLanguage} 
              className="bg-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-600 transition"
            >
              {i18n.language.toUpperCase()}
            </button>
            <button onClick={handleLogout} className="text-gray-400 hover:text-white" title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddExpense />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<SettingsScreen />} />
          </Routes>
        </main>

        <NavLinks />
      </div>
    </Router>
  );
}

export default App;
