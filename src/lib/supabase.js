import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hrrnhkjotkhgfwzluxhx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhycm5oa2pvdGtoZ2Z3emx1eGh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NTM4OTMsImV4cCI6MjA3NzUyOTg5M30.sW8psPJSI_Y713cMt1NuC9gCMlMrfOWJqN8bPGVfjosKEY';

export const supabase = createClient(supabaseUrl, supabaseKey);
