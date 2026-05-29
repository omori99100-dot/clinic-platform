import { createClient } from '@supabase/supabase-js'
import config from './index.js'

const supabase = createClient(config.supabase.url, config.supabase.serviceKey, {
  auth: { persistSession: false },
  db: { schema: 'public' },
})

export async function query(sql, params) {
  throw new Error('Direct SQL queries not supported. Use db helpers instead.')
}

export async function findOne(table, filters) {
  let q = supabase.from(table).select('*').maybeSingle()
  for (const [col, val] of Object.entries(filters)) {
    q = q.eq(col, val)
  }
  const { data, error } = await q
  if (error) throw error
  return data
}

export async function findById(table, id) {
  const { data, error } = await supabase.from(table).select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data
}

export async function findAll(table, { select = '*', filters = {}, order, range } = {}) {
  let q = supabase.from(table).select(select, { count: 'exact' })
  for (const [col, val] of Object.entries(filters)) {
    if (val !== undefined && val !== null && val !== '') {
      q = q.eq(col, val)
    }
  }
  if (order) q = q.order(order.by, { ascending: order.ascending ?? false })
  if (range) q = q.range(range.from, range.to)
  const { data, error, count } = await q
  if (error) throw error
  return { rows: data, count }
}

export async function insertOne(table, data) {
  const { data: inserted, error } = await supabase.from(table).insert(data).select('*').maybeSingle()
  if (error) throw error
  return inserted
}

export async function updateOne(table, id, data) {
  const { data: updated, error } = await supabase.from(table).update(data).eq('id', id).select('*').maybeSingle()
  if (error) throw error
  return updated
}

export async function deleteOne(table, id) {
  const { data: deleted, error } = await supabase.from(table).delete().eq('id', id).select('*').maybeSingle()
  if (error) throw error
  return deleted
}

export async function countRows(table, filters = {}) {
  let q = supabase.from(table).select('*', { count: 'exact', head: true })
  for (const [col, val] of Object.entries(filters)) {
    if (val !== undefined && val !== null && val !== '') {
      q = q.eq(col, val)
    }
  }
  const { error, count } = await q
  if (error) throw error
  return count
}

export async function callRpc(name, params = {}) {
  const { data, error } = await supabase.rpc(name, params)
  if (error) throw error
  return data
}

export default supabase
