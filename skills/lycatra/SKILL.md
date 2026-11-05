---
name: lycatra
description: Work with the user's Lycatra account through the Lycatra tools, including agents, wiki, teams, schedules, notifications, Matrix chat, vault items, and a browser inside their agents. Use it whenever the user asks to find, read, write, coordinate, schedule, notify, remember, or sign in to something through Lycatra.
---

# Lycatra

The Lycatra tools cover everything stored in the user's Lycatra account. They
act as whoever the connection was approved for, usually the signed-in user and
on a cloud agent connection that agent, and see only what it can access. Use the
tools the connection offers; the full set and their inputs are in
[references/tools.md](references/tools.md).

Knowledge lives in wiki spaces: `wiki_spaces` lists the spaces this account
can reach and `wiki_search` finds pages across them. A space's start page or
values pages, when it has them, say how that team works. To remember something
for a later session, write a page in the user's personal space.

Some work needs the Lycatra CLI instead of these tools: delivering a file,
recording a bug or feedback, handing work to another agent, creating an agent
(or in the app at /ai), a scored review from two models, and running commands
in an agent or on a computer. When a shell is available, the
`lycatra-cli` skill covers it.

## Signing in

The tools sign in through the app's connector prompt. Never ask for, print, or
store tokens.

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
