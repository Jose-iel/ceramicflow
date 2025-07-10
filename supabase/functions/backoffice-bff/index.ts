
/* eslint-disable */
// Função Deno/Supabase - ignorar todas as regras do ESLint pois roda em ambiente Deno

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

// Cliente Admin para operações que exigem privilégios elevados
const getSupabaseAdmin = () => createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

async function handleUsersTab(action: string, payload: any, supabase: any) {
  const supabaseAdmin = getSupabaseAdmin();

  switch (action) {
    case 'getData': {
      const usersPromise = supabase
        .from('profiles')
        .select('*, ceramics(name), user_levels(name)')
        .order('created_at', { ascending: false });
      
      const ceramicsPromise = supabase.from('ceramics').select('id, name').order('name');
      const levelsPromise = supabase.from('user_levels').select('id, name').order('name');

      const [
        { data: users, error: usersError }, 
        { data: ceramics, error: ceramicsError }, 
        { data: levels, error: levelsError }
      ] = await Promise.all([usersPromise, ceramicsPromise, levelsPromise]);

      if (usersError) throw usersError;
      if (ceramicsError) throw ceramicsError;
      if (levelsError) throw levelsError;

      return { users, ceramics, userLevels: levels };
    }
    case 'create': {
      // Reutiliza a função existente para criar usuários
      const { data, error } = await supabaseAdmin.functions.invoke('create-user', {
          body: payload,
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      return { success: true };
    }
    case 'update': {
      const { userId, userData } = payload;
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: userData.full_name,
          is_admin: userData.is_admin,
          user_level_id: userData.user_level_id,
          ceramic_id: userData.ceramic_id,
        })
        .eq('id', userId);

      if (error) throw error;
      return { success: true };
    }
    case 'delete': {
      const { userId } = payload;
      const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
      if (error) throw error;
      return { success: true };
    }
    default:
      throw new Error(`Ação inválida para o recurso de usuários: ${action}`);
  }
}

async function handleCeramicsTab(action: string, payload: any, supabase: any) {
  switch (action) {
    case 'getData': {
      const { data, error } = await supabase.from('ceramics').select('*').order('name');
      if (error) throw error;
      return { ceramics: data };
    }
    case 'create': {
      const { ceramicData } = payload;
      // Garante que apenas os campos corretos sejam inseridos
      const dataToSave = {
        name: ceramicData.name,
        address: ceramicData.address,
        phone: ceramicData.phone,
        email: ceramicData.email,
        is_active: ceramicData.is_active,
      };
      const { error } = await supabase.from('ceramics').insert(dataToSave);
      if (error) throw error;
      return { success: true };
    }
    case 'update': {
      const { ceramicId, ceramicData } = payload;
       // Garante que apenas os campos corretos sejam atualizados
      const dataToUpdate = {
        name: ceramicData.name,
        address: ceramicData.address,
        phone: ceramicData.phone,
        email: ceramicData.email,
        is_active: ceramicData.is_active,
      };
      const { error } = await supabase.from('ceramics').update(dataToUpdate).eq('id', ceramicId);
      if (error) throw error;
      return { success: true };
    }
    case 'delete': {
      const { ceramicId } = payload;
      const { error } = await supabase.from('ceramics').delete().eq('id', ceramicId);
      if (error) throw error;
      return { success: true };
    }
    default:
      throw new Error(`Ação inválida para o recurso de cerâmicas: ${action}`);
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { resource, action, payload } = await req.json();
    let data;

    switch (resource) {
      case 'users-tab':
        data = await handleUsersTab(action, payload, supabase);
        break;
      case 'ceramics-tab':
        data = await handleCeramicsTab(action, payload, supabase);
        break;
      default:
        throw new Error(`Recurso inválido: ${resource}`);
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("Erro na Edge Function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
