-- Adicionar foreign keys entre conversations e profiles
ALTER TABLE public.conversations
DROP CONSTRAINT IF EXISTS conversations_tenant_id_fkey,
DROP CONSTRAINT IF EXISTS conversations_owner_id_fkey;

ALTER TABLE public.conversations
ADD CONSTRAINT conversations_tenant_id_fkey 
  FOREIGN KEY (tenant_id) 
  REFERENCES public.profiles(id) 
  ON DELETE CASCADE,
ADD CONSTRAINT conversations_owner_id_fkey 
  FOREIGN KEY (owner_id) 
  REFERENCES public.profiles(id) 
  ON DELETE CASCADE;

-- Adicionar foreign key entre messages e profiles
ALTER TABLE public.messages
DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;

ALTER TABLE public.messages
ADD CONSTRAINT messages_sender_id_fkey 
  FOREIGN KEY (sender_id) 
  REFERENCES public.profiles(id) 
  ON DELETE CASCADE;