-- ============================================================================
-- FAIRWAYFUND SUPABASE DATABASE SCHEMA
-- ============================================================================
-- Complete SQL setup for FairwayFund application
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================
-- Stores additional user profile information
-- Links to auth.users via id

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'subscriber' CHECK (role IN ('subscriber', 'admin')),
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================================
-- SUBSCRIPTIONS TABLE
-- ============================================================================
-- Stores user subscription information

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'cancelled', 'past_due')),
  plan TEXT NOT NULL CHECK (plan IN ('monthly', 'yearly')),
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  payment_provider TEXT NOT NULL DEFAULT 'test',
  provider_subscription_id TEXT,
  provider_customer_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions"
  ON public.subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
  ON public.subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscriptions"
  ON public.subscriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Index for faster queries
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);

-- ============================================================================
-- GOLF_SCORES TABLE
-- ============================================================================
-- Stores user golf scores

CREATE TABLE IF NOT EXISTS public.golf_scores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 200),
  course_name TEXT NOT NULL,
  date_played DATE NOT NULL,
  handicap INTEGER,
  notes TEXT,
  verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES public.profiles(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.golf_scores ENABLE ROW LEVEL SECURITY;

-- RLS Policies for golf_scores
CREATE POLICY "Users can view their own scores"
  ON public.golf_scores FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scores"
  ON public.golf_scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own unverified scores"
  ON public.golf_scores FOR UPDATE
  USING (auth.uid() = user_id AND verified = FALSE);

CREATE POLICY "Admins can view all scores"
  ON public.golf_scores FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can verify scores"
  ON public.golf_scores FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Indexes
CREATE INDEX idx_golf_scores_user_id ON public.golf_scores(user_id);
CREATE INDEX idx_golf_scores_date_played ON public.golf_scores(date_played);
CREATE INDEX idx_golf_scores_verified ON public.golf_scores(verified);

-- ============================================================================
-- CHARITIES TABLE
-- ============================================================================
-- Stores registered charities

CREATE TABLE IF NOT EXISTS public.charities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  registration_number TEXT,
  category TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  total_received DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for charities
CREATE POLICY "Active charities are viewable by everyone"
  ON public.charities FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Admins can view all charities"
  ON public.charities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert charities"
  ON public.charities FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update charities"
  ON public.charities FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Index
CREATE INDEX idx_charities_is_active ON public.charities(is_active);

-- ============================================================================
-- CHARITY_EVENTS TABLE
-- ============================================================================
-- Stores charity events and campaigns

CREATE TABLE IF NOT EXISTS public.charity_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  charity_id UUID REFERENCES public.charities(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  goal_amount DECIMAL(12, 2),
  raised_amount DECIMAL(12, 2) DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.charity_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for charity_events
CREATE POLICY "Active events are viewable by everyone"
  ON public.charity_events FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Admins can manage charity events"
  ON public.charity_events FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Index
CREATE INDEX idx_charity_events_charity_id ON public.charity_events(charity_id);
CREATE INDEX idx_charity_events_is_active ON public.charity_events(is_active);

-- ============================================================================
-- CHARITY_SELECTIONS TABLE
-- ============================================================================
-- Stores user's selected charities for monthly contributions

CREATE TABLE IF NOT EXISTS public.charity_selections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  charity_id UUID REFERENCES public.charities(id) ON DELETE CASCADE NOT NULL,
  percentage INTEGER NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, charity_id)
);

-- Enable RLS
ALTER TABLE public.charity_selections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for charity_selections
CREATE POLICY "Users can view their own selections"
  ON public.charity_selections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own selections"
  ON public.charity_selections FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all selections"
  ON public.charity_selections FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Index
CREATE INDEX idx_charity_selections_user_id ON public.charity_selections(user_id);
CREATE INDEX idx_charity_selections_charity_id ON public.charity_selections(charity_id);

-- ============================================================================
-- CHARITY_CONTRIBUTIONS TABLE
-- ============================================================================
-- Tracks monthly charity contributions from subscriptions

CREATE TABLE IF NOT EXISTS public.charity_contributions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  charity_id UUID REFERENCES public.charities(id) ON DELETE CASCADE NOT NULL,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  contribution_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.charity_contributions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own contributions"
  ON public.charity_contributions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all contributions"
  ON public.charity_contributions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Indexes
CREATE INDEX idx_charity_contributions_user_id ON public.charity_contributions(user_id);
CREATE INDEX idx_charity_contributions_charity_id ON public.charity_contributions(charity_id);
CREATE INDEX idx_charity_contributions_date ON public.charity_contributions(contribution_date);

-- ============================================================================
-- INDEPENDENT_DONATIONS TABLE
-- ============================================================================
-- Stores one-time donations made outside of subscriptions

