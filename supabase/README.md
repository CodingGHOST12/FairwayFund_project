# FairwayFund Supabase Database Setup Guide

## 📋 Overview

Complete SQL schema for FairwayFund including:
- ✅ 18 Tables with proper relationships
- ✅ Row Level Security (RLS) policies
- ✅ Automated triggers
- ✅ Indexes for performance
- ✅ Sample seed data

---

## 🚀 Quick Deployment

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `lioemvybzvrnoblshkrc`
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run the Schema

1. Open the file: `supabase/schema.sql`
2. Copy the entire contents
3. Paste into the Supabase SQL Editor
4. Click **RUN** button (or press Ctrl/Cmd + Enter)
5. Wait for execution to complete (~10-30 seconds)

### Step 3: Verify Setup

Check the following in Supabase Dashboard:

**Table Editor:**
- [ ] 18 tables created
- [ ] Sample charities inserted

**Authentication:**
- [ ] Trigger `on_auth_user_created` exists
- [ ] Function `handle_new_user()` exists

---

## 📊 Database Schema

### Core Tables

#### 1. **profiles**
- Extends auth.users
- Stores user name, role, avatar
- Auto-created on signup via trigger

#### 2. **subscriptions**
- Monthly/yearly plans
- Payment provider integration
- Status tracking

#### 3. **golf_scores**
- User golf scores
- Verification system
- Score history

### Charity System

#### 4. **charities**
- Registered charities
- Active/inactive status
- Total donations tracking

#### 5. **charity_events**
- Campaigns and events
- Goal tracking

#### 6. **charity_selections**
- User's charity preferences
- Percentage allocation

#### 7. **charity_contributions**
- Monthly subscription contributions
- Contribution history

#### 8. **independent_donations**
- One-time donations
- Anonymous option

### Prize Draw System

#### 9. **draw_settings**
- Global draw configuration
- Prize pool percentages

#### 10. **draws**
- Monthly draws
- Prize amounts
- Draw status

#### 11. **draw_entries**
- User entries per draw
- Eligibility tracking

#### 12. **draw_results**
- Draw outcomes
- Winner positions

#### 13. **draw_simulations**
- Test simulations

#### 14. **winners**
- Prize winners
- Claim status

#### 15. **winner_proofs**
- ID verification
- Document uploads

#### 16. **payouts**
- Prize payments
- Transaction tracking

---

## 🔒 Row Level Security (RLS)

All tables have RLS enabled with policies:

### User Policies
- ✅ Users can view their own data
- ✅ Users can create their own records
- ✅ Users can update their unverified records

### Admin Policies
- ✅ Admins can view all data
- ✅ Admins can manage all records
- ✅ Admins can verify scores/documents

### Public Policies
- ✅ Active charities viewable by all
- ✅ Draw results viewable by all
- ✅ Winners viewable by all

---

## ⚙️ Automated Triggers

### 1. New User Trigger
```sql
on_auth_user_created
```
**What it does:**
- Automatically creates profile when user signs up
- Extracts name from user_metadata
- Sets default role as 'subscriber'

**Test:**
```typescript
// Sign up a new user
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'password123',
  options: {
    data: { name: 'Test User' }
  }
})

// Profile should be auto-created in public.profiles
```

### 2. Updated_at Triggers
**Applied to tables:**
- profiles
- subscriptions
- golf_scores
- charities
- charity_events
- charity_selections
- draw_settings
- draws
- winners

**What it does:**
- Automatically updates `updated_at` timestamp on every UPDATE

---

## 📈 Indexes for Performance

**User lookups:**
- `idx_subscriptions_user_id`
- `idx_golf_scores_user_id`
- `idx_charity_selections_user_id`
- `idx_draw_entries_user_id`
- `idx_winners_user_id`

**Status filtering:**
- `idx_subscriptions_status`
- `idx_draws_status`
- `idx_winners_status`
- `idx_charities_is_active`

