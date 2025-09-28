import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

// Vérification de la lecture des variables d'environnement Supabase
console.log("[SUPABASE] URL:", process.env.SUPABASE_URL);
console.log("[SUPABASE] ANON_KEY:", process.env.SUPABASE_ANON_KEY ? process.env.SUPABASE_ANON_KEY.substring(0, 10) + "..." : "undefined");

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

// Créer le client Supabase
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