CREATE TABLE IF NOT EXISTS public.independent_donations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  charity_id UUID REFERENCES public.charities(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  payment_provider TEXT NOT NULL DEFAULT 'test',
  provider_payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  message TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.independent_donations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own donations"
  ON public.independent_donations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create donations"
  ON public.independent_donations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all donations"
  ON public.independent_donations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Index
CREATE INDEX idx_independent_donations_user_id ON public.independent_donations(user_id);
CREATE INDEX idx_independent_donations_charity_id ON public.independent_donations(charity_id);

-- ============================================================================
-- DRAW_SETTINGS TABLE
-- ============================================================================
-- Global settings for monthly draws

CREATE TABLE IF NOT EXISTS public.draw_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  prize_pool_percentage INTEGER NOT NULL DEFAULT 50 CHECK (prize_pool_percentage >= 0 AND prize_pool_percentage <= 100),
  first_prize_percentage INTEGER NOT NULL DEFAULT 50 CHECK (first_prize_percentage >= 0 AND first_prize_percentage <= 100),
  second_prize_percentage INTEGER NOT NULL DEFAULT 30 CHECK (second_prize_percentage >= 0 AND second_prize_percentage <= 100),
  third_prize_percentage INTEGER NOT NULL DEFAULT 20 CHECK (third_prize_percentage >= 0 AND third_prize_percentage <= 100),
  min_scores_required INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.draw_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Settings are viewable by everyone"
  ON public.draw_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage settings"
  ON public.draw_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Insert default settings
INSERT INTO public.draw_settings (prize_pool_percentage, first_prize_percentage, second_prize_percentage, third_prize_percentage, min_scores_required)
VALUES (50, 50, 30, 20, 1)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- DRAWS TABLE
-- ============================================================================
-- Monthly prize draws

CREATE TABLE IF NOT EXISTS public.draws (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL CHECK (year >= 2024),
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'open', 'drawing', 'completed', 'cancelled')),
  total_pool DECIMAL(12, 2) DEFAULT 0,
  prize_pool DECIMAL(12, 2) DEFAULT 0,
  first_prize_amount DECIMAL(12, 2) DEFAULT 0,
  second_prize_amount DECIMAL(12, 2) DEFAULT 0,
  third_prize_amount DECIMAL(12, 2) DEFAULT 0,
  total_entries INTEGER DEFAULT 0,
  draw_date DATE NOT NULL,
  drawn_at TIMESTAMPTZ,
  drawn_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(month, year)
);

-- Enable RLS
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Draws are viewable by everyone"
  ON public.draws FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage draws"
  ON public.draws FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Index
CREATE INDEX idx_draws_status ON public.draws(status);
CREATE INDEX idx_draws_year_month ON public.draws(year, month);

-- ============================================================================
-- DRAW_SIMULATIONS TABLE
-- ============================================================================
-- Test simulations for draws

CREATE TABLE IF NOT EXISTS public.draw_simulations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  draw_id UUID REFERENCES public.draws(id) ON DELETE CASCADE NOT NULL,
  simulated_by UUID REFERENCES public.profiles(id) NOT NULL,
  results JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.draw_simulations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage simulations"
  ON public.draw_simulations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- ============================================================================
-- DRAW_ENTRIES TABLE
-- ============================================================================
-- User entries in monthly draws

CREATE TABLE IF NOT EXISTS public.draw_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  draw_id UUID REFERENCES public.draws(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  score_id UUID REFERENCES public.golf_scores(id) ON DELETE CASCADE NOT NULL,
  entry_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_eligible BOOLEAN DEFAULT TRUE,
  ineligible_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(draw_id, user_id, score_id)
);

-- Enable RLS
ALTER TABLE public.draw_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own entries"
  ON public.draw_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Entries are automatically created"
  ON public.draw_entries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all entries"
  ON public.draw_entries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Indexes
CREATE INDEX idx_draw_entries_draw_id ON public.draw_entries(draw_id);
CREATE INDEX idx_draw_entries_user_id ON public.draw_entries(user_id);
CREATE INDEX idx_draw_entries_is_eligible ON public.draw_entries(is_eligible);

-- ============================================================================
-- DRAW_RESULTS TABLE
-- ============================================================================
-- Results of completed draws

CREATE TABLE IF NOT EXISTS public.draw_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  draw_id UUID REFERENCES public.draws(id) ON DELETE CASCADE NOT NULL UNIQUE,
  first_place_entry_id UUID REFERENCES public.draw_entries(id),
  second_place_entry_id UUID REFERENCES public.draw_entries(id),
  third_place_entry_id UUID REFERENCES public.draw_entries(id),
  first_prize_amount DECIMAL(12, 2),
  second_prize_amount DECIMAL(12, 2),
  third_prize_amount DECIMAL(12, 2),
  total_entries INTEGER NOT NULL,
  draw_algorithm TEXT NOT NULL DEFAULT 'random',
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.draw_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Results are viewable by everyone"
  ON public.draw_results FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage results"
  ON public.draw_results FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- ============================================================================
