import { createClient } from "@supabase/supabase-js"

const supabaseUrl = 'https://axqvjvdshchyuyuyshdz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4cXZqdmRzaGNoeXV5dXlzaGR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0NzYxODYsImV4cCI6MjA1NjA1MjE4Nn0.SSMZf-vjhIqi2YMErj4-r0RRWsRFeMq7i9Nis-P43t4'

export const supabase = createClient(supabaseUrl, supabaseKey)