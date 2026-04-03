-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  is_subscribed BOOLEAN DEFAULT FALSE,
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create site_settings table for admin customization
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  primary_color TEXT DEFAULT '#1e3a5f',
  accent_color TEXT DEFAULT '#f59e0b',
  heading_color TEXT DEFAULT '#ffffff',
  text_color TEXT DEFAULT '#e5e7eb',
  upi_id TEXT,
  qr_code_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create resources table for video/content management
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  is_locked BOOLEAN DEFAULT TRUE,
  category TEXT DEFAULT 'general',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payments table for tracking user payments
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2),
  status TEXT DEFAULT 'pending',
  transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Admin can view all profiles
CREATE POLICY "admin_select_all_profiles" ON public.profiles FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Admin can update all profiles
CREATE POLICY "admin_update_all_profiles" ON public.profiles FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Site settings - anyone can read
CREATE POLICY "site_settings_select_all" ON public.site_settings FOR SELECT TO authenticated, anon USING (TRUE);

-- Site settings - only admin can modify
CREATE POLICY "admin_update_site_settings" ON public.site_settings FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "admin_insert_site_settings" ON public.site_settings FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Resources - public can see unlocked, subscribed users can see all
CREATE POLICY "resources_select_unlocked" ON public.resources FOR SELECT 
  USING (
    is_locked = FALSE 
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND (is_subscribed = TRUE OR is_admin = TRUE)
    )
  );

-- Admin can manage resources
CREATE POLICY "admin_insert_resources" ON public.resources FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "admin_update_resources" ON public.resources FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "admin_delete_resources" ON public.resources FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Payments policies
CREATE POLICY "payments_select_own" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "payments_insert_own" ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin can view all payments
CREATE POLICY "admin_select_all_payments" ON public.payments FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "admin_update_payments" ON public.payments FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Insert default site settings
INSERT INTO public.site_settings (primary_color, accent_color, heading_color, text_color)
VALUES ('#1e3a5f', '#f59e0b', '#ffffff', '#e5e7eb')
ON CONFLICT DO NOTHING;
