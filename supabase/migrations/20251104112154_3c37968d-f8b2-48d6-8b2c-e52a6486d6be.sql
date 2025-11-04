-- Add missing enum value 'comercial' to property_type
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public' AND t.typname = 'property_type' AND e.enumlabel = 'comercial'
  ) THEN
    ALTER TYPE public.property_type ADD VALUE 'comercial';
  END IF;
END $$;