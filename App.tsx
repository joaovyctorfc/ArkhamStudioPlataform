import React from 'react';
import { useAuth } from './hooks/useAuth';
import Auth from './pages/Auth';
import AdminDashboard from './pages/admin/AdminDashboard';
import ClientView from './pages/ClientView';

const App: React.FC = () => {
  const { user, client, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">Carregando...</div>
      </div>
    );
  }

  if (!user || !client) {
    return <Auth />;
  }

  return client.role === 'admin' ? <AdminDashboard /> : <ClientView />;
};

export default App;