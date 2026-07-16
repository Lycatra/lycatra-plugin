---
name: use-lycatra
description: Use Lycatra agents, wiki knowledge, memory, Matrix collaboration, notifications, teams, schedules, files, sharing, and local CLI capabilities. Trigger whenever a user asks to find, read, create, coordinate, run, notify, remember, schedule, share, or manage something in Lycatra.
---

# Use Lycatra

Use the most capable Lycatra path available on the current platform. The plugin
already supplies the connection; never ask the user to install a daemon, CLI,
runtime, dependency, or configuration file.

## Choose the surface

- In ChatGPT Work or Claude Cowork, use `lycatra-cloud` tools. These work through
  the hosted OAuth-backed MCP server.
- In Codex or Claude Code, use cloud tools for account data and the
  `lycatra_local_*` tools when the task benefits from the full local public CLI.
  The local server starts automatically and bootstraps a signed Lycatra binary.
- Use the host's native filesystem, terminal, browser, and code-editing tools for
  ordinary local computer work. Lycatra local tools complement those native
  capabilities; they do not replace the host's safety model.

Read [references/capabilities.md](references/capabilities.md) when choosing among
the tool families or when a capability appears unavailable on one surface.

## Authentication

Cloud tools trigger the platform's Lycatra OAuth connection UI. Do not request,
print, paste, or store tokens.

If a `lycatra_local_*` tool reports that the local CLI is not signed in, call
`lycatra_local_login`. It opens the same Lycatra OAuth flow and saves the session
in the user's normal protected CLI store. After approval, retry the original
tool call. Do not ask the user to run a setup command.

## Operating rules

1. Read or list first when the exact target is not known.
2. Use IDs and slugs returned by Lycatra tools; never invent them.
3. Prefer the narrow cloud tool when it directly matches the task.
4. Use a local CLI-family tool for capabilities that the cloud registry does not
   yet expose or when local networking/files are required.
5. Pass local CLI arguments as separate `arguments` array items. Never embed a
   shell pipeline, redirection, command substitution, or secret.
6. Ask for explicit confirmation immediately before deletes, overwrites,
   permission changes, messages, public shares, agent creation, cancellations,
   or other irreversible/external actions unless the user's current request
   already names that exact action and target.
7. Summarize what changed and return useful Lycatra links, document slugs, agent
   IDs, or schedule IDs without exposing internal traces or credentials.

## Common workflows

For knowledge work, search before reading, then update only the chosen document.
For agent work, list agents first and use the returned agent ID. For
collaboration, resolve the destination before sending a message or file. For
scheduling, show the interpreted time and timezone before creating a recurring
task.

If a capability is absent on a cloud-only surface, explain that the installed
plugin is already operating at that platform's limit. Do not describe the local
bridge as optional setup: on local coding surfaces it is part of the plugin and
starts automatically.
