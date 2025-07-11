// Tipos para a Edge Function get-dashboard-overview
declare module 'https://esm.sh/@supabase/supabase-js@2' {
  export * from 'https://esm.sh/@supabase/supabase-js@2';
}

// Variáveis de ambiente do Deno
declare namespace Deno {
  namespace env {
    function get(key: string): string | undefined;
  }
  
  function serve(handler: (req: Request) => Response | Promise<Response>): void;
}
