// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { SessionIdMenuItem } from '../src/client/SessionIdMenuItem.tsx'

afterEach(cleanup)

/** Install the async browser clipboard and restore its prior host shape. */
function installClipboard(writeText: (text: string) => Promise<void>): () => void {
  const prior = Object.getOwnPropertyDescriptor(navigator, 'clipboard')
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText },
  })
  return () => {
    if (prior === undefined) Reflect.deleteProperty(navigator, 'clipboard')
    else Object.defineProperty(navigator, 'clipboard', prior)
  }
}

const t = ((key: string) => key) as never

// The slot is root-scoped, so the framework injects the global standard hooks;
// the row does not read them, so the test supplies throwing stubs.
const runtime = {
  useSessions: (() => { throw new Error('unused') }) as never,
  useSessionPendingInteraction: (() => { throw new Error('unused') }) as never,
  useWorkspaces: (() => { throw new Error('unused') }) as never,
}

function mount(sessionId: string, close: () => void, notify: (text: string) => void) {
  return render(<SessionIdMenuItem {...runtime} sessionId={sessionId as never} close={close} notify={notify} t={t} />)
}

describe('SessionIdMenuItem', () => {
  it('copies the session id, closes the menu, and reports the Copied feedback on success', async () => {
    const writeText = vi.fn(async () => {})
    const restore = installClipboard(writeText)
    const close = vi.fn()
    const notify = vi.fn()
    try {
      mount('session-1', close, notify)
      fireEvent.click(screen.getByRole('menuitem', { name: 'menu.sessionId' }))
      expect(close).toHaveBeenCalledOnce()
      expect(writeText).toHaveBeenCalledWith('session-1')
      await waitFor(() => { expect(notify).toHaveBeenCalledWith('copied') })
    } finally {
      restore()
    }
  })

  it('reports no feedback when the clipboard write is rejected', async () => {
    const writeText = vi.fn(async () => { throw new Error('denied') })
    const restore = installClipboard(writeText)
    const close = vi.fn()
    const notify = vi.fn()
    try {
      mount('session-1', close, notify)
      fireEvent.click(screen.getByRole('menuitem', { name: 'menu.sessionId' }))
      expect(close).toHaveBeenCalledOnce()
      await waitFor(() => { expect(writeText).toHaveBeenCalledWith('session-1') })
      expect(notify).not.toHaveBeenCalled()
    } finally {
      restore()
    }
  })
})
