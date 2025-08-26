
// ⚠️ AVISO DE SEGURANÇA: As chaves de API estão expostas neste arquivo.
// Para este projeto simplificado que roda sem um processo de build,
// as chaves estão diretamente no código. Em um projeto de produção real,
// NUNCA exponha suas chaves desta forma. Use variáveis de ambiente.

// O script da CDN do Supabase disponibiliza um objeto global chamado `supabase`.
// FIX: Resolved "Block-scoped variable 'supabase' used before its declaration" error.
// The issue was a naming conflict between the global `supabase` object provided by the CDN
// and the `supabase` client instance exported by this module.
// By accessing the global object via `(globalThis as any).supabase`, we avoid the TDZ error.
const { createClient } = (globalThis as any).supabase;

const supabaseUrl = "https://xslawmuheuqjwqdtusng.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzbGF3bXVoZXVxandxZHR1c25nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMjEyNjksImV4cCI6MjA3MTc5NzI2OX0.OxYIeEvikSNxzHhuGZCfH_5JFdUTZpwaaCLqLlA9neI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);