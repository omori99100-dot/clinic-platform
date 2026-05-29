import { createClient } from '@supabase/supabase-js'
import config from '../config/index.js'

const supabase = createClient(config.supabase.url, config.supabase.serviceKey, {
  auth: { persistSession: false },
})

export const Log = {
  async create(data) {
    const { data: inserted, error } = await supabase.from('logs').insert(data).select('*').maybeSingle()
    if (error) throw error
    return inserted
  },
}

export default Log
