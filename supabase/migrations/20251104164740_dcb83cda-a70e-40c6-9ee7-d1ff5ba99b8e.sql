-- Drop the old restrictive policy first
DROP POLICY IF EXISTS "Users can update their own messages" ON public.messages;

-- Allow conversation participants to mark messages as read
CREATE POLICY "Participants can mark messages as read"
ON public.messages
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = messages.conversation_id
      AND (c.tenant_id = auth.uid() OR c.owner_id = auth.uid())
  )
);

-- Prevent recipients from modifying message content/ownership, allow only is_read toggle
CREATE OR REPLACE FUNCTION public.restrict_message_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If sender is updating, allow any change
  IF auth.uid() = OLD.sender_id THEN
    RETURN NEW;
  END IF;

  -- For non-senders, only allow flipping is_read from false to true without changing other fields
  IF NEW.is_read = TRUE
     AND OLD.is_read = FALSE
     AND NEW.content = OLD.content
     AND NEW.sender_id = OLD.sender_id
     AND NEW.conversation_id = OLD.conversation_id THEN
    RETURN NEW;
  END IF;

  RAISE EXCEPTION 'Only the sender can modify message content; recipients may only mark messages as read';
END;
$$;

DROP TRIGGER IF EXISTS trg_restrict_message_update ON public.messages;
CREATE TRIGGER trg_restrict_message_update
BEFORE UPDATE ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.restrict_message_update();