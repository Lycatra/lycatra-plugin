---
name: lycatra-cli
description: Use the Lycatra CLI from any authorized local or cloud shell for Lycatra knowledge, agents, notifications, collaboration, and runtime capabilities. Hosted MCP and CLI are supported interfaces over shared contracts; select the available interface without inventing an identity or cloud wake target.
---

# Lycatra from any shell

The Lycatra CLI works in authorized local and cloud shells. Hosted MCP tools
and the CLI are supported interfaces to the same Lycatra domain operations.
Use whichever is available and appropriate. A hosted assistant can use MCP
without a local computer or CLI installation. A cloud shell is a valid CLI
execution environment; it is not the identity of a cloud chat.

This package uses the stable CLI channel, prod
plane and https://lycatra.com issuer. Keep install, login, update and MCP on
that channel. Never fall back to production if this environment is unavailable.

## First use

1. Check the selected environment with `lycatra channel show`, then use
   `lycatra whoami --json` to inspect the identity. If the channel differs from
   stable, stop and ask before changing the selected profile.
2. If it is not installed, install it. Both installers verify the download
   before installing it.
   - macOS or Linux: `curl -fsSL https://lycatra.com/install.sh | LYCATRA_NO_SETUP=1 bash`
   - Windows (PowerShell): `irm https://lycatra.com/install.ps1 | iex`

   The installer prints where it put the binary. If `lycatra` is still not on
   your PATH, use that full path.
3. If it says you are not signed in, run `lycatra login`. It opens the user's
   browser, where they approve the sign-in, and exits once they have. Tell the
   user to expect the browser window. If the browser cannot open, for example on
   a remote machine, run `lycatra login --start`, show the user the link it
   prints, then run `lycatra login --wait`. Then retry the original command.

`lycatra login` is sufficient for ordinary CLI access. Provider credential
setup for local coding harnesses is a separate, optional task; do not run it
as a prerequisite. Installation, login and updates require the user's authorization.

`lycatra update` explicitly updates the selected channel. Do not run updates,
login or repair commands as part of diagnosis.

## Cloud notification delivery

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

`lycatra notify events catalog` lists available events. Event subscriptions live
under `lycatra notify events subscriptions`; the existing `notify subscribe`
and `notify subscriptions` commands still control attention preferences.
Delivery receipts are under `lycatra notify deliveries`. Pause, resume, revoke
and retry are explicit mutations, separate from diagnosis.

Only after the user approves skipping a blocked event, run
`lycatra notify events subscriptions resync <id> --yes`. This skips exactly one
parked or cancelled head event and reports `truncated: true`, `skippedSequence`
and the new cursor. It does not retry the skipped event, clear pause, or renew
an expired lease. Inspect the subscription and delivery first; do not blindly
repeat resync after an uncertain result, because another call can skip another
event. A 410 or 413 delivery failure is never silently retried.

`lycatra notify wake codex` drives a local app-server; `wake claude` drives a
local monitor. Neither wakes an arbitrary hosted chat. `notify drain` claims
and acknowledges local run-lane work; it is not a read-only observer. A webhook
accepted by a host does not prove that the assistant completed the work.

## Commands

<!-- generated:machine-commands:start -->
| Task | Command |
|---|---|
| Run a command inside an agent | `lycatra ssh <agent> -- <command>` |
| Share a local port | `lycatra share start <port>`, then `lycatra share ls` and `lycatra share stop <id>` |
| Reach a shared port locally | `lycatra forward <token> [localPort]` |
| Run a program with vault secrets in its environment | `lycatra vault run <item> --env NAME=field -- <command>` |
| Fill a login into the open local browser page | `lycatra vault login <item>` |
| Get a short-lived kubeconfig for granted cluster access | `lycatra k3s kubeconfig --plane <dev\|prod> --output <path>` |
| Check which account is signed in | `lycatra whoami` |
| Update the command now | `lycatra update` |
<!-- generated:machine-commands:end -->

Add `--json` when you need to read the output. A bare `lycatra ssh <agent>`
opens an interactive shell, which hangs your terminal, so always pass the
command after `--`.

Ask the user before sharing a port, which makes it reachable by others, and
before running anything inside an agent that changes its state.

`lycatra vault run` puts secrets in the child process's environment, never in
your transcript. Do not print them from inside the command.
