import { createClient } from '@supabase/supabase-js'

/**
 * Initialize Supabase client
 */
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }
  
  return createClient(supabaseUrl, supabaseKey)
}

/**
 * Soft Delete - Mark record as deleted without removing from database
 */
export async function softDelete(
  table: string,
  id: string | number
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseClient()
    
    const { error } = await supabase
      .from(table)
      .update({ 
        deleted_at: new Date().toISOString(),
        status: 'deleted'
      })
      .eq('id', id)

    if (error) {
      console.error('Soft delete error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Soft delete exception:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Bulk Soft Delete - Mark multiple records as deleted
 */
export async function bulkSoftDelete(
  table: string,
  ids: (string | number)[]
): Promise<{ success: boolean; deleted: number; error?: string }> {
  try {
    const supabase = getSupabaseClient()
    
    const { error, data } = await supabase
      .from(table)
      .update({ 
        deleted_at: new Date().toISOString(),
        status: 'deleted'
      })
      .in('id', ids)
      .select('id')

    if (error) {
      console.error('Bulk soft delete error:', error)
      return { success: false, deleted: 0, error: error.message }
    }

    return { success: true, deleted: data?.length || 0 }
  } catch (error) {
    console.error('Bulk soft delete exception:', error)
    return { 
      success: false, 
      deleted: 0,
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Restore - Undelete a soft-deleted record
 */
export async function restoreDeleted(
  table: string,
  id: string | number
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseClient()
    
    const { error } = await supabase
      .from(table)
      .update({ 
        deleted_at: null,
        status: 'published'
      })
      .eq('id', id)

    if (error) {
      console.error('Restore error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Restore exception:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Permanent Delete - Actually remove record from database
 * Use with caution!
 */
export async function permanentDelete(
  table: string,
  id: string | number
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseClient()
    
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Permanent delete error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Permanent delete exception:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Bulk Update - Update multiple records with same values
 */
export async function bulkUpdate(
  table: string,
  ids: (string | number)[],
  updates: Record<string, any>
): Promise<{ success: boolean; updated: number; error?: string }> {
  try {
    const supabase = getSupabaseClient()
    
    const { error, data } = await supabase
      .from(table)
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .in('id', ids)
      .select('id')

    if (error) {
      console.error('Bulk update error:', error)
      return { success: false, updated: 0, error: error.message }
    }

    return { success: true, updated: data?.length || 0 }
  } catch (error) {
    console.error('Bulk update exception:', error)
    return { 
      success: false, 
      updated: 0,
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Get record with soft delete check
 */
export async function getRecord<T>(
  table: string,
  id: string | number,
  includeDeleted = false
): Promise<{ data: T | null; error?: string }> {
  try {
    const supabase = getSupabaseClient()
    
    let query = supabase
      .from(table)
      .select('*')
      .eq('id', id)

    if (!includeDeleted) {
      query = query.is('deleted_at', null)
    }

    const { data, error } = await query.single()

    if (error) {
      console.error('Get record error:', error)
      return { data: null, error: error.message }
    }

    return { data: data as T }
  } catch (error) {
    console.error('Get record exception:', error)
    return { 
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * List records with pagination and soft delete filtering
 */
export async function listRecords<T>(
  table: string,
  options: {
    page?: number
    pageSize?: number
    includeDeleted?: boolean
    orderBy?: string
    orderDirection?: 'asc' | 'desc'
    filters?: Record<string, any>
  } = {}
): Promise<{ 
  data: T[]
  total: number
  page: number
  pageSize: number
  error?: string 
}> {
  try {
    const {
      page = 1,
      pageSize = 20,
      includeDeleted = false,
      orderBy = 'created_at',
      orderDirection = 'desc',
      filters = {}
    } = options

    const supabase = getSupabaseClient()
    
    let query = supabase
      .from(table)
      .select('*', { count: 'exact' })

    // Apply soft delete filter
    if (!includeDeleted) {
      query = query.is('deleted_at', null)
    }

    // Apply custom filters
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value)
    })

    // Apply ordering
    query = query.order(orderBy, { ascending: orderDirection === 'asc' })

    // Apply pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('List records error:', error)
      return { 
        data: [], 
        total: 0, 
        page, 
        pageSize, 
        error: error.message 
      }
    }

    return {
      data: (data as T[]) || [],
      total: count || 0,
      page,
      pageSize
    }
  } catch (error) {
    console.error('List records exception:', error)
    return { 
      data: [], 
      total: 0, 
      page: options.page || 1, 
      pageSize: options.pageSize || 20,
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Create a new record
 */
export async function createRecord<T>(
  table: string,
  data: Omit<T, 'id' | 'created_at' | 'updated_at'>
): Promise<{ data: T | null; error?: string }> {
  try {
    const supabase = getSupabaseClient()
    
    const { data: record, error } = await supabase
      .from(table)
      .insert([{
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      console.error('Create record error:', error)
      return { data: null, error: error.message }
    }

    return { data: record as T }
  } catch (error) {
    console.error('Create record exception:', error)
    return { 
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Update a record
 */
export async function updateRecord<T>(
  table: string,
  id: string | number,
  updates: Partial<T>
): Promise<{ data: T | null; error?: string }> {
  try {
    const supabase = getSupabaseClient()
    
    const { data, error } = await supabase
      .from(table)
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update record error:', error)
      return { data: null, error: error.message }
    }

    return { data: data as T }
  } catch (error) {
    console.error('Update record exception:', error)
    return { 
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}
