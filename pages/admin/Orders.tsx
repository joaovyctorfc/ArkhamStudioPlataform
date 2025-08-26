import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Order } from '../../types';

const AdminOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('pedidos')
                .select('*, clientes(nome)')
                .order('data_pedido', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId: number, newStatus: Order['status']) => {
        const { error } = await supabase
            .from('pedidos')
            .update({ status: newStatus })
            .eq('id', orderId);

        if (error) {
            alert(`Erro ao atualizar status: ${error.message}`);
        } else {
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        }
    };
    
    const statusOptions: Order['status'][] = ['pendente', 'em produção', 'finalizado', 'cancelado'];

    const getStatusColor = (status: Order['status']) => {
      switch(status) {
        case 'finalizado': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'em produção': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        case 'cancelado': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      }
    }

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Gerenciar Pedidos</h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                    {loading && <p>Carregando pedidos...</p>}
                    {error && <p className="text-red-500">Erro: {error}</p>}
                    {!loading && !error && orders.length === 0 && (
                        <p>Nenhum pedido encontrado.</p>
                    )}
                    {!loading && !error && orders.length > 0 && (
                         <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pedido ID</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cliente</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Data</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Valor Total</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {orders.map((order) => (
                                        <tr key={order.id}>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium">#{order.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{order.clientes?.nome || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{new Date(order.data_pedido).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">R$ {order.valor_total.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                                                    className={`w-full p-2 border-transparent rounded-md text-sm capitalize appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${getStatusColor(order.status)}`}
                                                    style={{ backgroundPosition: 'right 0.5rem center' }}
                                                >
                                                    {statusOptions.map(status => (
                                                        <option key={status} value={status}>{status.replace('_', ' ')}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
