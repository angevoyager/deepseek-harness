---
description: "Session-row menu \"Session ID\" contribution for the web GUI: copies the session id to the host clipboard from the workspace browser's session menu."
kind: "package-reference"
---

# @deepseek-ai/dsh-client-ui-session-id

## Summary

This package adds a `Session ID` row to the session popup menu in the workspace browser. It is a static client plugin that contributes into the `sidebar.workspaces.sessionMenuItem` slot declared by `ui-workspace`; the shell itself owns no Session-ID copy, icon, label, or behavior. Choosing the row writes the session id to the host clipboard and closes the menu; the `Copied` feedback is reported through the owner-supplied `notify` callback, so the menu owner shows the toast at the row (which survives the menu closing) — matching the behavior the session menu used to hard-code.

## Table of Contents

- [Use this package](#use-this-package)
- [Understand the implementation](#understand-the-implementation)
- [Further Exploration](#further-exploration)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

-----

<a id="use-this-package"></a>
## Use this package

Mount this plugin alongside `ui-workspace`; the session menu then shows `Rename` / `Fork` / `Archive` / `Session ID`. Choosing `Session ID` copies the session id to the host clipboard and closes the menu; the menu owner shows a `Copied` toast (reported through the row's `notify` callback) so the feedback survives the close. The row is the first consumer of the `sidebar.workspaces.sessionMenuItem` slot; further rows can be added by other plugins without touching `ui-workspace`.

<a id="understand-the-implementation"></a>
## Understand the implementation

<details>
<summary>Implementation internals — click to expand</summary>

The browser half registers one entry into the ui-workspace-declared session-menu slot through `ctx.slots.inject('sidebar.workspaces.sessionMenuItem', ...)`. The entry declares its own `sessionId` locale namespace and renders a `MenuItemRow` primitive (icon + label + its own handler). The handler writes the session id through `writeClipboard` and calls the owner-supplied `close` to dismiss the menu; on success it reports the localized `Copied` text through the owner-supplied `notify` callback, whose toast lives at the menu's row and survives the close. The host half is empty; the node half exists only so the plugin appears in the Loader.

</details>

-----

<a id="further-exploration"></a>
## Further Exploration

- [ui-workspace](../ui-workspace/README.md) — the browsing region whose session menu declares the slot this plugin fills.
- [ui-primitives](../ui-primitives/README.md) — the `MenuItemRow`, `writeClipboard`, and `Toast` primitives the row composes.
- [Client package map](../README.md) — adjacent browser UI packages.

-----

<a id="model-experience"></a>
## Model Experience

None. The row only writes the session id to the host clipboard; nothing reaches the model, the session log, or any request content.

#### KV Cache effect

No invalidation.

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>

- **Web-only** — non-Web clients have no session-row menu, so this copy affordance is unavailable there.

<a id="dev-note"></a>
### Dev Note

<details>
<summary>Working context for maintainers — click to expand</summary>

None.

</details>