**Date queries:**
- `idx_golf_scores_date_played`
- `idx_charity_contributions_date`
- `idx_draws_year_month`

---

## 🌱 Seed Data

The schema includes 5 sample charities:
1. Save the Children India
2. Akshaya Patra Foundation
3. CRY - Child Rights and You
4. Pratham Education Foundation
5. GiveIndia

---

## 🧪 Testing the Setup

### Test 1: Create User Profile

```sql
-- Should see new profile after signup
SELECT * FROM public.profiles WHERE email = 'test@example.com';
```

### Test 2: Check RLS Policies

```sql
-- As authenticated user (should work)
SELECT * FROM public.golf_scores WHERE user_id = auth.uid();

-- As anonymous (should fail)
SELECT * FROM public.golf_scores;
```

### Test 3: Verify Triggers

```sql
-- Check if trigger exists
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND trigger_name = 'on_auth_user_created';
```

### Test 4: Query Charities

```sql
-- Should return 5 charities
SELECT id, name, category FROM public.charities WHERE is_active = true;
```

---

## 🔧 Common Operations

### Create Admin User

```sql
-- After user signs up, promote to admin
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@fairwayfund.com';
```

### Check User's Active Subscription

```sql
SELECT s.*, p.name, p.email
FROM public.subscriptions s
JOIN public.profiles p ON p.id = s.user_id
WHERE s.status = 'active'
ORDER BY s.created_at DESC;
```

### Get Monthly Draw Entries

```sql
SELECT 
  de.id,
  p.name as user_name,
  gs.score,
  gs.course_name,
  d.month,
  d.year
FROM public.draw_entries de
JOIN public.profiles p ON p.id = de.user_id
JOIN public.golf_scores gs ON gs.id = de.score_id
JOIN public.draws d ON d.id = de.draw_id
WHERE d.month = 9 AND d.year = 2026;
```

### Total Charity Contributions

```sql
SELECT 
  c.name,
  SUM(cc.amount) as total_contributions,
  COUNT(DISTINCT cc.user_id) as unique_donors
FROM public.charities c
LEFT JOIN public.charity_contributions cc ON cc.charity_id = c.id
WHERE cc.status = 'completed'
GROUP BY c.id, c.name
ORDER BY total_contributions DESC;
```

---

## 🐛 Troubleshooting

### Issue: Trigger not creating profile

**Solution:**
```sql
-- Check if function exists
SELECT routine_name FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Issue: RLS blocking queries

**Solution:**
```sql
-- Temporarily disable RLS for testing (NOT for production!)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Re-enable after testing
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

### Issue: Foreign key constraint errors

**Solution:**
```sql
-- Check if referenced record exists
SELECT id FROM public.profiles WHERE id = 'user-id-here';

-- Or temporarily disable constraints (NOT recommended)
SET CONSTRAINTS ALL DEFERRED;
```

---

## 📝 Next Steps

1. ✅ Run `supabase/schema.sql` in SQL Editor
2. ✅ Verify tables in Table Editor
3. ✅ Test signup to confirm profile creation
4. ✅ Create admin user for testing
5. ✅ Update application environment variables
6. ✅ Deploy application to production
7. ✅ Test complete user flow

---

## 🔐 Security Notes

- ✅ All tables have RLS enabled
- ✅ Service role key required for admin operations
- ✅ User data isolated by auth.uid()
- ✅ Admin role required for sensitive operations
- ⚠️ Never expose `SUPABASE_SERVICE_ROLE_KEY` to client
- ⚠️ Always use `NEXT_PUBLIC_SUPABASE_ANON_KEY` for client

---

## 📞 Support

If you encounter issues:

1. Check Supabase Logs: Dashboard → Logs
2. Verify RLS policies: Dashboard → Authentication → Policies
3. Test with SQL Editor
4. Check function execution in Database → Functions

---

**Schema Version:** 1.0.0  
**Last Updated:** 2026-09-23  
**Compatible with:** Supabase PostgreSQL 15+
