require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

console.log("URL =", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log(
  "Service Key Loaded =",
  process.env.SUPABASE_SERVICE_ROLE_KEY ? "YES" : "NO"
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

module.exports = supabase;