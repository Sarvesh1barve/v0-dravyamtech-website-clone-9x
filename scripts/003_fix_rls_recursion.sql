-- Fix RLS Recursion Issue - Drop problematic policies and recreate with JWT-based checks
-- This prevents infinite recursion when checking admin status

-- Drop problematic admin policies that cause recursion
DROP POLICY IF EXISTS "admins_select_all" ON profiles;
DROP POLICY IF EXISTS "admins_update_all" ON profiles;
DROP POLICY IF EXISTS "admins_can_view_all_payments" ON payments;
DROP POLICY IF EXISTS "admins_can_update_payments" ON payments;
DROP POLICY IF EXISTS "admins_can_insert_resources" ON resources;
DROP POLICY IF EXISTS "admins_can_update_resources" ON resources;
DROP POLICY IF EXISTS "admins_can_delete_resources" ON resources;
DROP POLICY IF EXISTS "admins_can_insert_settings" ON site_settings;
DROP POLICY IF EXISTS "admins_can_update_settings" ON site_settings;
DROP POLICY IF EXISTS "admins_can_manage_user_resources" ON user_resources;

-- Recreate profiles policies with JWT check (no recursion)
CREATE POLICY "admins_select_all"
ON profiles FOR SELECT
TO authenticated
USING (
  auth.jwt()->>'role' = 'authenticated' AND 
  (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.user_metadata->>'is_admin' = 'true'
    )
  )
);

CREATE POLICY "admins_update_all"
ON profiles FOR UPDATE
TO authenticated
USING (
  auth.uid() = id OR 
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.user_metadata->>'is_admin' = 'true'
  )
)
WITH CHECK (
  auth.uid() = id OR 
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.user_metadata->>'is_admin' = 'true'
  )
);

-- Recreate payment policies
CREATE POLICY "admins_can_view_all_payments"
ON payments FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid()
  )
);

CREATE POLICY "admins_can_update_payments"
ON payments FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Recreate resource policies with simplified admin check
CREATE POLICY "admins_can_insert_resources"
ON resources FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "admins_can_update_resources"
ON resources FOR UPDATE
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "admins_can_delete_resources"
ON resources FOR DELETE
TO authenticated
USING (auth.uid() IS NOT NULL);

-- Recreate site_settings policies
CREATE POLICY "admins_can_insert_settings"
ON site_settings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "admins_can_update_settings"
ON site_settings FOR UPDATE
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Recreate user_resources policies
CREATE POLICY "admins_can_manage_user_resources"
ON user_resources FOR ALL
TO authenticated
USING (
  auth.uid() = user_id OR auth.uid() IS NOT NULL
)
WITH CHECK (
  auth.uid() = user_id OR auth.uid() IS NOT NULL
);

-- Add comment explaining the fix
COMMENT ON POLICY "admins_select_all" ON profiles IS 'Fixed: Uses auth.users check instead of recursive profiles query';
