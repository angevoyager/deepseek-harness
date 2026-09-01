/** `sessionId` namespace dictionaries (the Session ID row's copy). */

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'menu.sessionId': '会话 ID',
  'copied': '已复制',
} satisfies Record<string, string>

/** The sessionId namespace key union. */
export type SessionIdKey = keyof typeof zh

/** English dictionary, checked complete against the zh key set. */
export const en = {
  'menu.sessionId': 'Session ID',
  'copied': 'Copied',
} satisfies Record<SessionIdKey, string>
