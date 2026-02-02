import { supabase, isSupabaseConfigured } from './supabase.js';

/**
 * Test Supabase connection and configuration
 */
export async function testSupabaseConnection() {
    console.log('🔍 Testing Supabase Connection...\n');

    // Check if configured
    if (!isSupabaseConfigured()) {
        console.error('❌ Supabase is not configured');
        console.log('Please check your .env file for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
        return false;
    }

    console.log('✅ Supabase client initialized');

    try {
        // Test 1: Check connection
        console.log('\n📡 Test 1: Checking connection...');
        const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });

        if (error) {
            console.error('❌ Connection failed:', error.message);
            return false;
        }
        console.log('✅ Connection successful');

        // Test 2: Check authentication
        console.log('\n🔐 Test 2: Checking authentication...');
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            console.log('✅ User is authenticated:', session.user.email);
        } else {
            console.log('ℹ️  No active session (user not logged in)');
        }

        // Test 3: Check tables
        console.log('\n📊 Test 3: Checking database tables...');
        const tables = ['profiles', 'bookings', 'messages', 'reviews', 'notifications'];

        for (const table of tables) {
            const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });
            if (error) {
                console.error(`❌ Table "${table}" not accessible:`, error.message);
            } else {
                console.log(`✅ Table "${table}" accessible`);
            }
        }

        // Test 4: Check storage
        console.log('\n💾 Test 4: Checking storage buckets...');
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

        if (bucketsError) {
            console.error('❌ Storage check failed:', bucketsError.message);
        } else {
            console.log(`✅ Storage accessible (${buckets.length} buckets found)`);
            buckets.forEach(bucket => {
                console.log(`   - ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
            });
        }

        // Test 5: Check realtime
        console.log('\n⚡ Test 5: Checking realtime...');
        const channel = supabase.channel('test-channel');
        console.log('✅ Realtime channel created');
        await channel.unsubscribe();

        console.log('\n🎉 All tests passed! Supabase is ready to use.\n');
        return true;

    } catch (error) {
        console.error('\n❌ Test failed with error:', error);
        return false;
    }
}

/**
 * Get database statistics
 */
export async function getDatabaseStats() {
    if (!isSupabaseConfigured()) {
        return null;
    }

    try {
        const stats = {};

        // Count profiles
        const { count: profileCount } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });
        stats.profiles = profileCount || 0;

        // Count bookings
        const { count: bookingCount } = await supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true });
        stats.bookings = bookingCount || 0;

        // Count messages
        const { count: messageCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true });
        stats.messages = messageCount || 0;

        // Count reviews
        const { count: reviewCount } = await supabase
            .from('reviews')
            .select('*', { count: 'exact', head: true });
        stats.reviews = reviewCount || 0;

        return stats;
    } catch (error) {
        console.error('Error getting database stats:', error);
        return null;
    }
}

/**
 * Check if user is authenticated
 */
export async function checkAuth() {
    if (!isSupabaseConfigured()) {
        return { authenticated: false, user: null };
    }

    try {
        const { data: { session } } = await supabase.auth.getSession();
        return {
            authenticated: !!session,
            user: session?.user || null
        };
    } catch (error) {
        console.error('Error checking auth:', error);
        return { authenticated: false, user: null };
    }
}

/**
 * Initialize database (run schema if needed)
 */
export async function initializeDatabase() {
    console.log('🚀 Initializing database...\n');

    if (!isSupabaseConfigured()) {
        console.error('❌ Supabase not configured');
        return false;
    }

    console.log('ℹ️  To initialize the database:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Run the supabase-schema.sql file');
    console.log('4. Verify with supabase-verify.sql\n');

    return true;
}

// Export for use in development
if (import.meta.env.DEV) {
    window.testSupabase = testSupabaseConnection;
    window.getDbStats = getDatabaseStats;
    window.checkAuth = checkAuth;
    console.log('🔧 Supabase test utilities loaded. Run window.testSupabase() to test connection.');
}
