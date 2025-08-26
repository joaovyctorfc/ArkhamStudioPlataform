import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { NewOrderItem, Material } from '../types';
import Textarea from '../components/Textarea';

interface NewOrderProps {
  setPage: (page: 'dashboard' | 'new-order') => void;
}

const NewOrder: React.FC<NewOrderProps> = ({ setPage }) => {
  const { client } = useAuth();
  const [items, setItems] = useState<NewOrderItem[]>([
    { nome_peca: '', material_id: 0, quantidade: 1 }
  ]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      const { data, error } = await supabase.from('materiais').select('*').order('nome');
      if (error) {
        setError('Falha ao carregar materiais.');
        console.error(error);
      } else {
        setMaterials(data || []);
      }
    };
    fetchMaterials();
  }, []);


  const handleItemChange = (index: number, field: keyof NewOrderItem, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      { nome_peca: '', material_id: 0, quantidade: 1 }
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return; // Must have at least one item
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client) {
      setError('Perfil do cliente não encontrado. Não é possível criar o pedido.');
      return;
    }

    if(items.some(item => !item.nome_peca || !item.material_id || item.quantidade <= 0)) {
        setError('Por favor, preencha todos os campos para cada item, incluindo a seleção do material.');
        return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: orderData, error: orderError } = await supabase
        .from('pedidos')
        .insert({
          cliente_id: client.id,
          observacoes: observacoes,
        })
        .select()
        .single();

      if (orderError) throw orderError;
      if (!orderData) throw new Error('Falha ao criar o pedido.');

      const orderItemsData = items.map(item => ({
        ...item,
        pedido_id: orderData.id,
      }));

      const { error: itemsError } = await supabase
        .from('pedido_itens')
        .insert(orderItemsData);
      
      if (itemsError) {
        await supabase.from('pedidos').delete().eq('id', orderData.id);
        throw itemsError;
      }

      alert('Pedido criado com sucesso!');
      setPage('dashboard');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Criar um Novo Pedido</h1>
        <button
          onClick={() => setPage('dashboard')}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          &larr; Voltar para o Painel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Itens do Pedido</h2>
          <div className="space-y-6">
            {items.map((item, index) => (
              <div key={index} className="p-4 border dark:border-gray-700 rounded-lg grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="md:col-span-2">
                    <label htmlFor={`nome_peca_${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome da Peça</label>
                    <input id={`nome_peca_${index}`} type="text" value={item.nome_peca} onChange={(e) => handleItemChange(index, 'nome_peca', e.target.value)} required className="block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"/>
                </div>
                 <div>
                    <label htmlFor={`material_${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Material</label>
                    <select
                      id={`material_${index}`}
                      value={item.material_id}
                      onChange={(e) => handleItemChange(index, 'material_id', parseInt(e.target.value))}
                      required
                      className="block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                    >
                      <option value={0} disabled>Selecione...</option>
                      {materials.map(material => (
                        <option key={material.id} value={material.id}>
                          {material.nome} ({material.cor})
                        </option>
                      ))}
                    </select>
                  </div>
                <div className="flex items-center space-x-2">
                   <div>
                     <label htmlFor={`quantidade_${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Qtd</label>
                     <input id={`quantidade_${index}`} type="number" min="1" value={item.quantidade} onChange={(e) => handleItemChange(index, 'quantidade', parseInt(e.target.value))} required className="block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"/>
                   </div>
                   <button type="button" onClick={() => removeItem(index)} disabled={items.length <= 1} className="h-10 w-10 p-2 text-red-500 hover:bg-red-100 dark:hover:bg-gray-700 rounded-full disabled:opacity-50 disabled:cursor-not-allowed">
                     &times;
                   </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addItem}
            className="mt-4 px-4 py-2 text-sm font-medium text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700"
          >
            + Adicionar Outro Item
          </button>
        </div>

        <Textarea
          label="Observações"
          id="observacoes"
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          placeholder="Quaisquer solicitações especiais ou notas para este pedido..."
        />
        
        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
            <span className="font-medium">Erro!</span> {error}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Enviando Pedido...' : 'Enviar Pedido'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewOrder;