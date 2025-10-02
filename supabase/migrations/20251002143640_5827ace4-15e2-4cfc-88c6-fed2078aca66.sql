-- Improve handle_new_user function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_user_type user_type;
  v_full_name text;
  v_phone text;
  v_university text;
BEGIN
  -- Extract and validate user_type
  v_user_type := COALESCE(
    (NEW.raw_user_meta_data->>'user_type')::user_type,
    'student'::user_type
  );
  
  -- Extract other metadata
  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
  v_phone := NEW.raw_user_meta_data->>'phone';
  v_university := NEW.raw_user_meta_data->>'university';
  
  -- Insert profile
  INSERT INTO public.profiles (id, user_type, full_name, phone, university)
  VALUES (
    NEW.id,
    v_user_type,
    v_full_name,
    v_phone,
    v_university
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't block user creation
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$function$;