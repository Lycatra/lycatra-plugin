---
name: lycatra
description: Work with the user's Lycatra account through the Lycatra tools, including agents, wiki, teams, schedules, notifications, Matrix chat, vault items, and a browser inside their agents. Use it whenever the user asks to find, read, write, coordinate, schedule, notify, or sign in to something through Lycatra.
---

# Lycatra

The Lycatra tools cover everything stored in the user's Lycatra account. They
act as whoever the connection was approved for, usually the signed-in user and
on a cloud agent connection that agent, and see only what it can access. Use the
tools the connection offers; the full set and their inputs are in
[references/tools.md](references/tools.md).

Knowledge lives in wiki spaces: `wiki_spaces` lists the spaces this account
can reach and `wiki_search` finds pages across them. A space's start page or
values pages, when it has them, say how that team works. When the user asks
Lycatra to remember something, write a page in their personal space.

When the user reports a problem with Lycatra or wishes it did something, offer
to file it with `issues_report`, and file it in their words once they agree.

Some work needs the Lycatra CLI instead of these tools:

<!-- generated:cli-work:start -->
delivering a file (`lycatra deliver`), recording a bug with attachments (`lycatra issues report`), handing work to an agent (`lycatra agent handoff`), creating an agent (`lycatra agent create`), running commands in an agent or on a computer (`lycatra ssh`), managing domains (`lycatra domains`), sharing a local port (`lycatra share`), and running with vault secrets (`lycatra vault run`).
<!-- generated:cli-work:end -->

When a shell is available, the `lycatra-cli` skill covers it.

## Signing in

The tools sign in through the app's connector prompt. Never ask for, print, or
store tokens.

## First run

When the user has just connected Lycatra or asks what it can do, call `whoami`
to confirm the account, then offer three things to try: what questions are
waiting for their agents, a search of their wiki, and film gear to rent. Agent
and browser tools need at least one agent; if `agent_list` is empty, point them
to https://lycatra.com/ai to create one.

## How to work

1. Read or list before you write. Search to find the exact wiki slug, agent id,
   team id, or vault item, and use the ids the tools return. Never invent one.
2. Ask the user to confirm right before anything destructive or visible to other
   people: deleting, overwriting, changing permissions, sending a message,
   sharing, or cancelling a schedule. Skip the question when
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

If `vault_status` says the vault is locked, call `vault_unlock` and give the
user the link it returns. Never ask for a password.
