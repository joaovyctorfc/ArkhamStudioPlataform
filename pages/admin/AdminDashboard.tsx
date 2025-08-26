import React, { useState } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import AdminOrders from './Orders';
import AdminMaterials from './Materials';

export type AdminPage = 'orders' | 'materials';

const AdminDashboard: React.FC = () => {
  const [page, setPage] = useState<AdminPage>('orders');

  const renderContent = () => {
    switch (page) {
      case 'orders':
        return <AdminOrders />;
      case 'materials':
        return <AdminMaterials />;
      default:
        return <AdminOrders />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <AdminNavbar setPage={setPage} currentPage={page} />
      <main className="p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
