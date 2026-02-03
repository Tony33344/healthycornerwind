/**
 * Undo System with 5-minute window
 * Allows reverting changes within a time limit
 */

interface UndoAction {
  id: string
  type: 'create' | 'update' | 'delete'
  table: string
  recordId: string | number
  previousState: any
  currentState: any
  timestamp: number
}

class UndoManager {
  private actions: UndoAction[] = []
  private readonly MAX_AGE_MS = 5 * 60 * 1000 // 5 minutes
  private readonly MAX_ACTIONS = 50 // Keep last 50 actions

  /**
   * Record an action that can be undone
   */
  recordAction(action: Omit<UndoAction, 'id' | 'timestamp'>): string {
    // Clean up old actions
    this.cleanup()

    const undoAction: UndoAction = {
      ...action,
      id: `undo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    }

    this.actions.push(undoAction)

    // Keep only the most recent actions
    if (this.actions.length > this.MAX_ACTIONS) {
      this.actions = this.actions.slice(-this.MAX_ACTIONS)
    }

    return undoAction.id
  }

  /**
   * Get all available undo actions (within time window)
   */
  getAvailableActions(): UndoAction[] {
    this.cleanup()
    return [...this.actions].reverse() // Most recent first
  }

  /**
   * Get a specific action by ID
   */
  getAction(id: string): UndoAction | null {
    return this.actions.find(a => a.id === id) || null
  }

  /**
   * Check if an action can still be undone
   */
  canUndo(id: string): boolean {
    const action = this.getAction(id)
    if (!action) return false

    const age = Date.now() - action.timestamp
    return age <= this.MAX_AGE_MS
  }

  /**
   * Remove an action (after successful undo)
   */
  removeAction(id: string): void {
    this.actions = this.actions.filter(a => a.id !== id)
  }

  /**
   * Clear all actions
   */
  clear(): void {
    this.actions = []
  }

  /**
   * Clean up expired actions
   */
  private cleanup(): void {
    const now = Date.now()
    this.actions = this.actions.filter(a => {
      const age = now - a.timestamp
      return age <= this.MAX_AGE_MS
    })
  }

  /**
   * Get time remaining for an action (in seconds)
   */
  getTimeRemaining(id: string): number {
    const action = this.getAction(id)
    if (!action) return 0

    const age = Date.now() - action.timestamp
    const remaining = this.MAX_AGE_MS - age
    return Math.max(0, Math.floor(remaining / 1000))
  }
}

// Singleton instance
const undoManager = new UndoManager()

export { undoManager }
export type { UndoAction }

/**
 * React hook for undo functionality
 */
export function useUndo() {
  const recordAction = (action: Omit<UndoAction, 'id' | 'timestamp'>) => {
    return undoManager.recordAction(action)
  }

  const getAvailableActions = () => {
    return undoManager.getAvailableActions()
  }

  const canUndo = (id: string) => {
    return undoManager.canUndo(id)
  }

  const getTimeRemaining = (id: string) => {
    return undoManager.getTimeRemaining(id)
  }

  const removeAction = (id: string) => {
    undoManager.removeAction(id)
  }

  return {
    recordAction,
    getAvailableActions,
    canUndo,
    getTimeRemaining,
    removeAction
  }
}

/**
 * Undo a create action (delete the record)
 */
export async function undoCreate(
  action: UndoAction,
  supabase: any
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from(action.table)
      .delete()
      .eq('id', action.recordId)

    if (error) throw error

    undoManager.removeAction(action.id)
    return { success: true }
  } catch (error) {
    console.error('Undo create error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Undo failed'
    }
  }
}

/**
 * Undo an update action (restore previous state)
 */
export async function undoUpdate(
  action: UndoAction,
  supabase: any
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from(action.table)
      .update(action.previousState)
      .eq('id', action.recordId)

    if (error) throw error

    undoManager.removeAction(action.id)
    return { success: true }
  } catch (error) {
    console.error('Undo update error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Undo failed'
    }
  }
}

/**
 * Undo a delete action (restore the record)
 */
export async function undoDelete(
  action: UndoAction,
  supabase: any
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from(action.table)
      .insert([action.previousState])

    if (error) throw error

    undoManager.removeAction(action.id)
    return { success: true }
  } catch (error) {
    console.error('Undo delete error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Undo failed'
    }
  }
}

/**
 * Undo any action based on its type
 */
export async function undoAction(
  actionId: string,
  supabase: any
): Promise<{ success: boolean; error?: string }> {
  const action = undoManager.getAction(actionId)
  
  if (!action) {
    return { success: false, error: 'Action not found' }
  }

  if (!undoManager.canUndo(actionId)) {
    return { success: false, error: 'Action expired (>5 minutes)' }
  }

  switch (action.type) {
    case 'create':
      return undoCreate(action, supabase)
    case 'update':
      return undoUpdate(action, supabase)
    case 'delete':
      return undoDelete(action, supabase)
    default:
      return { success: false, error: 'Unknown action type' }
  }
}

/**
 * Format time remaining as human-readable string
 */
export function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) return 'Expired'
  
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`
  }
  
  return `${remainingSeconds}s`
}
