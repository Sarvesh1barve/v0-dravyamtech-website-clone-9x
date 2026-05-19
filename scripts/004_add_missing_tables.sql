-- Add missing columns to payments table
-- Updated_at for tracking when records are modified
-- Payment_method for tracking UPI vs other payment types
-- Unique constraint on transaction_id to prevent duplicates

ALTER TABLE payments
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE payments
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'upi';

-- Add unique constraint on transaction_id
ALTER TABLE payments
ADD CONSTRAINT unique_transaction_id UNIQUE(transaction_id);

-- Create user_resources table to track which resources users have purchased/accessed
CREATE TABLE IF NOT EXISTS public.user_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  accessed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, resource_id)
);

-- Enable RLS on user_resources
ALTER TABLE public.user_resources ENABLE ROW LEVEL SECURITY;

-- User can see their own resource access
CREATE POLICY "users_see_own_resources"
ON user_resources FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins can see all resource access via service role (handled in API)
-- No explicit policy needed as service role bypasses RLS

-- Create trigger to update user_resources.accessed_at
CREATE OR REPLACE FUNCTION update_user_resource_accessed()
RETURNS TRIGGER AS $$
BEGIN
  NEW.accessed_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to update accessed_at when user accesses resource
CREATE TRIGGER user_resources_accessed_trigger
BEFORE UPDATE ON user_resources
FOR EACH ROW
WHEN (OLD.accessed_at IS DISTINCT FROM NEW.accessed_at)
EXECUTE FUNCTION update_user_resource_accessed();

-- Add updated_at trigger for user_resources
CREATE OR REPLACE FUNCTION update_user_resources_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_resources_updated_at_trigger
BEFORE UPDATE ON user_resources
FOR EACH ROW
EXECUTE FUNCTION update_user_resources_updated_at();
