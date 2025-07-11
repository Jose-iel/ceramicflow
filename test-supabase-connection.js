// Teste de conexão com Supabase
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xvzrvzhmppkjydvefcnt.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2enJ2emhtcHBranlkdmVmY250Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MTA4NjksImV4cCI6MjA2NTQ4Njg2OX0.Y742H_X0RRDXVcwj6vKmnimORqDLDHgWj17H_KHtwJ8';

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testConnection() {
  try {
    console.log('Testando conexão com Supabase...');
    
    // Teste básico de conexão
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Erro na conexão:', error);
      return false;
    }
    
    console.log('✅ Conexão com Supabase funcionando!');
    
    // Teste de autenticação
    const { data: sessionData } = await supabase.auth.getSession();
    console.log('Session atual:', sessionData.session ? 'Autenticado' : 'Não autenticado');
    
    return true;
  } catch (err) {
    console.error('Erro no teste:', err);
    return false;
  }
}

async function testSalesTable() {
  try {
    console.log('\nTestando tabela sales...');
    
    const { data, error } = await supabase
      .from('sales')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Erro ao acessar tabela sales:', error);
      return false;
    }
    
    console.log('✅ Tabela sales acessível!');
    return true;
  } catch (err) {
    console.error('Erro no teste da tabela sales:', err);
    return false;
  }
}

// Executar testes
(async () => {
  const connectionOk = await testConnection();
  if (connectionOk) {
    await testSalesTable();
  }
})();
