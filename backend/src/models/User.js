import { createClient } from '@supabase/supabase-js'
import config from '../config/index.js'

const supabase = createClient(config.supabase.url, config.supabase.serviceKey, {
  auth: { persistSession: false },
})

export const User = {
  async findByEmail(email) {
    const { data, error } = await supabase.from('users').select('*').eq('email', email).eq('is_active', true).maybeSingle()
    if (error) throw error
    return data
  },

  async findById(id) {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return data
  },

  async updateLastLogin(id) {
    await supabase.from('users').update({ last_login: new Date().toISOString() }).eq('id', id)
  },
}

export default User
