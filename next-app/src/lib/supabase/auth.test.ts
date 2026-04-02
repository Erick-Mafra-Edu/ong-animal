import { describe, expect, it, vi } from 'vitest'
import { signInWithEmailAndPassword } from './auth'

describe('signInWithEmailAndPassword', () => {
  it('forwards credentials to supabase auth', async () => {
    const signInWithPassword = vi.fn().mockResolvedValue({ data: { user: { email: 'test@example.com' } }, error: null })
    const client = {
      auth: { signInWithPassword },
    } as never

    const result = await signInWithEmailAndPassword(client, {
      email: 'test@example.com',
      password: 'secret',
    })

    expect(signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'secret',
    })
    expect(result.user).toEqual({ email: 'test@example.com' })
  })
})
