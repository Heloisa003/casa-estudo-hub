-- Create bookings/rentals table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Policies for bookings
CREATE POLICY "Users can view own bookings"
ON public.bookings
FOR SELECT
USING (auth.uid() = tenant_id OR auth.uid() IN (
  SELECT owner_id FROM public.properties WHERE id = property_id
));

CREATE POLICY "Property owners can create bookings"
ON public.bookings
FOR INSERT
WITH CHECK (auth.uid() IN (
  SELECT owner_id FROM public.properties WHERE id = property_id
));

CREATE POLICY "Users can update own bookings"
ON public.bookings
FOR UPDATE
USING (auth.uid() = tenant_id OR auth.uid() IN (
  SELECT owner_id FROM public.properties WHERE id = property_id
));

-- Create security definer function to check if user has rented property
CREATE OR REPLACE FUNCTION public.user_has_rented_property(_user_id UUID, _property_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.bookings
    WHERE tenant_id = _user_id
      AND property_id = _property_id
      AND status = 'completed'
  )
$$;

-- Drop existing review policies
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.reviews;

-- Create new policy: only users who completed a booking can review
CREATE POLICY "Users who rented can create reviews"
ON public.reviews
FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  public.user_has_rented_property(auth.uid(), property_id)
);

-- Add indexes for better performance
CREATE INDEX idx_bookings_tenant_id ON public.bookings(tenant_id);
CREATE INDEX idx_bookings_property_id ON public.bookings(property_id);

-- Create trigger for updated_at on bookings
CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();