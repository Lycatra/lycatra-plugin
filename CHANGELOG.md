# Changelog

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
