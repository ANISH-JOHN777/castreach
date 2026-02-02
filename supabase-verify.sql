-- ============================================
-- CASTREACH - SUPABASE VERIFICATION SCRIPT
-- Run this to check your database setup
-- ============================================

-- Check if all tables exist
SELECT 
    'Tables Check' as check_type,
    COUNT(*) as count,
    CASE 
        WHEN COUNT(*) >= 13 THEN '✅ All tables exist'
        ELSE '❌ Missing tables'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name IN (
    'profiles', 'bookings', 'messages', 'reviews', 
    'notifications', 'availability', 'payments', 'matches',
    'profile_views', 'calendar_integrations', 
    'notification_preferences', 'verifications'
);

-- Check RLS is enabled
SELECT 
    'RLS Check' as check_type,
    COUNT(*) as tables_with_rls,
    CASE 
        WHEN COUNT(*) >= 12 THEN '✅ RLS enabled'
        ELSE '❌ RLS not fully enabled'
    END as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true;

-- Check storage buckets
SELECT 
    'Storage Check' as check_type,
    COUNT(*) as bucket_count,
    CASE 
        WHEN COUNT(*) >= 4 THEN '✅ Storage configured'
        ELSE '❌ Missing storage buckets'
    END as status
FROM storage.buckets;

-- List all tables
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check if profiles table has correct structure
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- Check existing users/profiles
SELECT 
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN role = 'host' THEN 1 END) as hosts,
    COUNT(CASE WHEN role = 'guest' THEN 1 END) as guests,
    COUNT(CASE WHEN verified = true THEN 1 END) as verified_users
FROM profiles;

-- Check storage buckets detail
SELECT 
    id,
    name,
    public,
    created_at
FROM storage.buckets
ORDER BY name;

-- Check functions
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN (
    'update_updated_at_column',
    'handle_new_user',
    'calculate_avg_rating',
    'update_profile_stats',
    'increment_profile_views',
    'calculate_match_score'
)
ORDER BY routine_name;

-- Summary
SELECT 
    '=== SETUP SUMMARY ===' as summary,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public') as total_tables,
    (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = true) as tables_with_rls,
    (SELECT COUNT(*) FROM storage.buckets) as storage_buckets,
    (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public') as functions,
    (SELECT COUNT(*) FROM profiles) as total_users;
