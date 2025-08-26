import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { Order } from '../types';

interface DashboardProps {
  setPage: (page: 'dashboard' | 'new-order') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setPage }) => {
  const { client } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!client) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('pedidos')
          .select('*')
          .eq('cliente_id', client.id)
          .order('data_pedido', { ascending: false });

        if (error) throw error;

        setOrders(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [client]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Bem-vindo, {client?.nome || 'Usuário'}!</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Aqui estão seus pedidos recentes de impressão 3D.</p>
        </div>
        <button
          onClick={() => setPage('new-order')}
          className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
        >
          Criar Novo Pedido
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Meus Pedidos</h2>
          {loading && <p>Carregando pedidos...</p>}
          {error && <p className="text-red-500">Erro: {error}</p>}
          {!loading && !error && orders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Você ainda não fez nenhum pedido.</p>
              <button
                onClick={() => setPage('new-order')}
                className="mt-4 px-5 py-2.5 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600"
              >
                Crie seu Primeiro Pedido
              </button>
            </div>
          )}
          {!loading && !error && orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="p-4 border dark:border-gray-700 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Pedido #{order.id}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(order.data_pedido).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${
                        order.status === 'finalizado' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                        order.status === 'em produção' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                        order.status === 'cancelado' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}
                    >
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="font-semibold">
                    R$ {order.valor_total.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;