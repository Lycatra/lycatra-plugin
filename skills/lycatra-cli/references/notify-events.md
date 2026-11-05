# Cloud notifications and MCP Events

Read this before you set up, diagnose or resync event delivery to a cloud chat.

## Connecting a receiving host

Use `lycatra notify targets doctor --json` for read-only capability checks.
`lycatra notify targets connect --kind mcp-events --host chatgpt` explains the
receiving host's handshake and remains awaiting_host until that host creates
a verified subscription. Never request a copied callback secret or guessed
chat ID. Use the explicit opt-in resource `https://lycatra.com/api/mcp/cloud`
in a compatible receiving host. Its authentication challenge and resource
metadata request starter scopes `openid profile email offline_access
lycatra:agent wiki:read events:observe`; follow the host's standard OAuth
registration, enrollment and consent flow. Do not ask users to copy secrets or
manually invent scopes. Writes and full Matrix history need separate approval.
The ordinary `/api/mcp` resource keeps human-account behavior. Generic MCP
clients may support tools only; cloud enrollment and event support must be
verified in the receiving host before claiming it works.

## Event subscriptions and deliveries

`lycatra notify events catalog` lists available events. Event subscriptions live
under `lycatra notify events subscriptions`; the existing `notify subscribe`
and `notify subscriptions` commands still control attention preferences.
Delivery receipts are under `lycatra notify deliveries`. Pause, resume, revoke
and retry are explicit mutations, separate from diagnosis.

## Skipping a blocked event

Only after the user approves skipping a blocked event, run
`lycatra notify events subscriptions resync <id> --yes`. This skips exactly one
parked or cancelled head event and reports `truncated: true`, `skippedSequence`
and the new cursor. It does not retry the skipped event, clear pause, or renew
an expired lease. Inspect the subscription and delivery first; do not blindly
repeat resync after an uncertain result, because another call can skip another
event. A 410 or 413 delivery failure is never silently retried.

## Local wake commands

`lycatra notify wake codex` drives a local app-server; `wake claude` drives a
local monitor. Neither wakes an arbitrary hosted chat. `notify drain` claims
and acknowledges local run-lane work; it is not a read-only observer. A webhook
accepted by a host does not prove that the assistant completed the work.
