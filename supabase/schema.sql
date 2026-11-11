-- ==============================================================================
-- ETERNAL MYTREE - Production Database Schema & Security
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE NOT NULL,
    is_suspended BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 24),
    CONSTRAINT username_format CHECK (username ~* '^[a-zA-Z0-9_]+$')
);

CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- 2. TREES TABLE
CREATE TABLE IF NOT EXISTS public.trees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    tree_name TEXT NOT NULL,
    theme TEXT DEFAULT 'classic' NOT NULL,
    settings JSONB DEFAULT '{}'::jsonb NOT NULL,
    is_public BOOLEAN DEFAULT TRUE NOT NULL,
    accept_messages BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    CONSTRAINT unique_user_tree UNIQUE (user_id),
    CONSTRAINT tree_name_length CHECK (char_length(tree_name) >= 2 AND char_length(tree_name) <= 50)
);

CREATE INDEX IF NOT EXISTS idx_trees_user_id ON public.trees(user_id);

-- 3. ORNAMENTS TABLE
CREATE TABLE IF NOT EXISTS public.ornaments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tree_id UUID NOT NULL REFERENCES public.trees(id) ON DELETE CASCADE,
    ornament_type TEXT NOT NULL,
    position_x REAL NOT NULL,
    position_y REAL NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ornaments_tree_id ON public.ornaments(tree_id);

-- 4. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tree_id UUID NOT NULL REFERENCES public.trees(id) ON DELETE CASCADE,
    ornament_id UUID NOT NULL REFERENCES public.ornaments(id) ON DELETE CASCADE,
    sender_name TEXT NOT NULL,
    message_content TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE NOT NULL,
    is_hidden BOOLEAN DEFAULT FALSE NOT NULL,
    ip_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    CONSTRAINT message_length CHECK (char_length(message_content) >= 1 AND char_length(message_content) <= 300)
);

CREATE INDEX IF NOT EXISTS idx_messages_tree_id ON public.messages(tree_id);
CREATE INDEX IF NOT EXISTS idx_messages_ornament_id ON public.messages(ornament_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);

-- 5. TREE VISITS TABLE
CREATE TABLE IF NOT EXISTS public.tree_visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tree_id UUID NOT NULL REFERENCES public.trees(id) ON DELETE CASCADE,
    visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
    visit_count INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT unique_tree_daily_visit UNIQUE (tree_id, visit_date)
);

CREATE INDEX IF NOT EXISTS idx_tree_visits_tree_date ON public.tree_visits(tree_id, visit_date);

-- 6. APP SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.app_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

INSERT INTO public.app_settings (setting_key, setting_value, description)
VALUES
    ('message_unlock_date', '2026-12-25T00:00:00Z', 'Date when users can read their private messages'),
    ('allow_registration', 'true', 'Global switch to allow new user registrations'),
    ('maintenance_mode', 'false', 'Global switch to enable maintenance mode'),
    ('max_ornaments_per_tree', '200', 'Maximum ornaments allowed on a single tree'),
    ('site_title', 'Eternal MyTree', 'Platform Title')
ON CONFLICT (setting_key) DO NOTHING;

-- 7. ADMIN LOGS TABLE
CREATE TABLE IF NOT EXISTS public.admin_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON public.admin_logs(created_at);

-- 8. REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tree_id UUID REFERENCES public.trees(id) ON DELETE CASCADE,
    message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ornaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tree_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Trees are viewable by everyone" ON public.trees FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Users can create their own tree" ON public.trees FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tree" ON public.trees FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Ornaments are viewable by everyone" ON public.ornaments FOR SELECT USING (true);
CREATE POLICY "Anyone can add an ornament to an accepting tree" ON public.ornaments FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.trees WHERE trees.id = ornaments.tree_id AND trees.accept_messages = true AND trees.is_public = true)
);

CREATE POLICY "Tree owners can view their incoming messages metadata" ON public.messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.trees WHERE trees.id = messages.tree_id AND trees.user_id = auth.uid())
);
CREATE POLICY "Anyone can insert a message" ON public.messages FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.trees WHERE trees.id = messages.tree_id AND trees.accept_messages = true)
);
CREATE POLICY "Tree owners can delete messages on their tree" ON public.messages FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.trees WHERE trees.id = messages.tree_id AND trees.user_id = auth.uid())
);

CREATE POLICY "Tree visits viewable by tree owner" ON public.tree_visits FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.trees WHERE trees.id = tree_visits.tree_id AND trees.user_id = auth.uid())
);

CREATE POLICY "App settings viewable by everyone" ON public.app_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can insert reports" ON public.reports FOR INSERT WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.increment_tree_visit(p_tree_id UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.tree_visits (tree_id, visit_date, visit_count)
    VALUES (p_tree_id, CURRENT_DATE, 1)
    ON CONFLICT (tree_id, visit_date)
    DO UPDATE SET visit_count = public.tree_visits.visit_count + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
