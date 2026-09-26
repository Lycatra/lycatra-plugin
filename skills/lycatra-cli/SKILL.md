---
name: lycatra-cli
description: Use the lycatra command on this computer for Lycatra tasks that need a real machine, such as running a command inside one of the user's agents, sharing a local port, reaching a shared port, or running a program with vault secrets. Only applies when you can run shell commands. For anything stored in Lycatra, use the Lycatra tools instead.
---

# Lycatra on this computer

Some Lycatra tasks need a real computer, so no tool can do them. Run these with
the `lycatra` command in your shell. Everything else, such as wiki, memory,
teams, schedules, notifications, messages, and vault lookups, goes through the
Lycatra tools, even though the command can also do it.

If you cannot run shell commands here, tell the user the task needs a computer,
for example Claude Code or Codex on their machine.

## First use

1. Check for the command with `lycatra whoami --json`.
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

The command updates itself in the background. `lycatra update` forces an update
now.

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
