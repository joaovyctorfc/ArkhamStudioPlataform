
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xslawmuheuqjwqdtusng.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzbGF3bXVoZXVxandxZHR1c25nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMjEyNjksImV4cCI6MjA3MTc5NzI2OX0.OxYIeEvikSNxzHhuGZCfH_5JFdUTZpwaaCLqLlA9neI';

export const supabase = createClient(supabaseUrl, supabaseKey);
