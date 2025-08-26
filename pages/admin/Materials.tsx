import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Material } from '../../types';

const AdminMaterials: React.FC = () => {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [nome, setNome] = useState('');
    const [tipo, setTipo] = useState('PLA');
    const [cor, setCor] = useState('');
    const [precoPorGrama, setPrecoPorGrama] = useState(0.0);
    const [estoqueGramas, setEstoqueGramas] = useState(0);

    const fetchMaterials = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from('materiais').select('*').order('nome');
            if (error) throw error;
            setMaterials(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaterials();
    }, []);

    const resetForm = () => {
        setNome('');
        setTipo('PLA');
        setCor('');
        setPrecoPorGrama(0.0);
        setEstoqueGramas(0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!nome || !tipo || !cor || precoPorGrama <= 0) {
            setError('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const { error: insertError } = await supabase.from('materiais').insert({
            nome,
            tipo,
            cor,
            preco_por_grama: precoPorGrama,
            estoque_gramas: estoqueGramas
        });

        if (insertError) {
            setError(insertError.message);
        } else {
            resetForm();
            await fetchMaterials(); // Refresh list
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Tem certeza que deseja deletar este material?')) {
            const { error: deleteError } = await supabase.from('materiais').delete().eq('id', id);
            if (deleteError) {
                setError(deleteError.message);
            } else {
                await fetchMaterials(); // Refresh list
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Adicionar Novo Material</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-3">
                         {error && <p className="text-red-500 mb-4">{error}</p>}
                    </div>
                     <div>
                        <label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do Material</label>
                        <input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} required className="block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"/>
                    </div>
                     <div>
                        <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo</label>
                        <select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} required className="block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                            <option value="PLA">PLA</option>
                            <option value="ABS">ABS</option>
                            <option value="PETG">PETG</option>
                            <option value="TPU">TPU</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="cor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cor</label>
                        <input id="cor" type="text" value={cor} onChange={(e) => setCor(e.target.value)} required className="block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"/>
                    </div>
                    <div>
                        <label htmlFor="preco" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preço por Grama (R$)</label>
                        <input id="preco" type="number" step="0.01" min="0" value={precoPorGrama} onChange={(e) => setPrecoPorGrama(parseFloat(e.target.value))} required className="block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"/>
                    </div>
                     <div>
                        <label htmlFor="estoque" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estoque (gramas)</label>
                        <input id="estoque" type="number" min="0" value={estoqueGramas} onChange={(e) => setEstoqueGramas(parseInt(e.target.value))} required className="block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"/>
                    </div>
                    <div className="md:col-span-3">
                         <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700">Adicionar Material</button>
                    </div>
                </form>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Materiais Cadastrados</h2>
                    {loading && <p>Carregando...</p>}
                    {!loading && materials.length === 0 && <p>Nenhum material cadastrado.</p>}
                    {!loading && materials.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nome</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tipo</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cor</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Preço/g</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estoque (g)</th>
                                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {materials.map((material) => (
                                        <tr key={material.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{material.nome}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{material.tipo}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{material.cor}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">R$ {material.preco_por_grama.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{material.estoque_gramas}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button onClick={() => handleDelete(material.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Deletar</button>
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

export default AdminMaterials;
