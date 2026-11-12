# Changelog

## Unreleased

- Track your equipment orders in Claude and ChatGPT: `orders_list` and
  `orders_get` show where each order stands, its parcels (the tracking link
  opens from the order card), the right of withdrawal and the totals, and the view checks the
  status again when you come back to the chat. Paying, cancelling and withdrawing
  stay on Lycatra, one tap away. Connecting asks to "see your orders and prepare
  orders for you to review": preparing orders for your review comes with the next
  step, so you won't be asked again for it. An app connected earlier gets orders
  (and Domains, if it predates them) the next time it connects, as long as its
  connection was never edited since it was set up. If it was, or its owner removed
  a scope, the tool says so: remove Lycatra from your connectors and add it again.
  Apps connected to lycatra.com between 11 November (from about 11:00 UTC) and the day
  Domains reached lycatra.com always take that step, because which scopes they
  were offered then cannot be told apart from ones their owner removed.
- `lycatra orders list` and `lycatra orders get` now answer the same shape as the
  connected apps: `{ orders, nextCursor }` with each order's `number`, `stage` and
  `total`, and one order with `lines`, `totals`, `links` and, per line,
  `shipment` (its carrier) and `withdrawal`. The answer no longer carries the
  delivery address, the tracking number, the event history or the money journal
  (operators: `lycatra debug orders`).
  `place` and `cancel` print the same order shape. Update the CLI with
  `lycatra-tools install`.
- `lycatra domains`: every change to a domain is in its history and an
  organization admin can undo it (`lycatra domains undo <change-id>`); a removed
  domain can be restored for 30 days. Domains API writes now answer
  `{ status, change, domain }` (or `removed: true`) instead of the bare domain,
  so update the CLI with `lycatra-tools install`.

## 0.3.0 - 2026-11-05

- Lycatra in the Claude and ChatGPT directories: connect your Lycatra account
  once, then search and write your wiki, see what your agents are working on,
  plan team tasks, schedule agents and find film gear to rent, from chat.
- Wiki and Matrix tools now work in Claude and ChatGPT: the connector asks for
  the permissions they need when you connect. If you connected before, remove
  Lycatra from the app and add it again.
- Your app asks before any tool that changes something, such as creating a
  wiki page, sending a question or clicking on a website.
- Signing in through an agent's browser fills the password itself; no tool
  ever shows a password in the chat.
- The CLI skill asks before installing the Lycatra command-line tool.
- The skills point to the Lycatra CLI for connecting your organization's domains
  (`lycatra domains`); assistants cannot manage domains yet.

## 0.2.0 - 2026-09-26

- Remove the local MCP bridge. Lycatra data now uses the hosted MCP server, while computer-specific work uses the Lycatra CLI.
- Publish one Agent Plugins 1.0 package for Claude, ChatGPT, Codex, Cursor, VS Code/Copilot, and other MCP clients.
- Include two skills: `lycatra` for Lycatra data through tools and `lycatra-cli` for work that needs the computer.
- Add a beta channel backed by the development MCP server.

## 0.1.1 - 2026-07-18

- Publish local MCP tools immediately so Codex and Claude Code discover them on the first turn.
- Defer the checksum-verified CLI download until the first local tool call.
- Add direct-install marketplace catalogs for Codex and Claude Code.

## 0.1.0 - 2026-07-16

- Initial public Lycatra plugin for ChatGPT, Codex, Claude Cowork, and Claude Code.
- OAuth-backed cloud MCP tools for account, agents, wiki, memory, schedules,
  notifications, Matrix messaging, and team coordination.
- Automatically bootstrapped, checksum-verified local Lycatra CLI MCP bridge.