-- WINNERS TABLE
-- ============================================================================
-- Prize winners and their details

CREATE TABLE IF NOT EXISTS public.winners (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  draw_id UUID REFERENCES public.draws(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  entry_id UUID REFERENCES public.draw_entries(id) ON DELETE CASCADE NOT NULL,
  position INTEGER NOT NULL CHECK (position IN (1, 2, 3)),
  prize_amount DECIMAL(12, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'claimed', 'paid', 'expired')),
  claimed_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  payment_method TEXT,
  payment_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(draw_id, position)
);

-- Enable RLS
ALTER TABLE public.winners ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Winners can view their own wins"
  ON public.winners FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "All winners are viewable by everyone"
  ON public.winners FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage winners"
  ON public.winners FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Indexes
CREATE INDEX idx_winners_draw_id ON public.winners(draw_id);
CREATE INDEX idx_winners_user_id ON public.winners(user_id);
CREATE INDEX idx_winners_status ON public.winners(status);

-- ============================================================================
-- WINNER_PROOFS TABLE
-- ============================================================================
-- Verification proofs for winners

CREATE TABLE IF NOT EXISTS public.winner_proofs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  winner_id UUID REFERENCES public.winners(id) ON DELETE CASCADE NOT NULL,
  proof_type TEXT NOT NULL CHECK (proof_type IN ('id_document', 'bank_details', 'address_proof', 'other')),
  file_url TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES public.profiles(id),
  verified_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.winner_proofs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Winners can view their own proofs"
  ON public.winner_proofs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.winners
      WHERE winners.id = winner_proofs.winner_id AND winners.user_id = auth.uid()
    )
  );

CREATE POLICY "Winners can submit proofs"
  ON public.winner_proofs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.winners
      WHERE winners.id = winner_proofs.winner_id AND winners.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage proofs"
  ON public.winner_proofs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- ============================================================================
-- PAYOUTS TABLE
-- ============================================================================
-- Tracks prize payouts to winners

CREATE TABLE IF NOT EXISTS public.payouts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  winner_id UUID REFERENCES public.winners(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  payment_method TEXT NOT NULL,
  payment_provider TEXT NOT NULL,
  provider_transaction_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  initiated_by UUID REFERENCES public.profiles(id) NOT NULL,
  initiated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  failed_reason TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Winners can view their own payouts"
  ON public.payouts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.winners
      WHERE winners.id = payouts.winner_id AND winners.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage payouts"
  ON public.payouts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Index
CREATE INDEX idx_payouts_winner_id ON public.payouts(winner_id);
CREATE INDEX idx_payouts_status ON public.payouts(status);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function: Handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    'subscriber'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_subscriptions
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_golf_scores
  BEFORE UPDATE ON public.golf_scores
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_charities
  BEFORE UPDATE ON public.charities
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_charity_events
  BEFORE UPDATE ON public.charity_events
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_charity_selections
  BEFORE UPDATE ON public.charity_selections
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_draw_settings
  BEFORE UPDATE ON public.draw_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_draws
  BEFORE UPDATE ON public.draws
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_winners
  BEFORE UPDATE ON public.winners
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- SEED DATA (Optional - for testing)
-- ============================================================================

-- Insert sample charities
INSERT INTO public.charities (name, description, category, logo_url, website_url)
VALUES
  ('Save the Children India', 'Working to improve the lives of children across India through education, healthcare, and emergency response.', 'Children', 'https://placehold.co/200x200/3b82f6/white?text=STC', 'https://www.savethechildren.in'),
  ('Akshaya Patra Foundation', 'Providing mid-day meals to school children to fight hunger and promote education.', 'Education', 'https://placehold.co/200x200/10b981/white?text=APF', 'https://www.akshayapatra.org'),
  ('CRY - Child Rights and You', 'Ensuring every child has a happy, healthy, and creative childhood.', 'Children', 'https://placehold.co/200x200/f59e0b/white?text=CRY', 'https://www.cry.org'),
  ('Pratham Education Foundation', 'Innovative learning programs to improve quality of education for underprivileged children.', 'Education', 'https://placehold.co/200x200/8b5cf6/white?text=PEF', 'https://www.pratham.org'),
  ('GiveIndia', 'Indias largest and most trusted giving platform connecting donors with verified nonprofits.', 'Multiple', 'https://placehold.co/200x200/ec4899/white?text=GI', 'https://www.giveindia.org')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- COMPLETION
-- ============================================================================
-- Schema setup complete!
-- Next steps:
-- 1. Verify all tables were created: Check Supabase Table Editor
-- 2. Test RLS policies with different user roles
-- 3. Verify triggers are working by creating a new user
-- ============================================================================
