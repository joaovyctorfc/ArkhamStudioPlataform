// A herança de `User` do Supabase foi removida, pois os tipos não estão
// disponíveis em tempo de design sem um processo de build como o do Vite.
// import { User } from "@supabase/supabase-js";

export interface AppUser {
  // You can add custom properties here if you extend the user profile
}

export interface Client {
  id: number;
  usuario_id: string;
  nome: string;
  email: string;
  telefone?: string;
  endereco?: string;
  role: 'admin' | 'cliente';
}

export interface Material {
  id: number;
  nome: string;
  tipo: string;
  cor: string;
  preco_por_grama: number;
  estoque_gramas: number;
}

export interface Order {
  id: number;
  cliente_id: number;
  status: 'pendente' | 'em produção' | 'finalizado' | 'cancelado';
  valor_total: number;
  data_pedido: string;
  observacoes?: string;
  pedido_itens: OrderItem[];
  clientes?: { nome: string }; // For admin view to get client name
}

export interface OrderItem {
  id?: number;
  pedido_id?: number;
  nome_peca: string;
  material_id: number;
  quantidade: number;
}

export type NewOrderItem = Omit<OrderItem, 'id' | 'pedido_id'>;