/**
 * SUPABASE CONFIGURATION
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://supabase.com and create a free account
 * 2. Create a new project (choose any region)
 * 3. In your Supabase dashboard, go to Settings > API
 * 4. Copy your Project URL and paste it below as SUPABASE_URL
 * 5. Copy your anon/publishable key and paste it below as SUPABASE_ANON_KEY
 * 6. NEVER share your service_role_key or database_password!
 * 
 * WARNING: Only use anon/publishable key in frontend code!
 */

const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL'; // e.g., https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // e.g., eyJhbGc...

// Initialize Supabase Client
const { createClient } = supabase;

let supabaseClient = null;

function initSupabase() {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY || 
        SUPABASE_URL === 'YOUR_SUPABASE_PROJECT_URL' || 
        SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY') {
        console.error('❌ Supabase not configured. Please update SUPABASE_URL and SUPABASE_ANON_KEY in supabase.js');
        return null;
    }

    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase initialized successfully');
    return supabaseClient;
}

function getSupabaseClient() {
    if (!supabaseClient) {
        supabaseClient = initSupabase();
    }
    return supabaseClient;
}

// Receipt Database Functions
async function addReceipt(receiptData) {
    const client = getSupabaseClient();
    if (!client) {
        throw new Error('Supabase is not configured');
    }

    const { data, error } = await client
        .from('receipts')
        .insert([receiptData])
        .select();

    if (error) {
        console.error('Error adding receipt:', error);
        throw error;
    }
    return data[0];
}

async function getReceipts(filters = {}) {
    const client = getSupabaseClient();
    if (!client) {
        throw new Error('Supabase is not configured');
    }

    let query = client
        .from('receipts')
        .select('*');

    // Apply filters
    if (filters.fromDate) {
        query = query.gte('receipt_date', filters.fromDate);
    }
    if (filters.toDate) {
        query = query.lte('receipt_date', filters.toDate);
    }
    if (filters.category) {
        query = query.eq('category', filters.category);
    }
    if (filters.searchText) {
        query = query.or(`details.ilike.%${filters.searchText}%,category.ilike.%${filters.searchText}%`);
    }

    // Order by date descending
    query = query.order('receipt_date', { ascending: false });

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching receipts:', error);
        throw error;
    }
    return data || [];
}

async function getReceiptById(id) {
    const client = getSupabaseClient();
    if (!client) {
        throw new Error('Supabase is not configured');
    }

    const { data, error } = await client
        .from('receipts')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching receipt:', error);
        throw error;
    }
    return data;
}

async function updateReceipt(id, receiptData) {
    const client = getSupabaseClient();
    if (!client) {
        throw new Error('Supabase is not configured');
    }

    const { data, error } = await client
        .from('receipts')
        .update(receiptData)
        .eq('id', id)
        .select();

    if (error) {
        console.error('Error updating receipt:', error);
        throw error;
    }
    return data[0];
}

async function deleteReceipt(id) {
    const client = getSupabaseClient();
    if (!client) {
        throw new Error('Supabase is not configured');
    }

    const { error } = await client
        .from('receipts')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting receipt:', error);
        throw error;
    }
}

// Storage Functions
async function uploadReceiptImage(file, folder = 'receipts') {
    const client = getSupabaseClient();
    if (!client) {
        throw new Error('Supabase is not configured');
    }

    // Create unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}-${randomStr}.${extension}`;

    // Create date-based path
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const filepath = `${folder}/${year}/${month}/${filename}`;

    const { data, error } = await client.storage
        .from('receipts')
        .upload(filepath, file);

    if (error) {
        console.error('Error uploading image:', error);
        throw error;
    }

    // Get public URL
    const { data: publicUrlData } = client.storage
        .from('receipts')
        .getPublicUrl(filepath);

    return {
        path: filepath,
        url: publicUrlData.publicUrl
    };
}

async function deleteReceiptImage(filepath) {
    const client = getSupabaseClient();
    if (!client) {
        throw new Error('Supabase is not configured');
    }

    if (!filepath) return;

    const { error } = await client.storage
        .from('receipts')
        .remove([filepath]);

    if (error) {
        console.error('Error deleting image:', error);
        // Don't throw - this is not critical
    }
}

// Analytics Functions
async function getTotalExpenses() {
    const client = getSupabaseClient();
    if (!client) {
        throw new Error('Supabase is not configured');
    }

    const { data, error } = await client
        .from('receipts')
        .select('amount');

    if (error) {
        console.error('Error fetching total:', error);
        return 0;
    }

    return (data || []).reduce((sum, receipt) => sum + (parseFloat(receipt.amount) || 0), 0);
}

async function getMonthlyExpenses(year, month) {
    const client = getSupabaseClient();
    if (!client) {
        throw new Error('Supabase is not configured');
    }

    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0); // Last day of month
    const endDateStr = `${year}-${String(month).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;

    const { data, error } = await client
        .from('receipts')
        .select('amount')
        .gte('receipt_date', startDate)
        .lte('receipt_date', endDateStr);

    if (error) {
        console.error('Error fetching monthly expenses:', error);
        return 0;
    }

    return (data || []).reduce((sum, receipt) => sum + (parseFloat(receipt.amount) || 0), 0);
}

async function getExpensesByCategory() {
    const client = getSupabaseClient();
    if (!client) {
        throw new Error('Supabase is not configured');
    }

    const { data, error } = await client
        .from('receipts')
        .select('category, amount');

    if (error) {
        console.error('Error fetching expenses by category:', error);
        return {};
    }

    const summary = {};
    (data || []).forEach(receipt => {
        const category = receipt.category || 'Other';
        if (!summary[category]) {
            summary[category] = { total: 0, count: 0 };
        }
        summary[category].total += parseFloat(receipt.amount) || 0;
        summary[category].count += 1;
    });

    return summary;
}

async function getReceiptCount() {
    const client = getSupabaseClient();
    if (!client) {
        throw new Error('Supabase is not configured');
    }

    const { count, error } = await client
        .from('receipts')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('Error fetching receipt count:', error);
        return 0;
    }

    return count || 0;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initSupabase();
});