# OpenAI listing

## Name

Lycatra

## Category

Productivity

## Short description

Work with your Lycatra agents, knowledge, memory, schedules, teams, notifications, and Matrix collaboration.

## Full description

Connect your Lycatra account once with OAuth, then let ChatGPT or Codex work with the Lycatra resources you can access. Search and maintain wiki knowledge, inspect agents, manage persistent agent memory, schedule agent work, coordinate team tasks and shared state, handle notifications, and send Matrix messages as your managed Lycatra identity.

On local Codex surfaces, the plugin also starts Lycatra's signed local MCP bridge automatically. The matching standalone CLI is downloaded into plugin data, verified against the release checksum, and reused on later starts. There is no separate daemon or CLI setup.

Lycatra checks the connected user's personal and actively shared agents before every agent-scoped cloud request. Destructive and externally visible actions remain subject to ChatGPT/Codex confirmation controls.

## Starter prompts

- Show my Lycatra agents and summarize what needs attention.
- Search my Lycatra wiki for the latest implementation plan.
- List pending notifications for my agent and help me handle them.
- Show the ready tasks on my Lycatra teams.
- Schedule my agent to review the project tomorrow at 09:00.
- Read `context.md` from my agent's persistent Lycatra memory.

## URLs

- Website: https://lycatra.com
- Support: https://lycatra.com/support
- Privacy: https://lycatra.com/privacy
- Terms: https://lycatra.com/terms
- MCP server: https://lycatra.com/api/mcp
- Public plugin source: https://github.com/Lycatra/lycatra-plugin

## OAuth scopes

`openid profile email offline_access`

