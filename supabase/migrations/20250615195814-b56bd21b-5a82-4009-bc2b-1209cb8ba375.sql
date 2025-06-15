
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  v_user_level_id UUID;
  v_ceramic_id UUID;
  v_is_admin BOOLEAN;
  v_full_name TEXT;
  viewer_level_id UUID;
BEGIN
  -- Extrai os valores dos metadados do novo usuário, tratando strings vazias como NULL para evitar erros de conversão
  v_user_level_id := (NULLIF(NEW.raw_user_meta_data->>'user_level_id', ''))::UUID;
  v_ceramic_id := (NULLIF(NEW.raw_user_meta_data->>'ceramic_id', ''))::UUID;
  v_is_admin := (NEW.raw_user_meta_data->>'is_admin')::BOOLEAN;
  v_full_name := NEW.raw_user_meta_data->>'full_name';
  
  -- Se um nível de acesso não for fornecido, define como 'VIEWER' por padrão
  IF v_user_level_id IS NULL THEN
    SELECT id INTO viewer_level_id FROM public.user_levels WHERE name = 'VIEWER';
    v_user_level_id := viewer_level_id;
  END IF;

  -- Insere o novo perfil na tabela 'profiles' com todos os dados
  INSERT INTO public.profiles (id, email, full_name, ceramic_id, user_level_id, is_admin)
  VALUES (
    NEW.id, 
    NEW.email, 
    v_full_name,
    v_ceramic_id,
    v_user_level_id,
    COALESCE(v_is_admin, false)
  );
  RETURN NEW;
END;
$function$
;
