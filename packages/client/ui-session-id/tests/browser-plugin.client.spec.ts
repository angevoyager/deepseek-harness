/**
 * ui-session-id browser half on a real cordis Context: the plugin registers one
 * Session ID row into the ui-workspace-declared session-menu slot with its own
 * `sessionId` locale namespace, and fiber disposal removes the contribution
 * (HMR safety).
 */
import { Context } from '@deepseek-ai/cordis'
import { describe, expect, it } from 'vitest'
import { SlotRegistry } from '@deepseek-ai/dsh-client-ui-renderer/client'
import { LocaleRuntime } from '@deepseek-ai/dsh-client-locale/client'
import { apply, inject } from '../src/client/index.ts'
import { SessionIdMenuItem } from '../src/client/SessionIdMenuItem.tsx'

async function bench() {
  const ctx = new Context()
  await ctx.plugin(SlotRegistry).await()
  const locale = new LocaleRuntime(ctx)
  locale.setLocale('en')
  ctx.provide('locale', locale)
  // ui-workspace's WorkspaceBrowser declares the slot; the test declares it
  // directly so the plugin's slots.inject resolves without booting that plugin.
  ctx.slots.register({
    name: 'root',
    children: { 'sidebar.workspaces.sessionMenuItem': { kind: 'list', scope: 'root' } },
  } as never, () => null)
  const fiber = ctx.plugin({ inject: [...inject], apply })
  await fiber.await()
  return { ctx, fiber, locale, slots: ctx.get('slots') as SlotRegistry }
}

describe('ui-session-id browser plugin', () => {
  it('declares its services', () => {
    expect(inject).toEqual(['slots', 'locale'])
  })

  it('registers the Session ID row with its locale and removes it on dispose', async () => {
    const b = await bench()
    const entry = b.slots.entries('sidebar.workspaces.sessionMenuItem')[0]!
    expect(entry.component).toBe(SessionIdMenuItem)
    expect(entry.options).toEqual({ id: 'sessionId' })
    expect(entry.locale).toBe('sessionId')
    // Copy rides the standard locale seat: apply registered both dictionaries.
    expect(b.locale.bind('sessionId')('menu.sessionId')).toBe('Session ID')
    expect(b.locale.bind('sessionId')('copied')).toBe('Copied')
    await b.fiber.dispose()
    expect(b.slots.entries('sidebar.workspaces.sessionMenuItem')).toHaveLength(0)
  })
})
