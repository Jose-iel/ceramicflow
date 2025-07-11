// Teste específico para criação de vendas
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xvzrvzhmppkjydvefcnt.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2enJ2emhtcHBranlkdmVmY250Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MTA4NjksImV4cCI6MjA2NTQ4Njg2OX0.Y742H_X0RRDXVcwj6vKmnimORqDLDHgWj17H_KHtwJ8';

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testSalesCreation() {
  try {
    console.error('Testando criação de vendas...');
    
    // Verificar se usuário está autenticado
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      console.error('❌ Usuário não autenticado. Para testar criação de vendas, é necessário estar logado.');
      return;
    }
    
    // Verificar se perfil existe
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('ceramic_id')
      .eq('id', sessionData.session.user.id)
      .single();
    
    if (profileError) {
      console.error('❌ Erro ao buscar perfil:', profileError);
      return;
    }
    
    if (!profileData?.ceramic_id) {
      console.error('❌ ceramic_id não encontrado para o usuário');
      return;
    }
    
    console.error('✅ Usuário autenticado e perfil encontrado');
    console.error('ceramic_id:', profileData.ceramic_id);
    
    // Testar inserção (com dados de teste)
    const testSaleData = {
      ceramic_id: profileData.ceramic_id,
      sale_date: '2025-07-11',
      customer_name: 'Cliente Teste',
      customer_contact: '(11) 99999-9999',
      brick_quantity: 1000,
      price_per_thousand: 150.00,
      total_value: 150.00,
      notes: 'Venda de teste',
      recorded_by: 'Teste Automático'
    };
    
    const { error: insertError } = await supabase
      .from('sales')
      .insert(testSaleData);
    
    if (insertError) {
      console.error('❌ Erro ao inserir venda de teste:', insertError);
      return;
    }
    
    console.error('✅ Venda de teste criada com sucesso!');
    
  } catch (err) {
    console.error('❌ Erro no teste:', err);
  }
}

// Executar teste
testSalesCreation();
