const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const isSupabaseEnabled = Boolean(supabaseUrl && supabaseServiceRoleKey);

const supabase = isSupabaseEnabled
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;

module.exports = {
  supabase,
  isSupabaseEnabled
};
