
import { createClient } from '@supabase/supabase-js';

// ATENÇÃO: Suas chaves do Supabase estão expostas diretamente no código.
// Esta é uma prática insegura e não recomendada para produção.
// O ideal é usar variáveis de ambiente (arquivo .env) para proteger suas chaves.
//
// Substitua os valores abaixo pela sua URL e Chave Anon Pública do Supabase.
// Você pode encontrá-los no painel do seu projeto Supabase em:
// Configurações do Projeto > API

const supabaseUrl = "https://xslawmuheuqjwqdtusng.supabase.co"; // SUBSTITUA PELO SEU VALOR
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzbGF3bXVoZXVxandxZHR1c25nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMjEyNjksImV4cCI6MjA3MTc5NzI2OX0.OxYIeEvikSNxzHhuGZCfH_5JFdUTZpwaaCLqLlA9neI"; // SUBSTITUA PELO SEU VALOR

if (supabaseUrl.includes("seu-projeto.supabase.co") || supabaseAnonKey.includes("SUA_CHAVE_ANON_DO_SUPABASE")) {
  alert("CONFIGURAÇÃO INCOMPLETA: Por favor, edite o arquivo 'services/supabaseClient.ts' e adicione sua URL e Chave Anon do Supabase.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
