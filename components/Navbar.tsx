import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../services/supabaseClient';

interface NavbarProps {
  setPage: (page: 'dashboard' | 'new-order') => void;
}

const Navbar: React.FC<NavbarProps> = ({ setPage }) => {
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={() => setPage('dashboard')} className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              Pedidos de Impressão 3D
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">{user?.email}</span>
            <button
                onClick={() => setPage('new-order')}
                className="px-4 py-2 text-sm font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-800"
            >
                Novo Pedido
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Sair
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;