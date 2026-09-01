/**
 * Session ID menu row: copies the session id to the host clipboard and reports
 * the "Copied" feedback through the owner's `notify`. The row owns its own
 * handler (unlike the data-driven native rows), so it also closes the menu
 * through the owner's `close` exactly as the native rows do. The feedback is
 * reported rather than rendered here because the menu (and this row's subtree)
 * unmounts as soon as `close` runs — before the asynchronous clipboard write
 * resolves — so the owner hosts the toast at the row, where it survives.
 */
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { IconCopyOutline16, MenuItemRow, writeClipboard } from '@deepseek-ai/dsh-client-ui-primitives'

/** Full component props: owner share (`sessionId`/`close`/`notify`) + the locale seat. */
export type SessionIdMenuItemProps =
  PropsRuntime<'sidebar.workspaces.sessionMenuItem'>
  & PropsLocale<'sessionId'>

/**
 * Render the Session ID row.
 * @param props - composed slot props.
 * @returns the row.
 */
export function SessionIdMenuItem({ sessionId, close, notify, t }: SessionIdMenuItemProps) {
  return (
    <MenuItemRow
      label={t('menu.sessionId')}
      icon={<IconCopyOutline16 />}
      onSelect={() => {
        void writeClipboard(sessionId).then((ok) => { if (ok) notify(t('copied')) })
        close()
      }}
    />
  )
}
