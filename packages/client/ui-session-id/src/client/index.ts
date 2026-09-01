/**
 * Session ID menu item plugin, browser half: a "Session ID" row contributed to
 * the ui-workspace-declared `sidebar.workspaces.sessionMenuItem` slot. The row
 * copies the session id to the host clipboard and shows a "Copied" toast, with
 * its own locale namespace so the shell owns no Session-ID copy or behavior.
 * Export discipline: packages/client/AGENTS.md.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis'
// Type-only: pulls the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
// Type-only: pulls the SlotRegistry service merge (ctx.slots).
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
// Type-only: pulls the session-menu slot owner merge from ui-workspace.
import type {} from '@deepseek-ai/dsh-client-ui-workspace/client'
import { SessionIdMenuItem } from './SessionIdMenuItem.tsx'
import { en, zh, type SessionIdKey } from './locales.ts'

export type { SessionIdMenuItemProps } from './SessionIdMenuItem.tsx'
export type { SessionIdKey } from './locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The Session ID menu row's copy. */
    sessionId: SessionIdKey
  }
}

/** Dictionary namespace owned by this plugin. */
const NS = 'sessionId'

/** Required services (cordis fiber inject). */
export const inject = ['slots', 'locale']

/**
 * Client plugin body: register the `sessionId` dictionaries and the Session ID
 * row into the session-menu slot.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-session-id: dictionaries')
  ctx.slots.inject('sidebar.workspaces.sessionMenuItem', () => ctx.slots.register(
    { name: 'sidebar.workspaces.sessionMenuItem', id: 'sessionId', locale: NS },
    SessionIdMenuItem,
  ))
}
