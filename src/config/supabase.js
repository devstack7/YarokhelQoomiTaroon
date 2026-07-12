import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://jcjcsalrigithndwqfkb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjamNzYWxyaWdpdGhuZHdxZmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2MjQ2NjUsImV4cCI6MjA5ODIwMDY2NX0.4dqzsIV2LqCsBzdg-VbxdJ1GNTlvjnSwK0m_yAd5uhU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
