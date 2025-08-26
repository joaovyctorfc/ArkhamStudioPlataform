import React, { useState } from 'react';
import Dashboard from './Dashboard';
import NewOrder from './NewOrder';
import Navbar from '../components/Navbar';

type Page = 'dashboard' | 'new-order';

const ClientView: React.FC = () => {
  const [page, setPage] = useState<Page>('dashboard');

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <Navbar setPage={setPage} />
      <main className="p-4 sm:p-6 lg:p-8">
        {page === 'dashboard' && <Dashboard setPage={setPage} />}
        {page === 'new-order' && <NewOrder setPage={setPage} />}
      </main>
    </div>
  );
};

export default ClientView;
