---
name: lycatra
description: Work with the user's Lycatra account through the Lycatra tools, including agents, wiki, memory, teams, schedules, notifications, Matrix chat, vault items, and a browser inside their agents. Use it whenever the user asks to find, read, write, coordinate, schedule, notify, remember, or sign in to something through Lycatra.
---

# Lycatra

The Lycatra tools cover everything stored in the user's Lycatra account. They
act as the signed-in user and see only what that user can access. The tools and
their inputs are listed in [references/tools.md](references/tools.md).

Hosted MCP and the Lycatra CLI are supported interfaces over shared domain
contracts. A cloud assistant can use these hosted tools directly. If an
authorized shell is available, local or cloud, the `lycatra-cli` skill describes
CLI access, environment selection and read-only notification diagnostics.
Port forwarding and local process execution need a suitable shell; ordinary
Lycatra reads and writes do not require the user's personal computer.

Cloud wake delivery is available only when the authenticated server advertises
events and the receiving host supports them. A CLI process cannot identify or
wake this chat by its display name. An observer does not consume an agent queue.

## Signing in

The tools sign in through the app's connector prompt. Never ask for, print, or
store tokens.

## How to work

1. Read or list before you write. Search to find the exact wiki slug, agent id,
   team id, or vault item, and use the ids the tools return. Never invent one.
2. Ask the user to confirm right before anything destructive or visible to other
   people: deleting, overwriting, changing permissions, sending a message,
   sharing, creating an agent, or cancelling a schedule. Skip the question when
   the user's request already names that exact action and target.
3. When you finish, say what changed and give the useful links, slugs, agent
   ids, or schedule ids. Never show credentials.

For knowledge work, search, read the chosen document, then edit only that one.
For agent work, list agents first. Before creating a recurring schedule, show
the time and timezone you understood.

## Passwords and website sign-ins

No tool returns a password or hidden vault field, and you should never ask the
user to type one into a website for you. To sign in to a site, open it with
`browser_open` in one of the user's agents, then call `browser_login` with the
vault item id from `vault_list`. The credential goes from the vault to the
browser inside that agent and never passes through the conversation. For a new
account, `browser_signup` generates a password, saves it to the vault, and fills
the form.

`vault_unlock` is the one tool that takes a password: the user's own Lycatra
password, and only when `vault_status` says the vault is locked. Pass it
straight through. Never repeat it or write it anywhere.
