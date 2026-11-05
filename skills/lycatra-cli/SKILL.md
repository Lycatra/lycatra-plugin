---
name: lycatra-cli
description: Use the Lycatra CLI from a local or cloud shell for work the Lycatra tools cannot do - handing a file to a person, recording a bug or feedback, handing work to another agent, creating an agent, a scored council review, running commands in an agent or on an enrolled computer, sharing a port, running with vault secrets - and to install, sign in or check the selected environment.
---

# Lycatra from any shell

The Lycatra CLI works in authorized local and cloud shells. Hosted MCP tools
and the CLI reach the same Lycatra operations; use whichever is available. A
cloud shell can run the CLI, but it is not the identity of a cloud chat.

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

`lycatra login` is enough for ordinary CLI access. Provider credential setup
for local coding harnesses is a separate, optional task, not a prerequisite.
Installing, signing in and updating (`lycatra update`) need the user's
authorization. Never run them, or repair commands, as part of diagnosis.

## Commands

<!-- generated:machine-commands:start -->
| Task | Command |
|---|---|
| Run a command inside an agent | `lycatra ssh <agent> -- <command>` |
| Share a local port | `lycatra share start <port>`, then `lycatra share ls` and `lycatra share stop <id>` |
| Hand the browser to a person | `lycatra browser handoff "<what they should do>"` in the background; send the printed link` |
| Show a person the browser or a dev server live | `lycatra browser live --open http://localhost:3000` in the background; send the printed link` |
| Get a person past a captcha | `lycatra browser unblock` in the background after a step a bot check may block; send the printed link` |
| Browse from a trusted network address | `lycatra browser egress` in the background, then start agent-browser with the printed --proxy` |
| Reach a shared port locally | `lycatra forward <token> [localPort]` |
| Run a program with vault secrets in its environment | `lycatra vault run <item> --env NAME=field -- <command>` |
| Fill a login into the open local browser page | `lycatra vault login <item>` |
| Get a short-lived kubeconfig for granted cluster access | `lycatra k3s kubeconfig --plane <dev\|prod> --output <path>` |
| Check which account is signed in | `lycatra whoami` |
| Update the command now | `lycatra update` |
<!-- generated:machine-commands:end -->

These also run only from the CLI:

| Task | Command |
|---|---|
| Hand a finished file to a person as a download link | `lycatra deliver <path>` |
| Record a bug or user feedback | `lycatra issues capture "<evidence>" [--kind feedback]` |
| Hand work to another agent and get its reply | `lycatra agent handoff <agent> "<brief>" [--wait]` |
| Create an agent (or in the app at /ai) | `lycatra agent create <name> --purpose "..."` |
| Get a scored review from two models | `lycatra council review --task <brief.md>` |
| Ask to run a command on an enrolled computer | `lycatra ssh request <computer> --exec "<command>" --for 2h --why "<reason>" --wait` |

Add `--json` when you need to read the output. A bare `lycatra ssh <agent>`
opens an interactive shell, which hangs your terminal, so always pass the
command after `--`.

Ask the user before sharing a port, which makes it reachable by others, and
before running anything inside an agent that changes its state.

`lycatra vault run` puts secrets in the child process's environment, never in
your transcript. Do not print them from inside the command.

## Cloud notifications

A cloud chat receives Lycatra events only through a verified MCP Events
subscription on `https://lycatra.com/api/mcp/cloud`. `lycatra notify targets
connect` stays `awaiting_host` until the receiving host creates it, and
`lycatra notify targets doctor --json` checks capability without changing
anything. `lycatra notify wake` drives only a local app-server or monitor, never
a hosted chat. Before you set up, diagnose or resync event delivery, read
[references/notify-events.md](references/notify-events.md).
