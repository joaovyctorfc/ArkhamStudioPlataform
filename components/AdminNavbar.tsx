import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../services/supabaseClient';
import { AdminPage } from '../pages/admin/AdminDashboard';

interface AdminNavbarProps {
  setPage: (page: AdminPage) => void;
  currentPage: AdminPage;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ setPage, currentPage }) => {
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const linkClasses = (page: AdminPage) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      currentPage === page
        ? 'bg-indigo-700 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <header className="bg-gray-800 shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-white">Painel do Admin</h1>
            <div className="flex items-baseline space-x-4">
               <button onClick={() => setPage('orders')} className={linkClasses('orders')}>
                Pedidos
              </button>
              <button onClick={() => setPage('materials')} className={linkClasses('materials')}>
                Materiais
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400 hidden sm:block">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600"
            >
              Sair
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default AdminNavbar;
