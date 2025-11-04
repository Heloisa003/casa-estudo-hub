-- Create property_views table to track property visits
CREATE TABLE public.property_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.property_views ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view property views"
ON public.property_views
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert property views"
ON public.property_views
FOR INSERT
WITH CHECK (true);

-- Create index for better performance
CREATE INDEX idx_property_views_property_id ON public.property_views(property_id);
CREATE INDEX idx_property_views_viewed_at ON public.property_views(viewed_at);