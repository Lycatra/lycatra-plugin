# Lycatra plugin

Lycatra for Claude, ChatGPT, Codex, Cursor, VS Code, and any other app that
speaks MCP: your agents, wiki, memory, teams, schedules, notifications, Matrix
chat, and vault, in one sign-in.

## Install

Every app below connects to `https://dev.lycatra.com/api/mcp` and asks you to sign in to Lycatra once. One-click buttons for every app are on [dev.lycatra.com/connect](https://dev.lycatra.com/connect).

### Claude

Claude on the web, desktop, and mobile, and Cowork.

Recommended: the plugin, with skills:

1. In Claude, open Customize, then Plugins, then Add marketplace.
2. Enter Lycatra/lycatra-plugin on the beta branch and turn on Sync automatically.
3. Install Lycatra (beta), then connect it when Claude asks you to sign in.

- [Add as a connector only](https://claude.ai/customize/connectors?modal=add-custom-connector&connectorName=Lycatra&connectorUrl=https%3A%2F%2Fdev.lycatra.com%2Fapi%2Fmcp)

- [Add for your organization](https://claude.ai/admin-settings/connectors?modal=add-custom-connector&connectorName=Lycatra&connectorUrl=https%3A%2F%2Fdev.lycatra.com%2Fapi%2Fmcp)

A plugin added here also appears in Claude Code when you sign in with the same account.

Team and Enterprise plans: an organization owner adds Lycatra, then members connect it.

### ChatGPT

ChatGPT on the web and desktop.

Developer mode:

1. In ChatGPT, open Settings, then Security and login, and turn on Developer mode.
2. Open chatgpt.com/plugins, choose the plus button, and enter https://dev.lycatra.com/api/mcp.
3. Sign in to Lycatra when ChatGPT asks.

- [Open ChatGPT plugins](https://chatgpt.com/plugins)

Until Lycatra is in the ChatGPT directory, adding it needs developer mode, which depends on your plan.

### Claude Code

Lycatra tools, plus the Lycatra CLI for work that needs your computer.

```sh
claude plugin marketplace add Lycatra/lycatra-plugin@beta
claude plugin install lycatra@lycatra-beta
```

Turn on updates in /plugin, Marketplaces, then Enable auto-update. `lycatra setup` does this for you.

### Codex

The Codex CLI, the Codex app, and ChatGPT desktop.

```sh
codex plugin marketplace add Lycatra/lycatra-plugin --ref beta
codex plugin add lycatra@lycatra-beta
```

Codex IDE extension (tools only):

```sh
codex mcp add lycatra --url https://dev.lycatra.com/api/mcp
```

### Cursor

Lycatra tools in Cursor's agent.

- [Add to Cursor](https://dev.lycatra.com/connect#cursor)

### VS Code

GitHub Copilot in VS Code.

- [Install the plugin](https://dev.lycatra.com/connect#vscode)

- [Add the tools only](https://dev.lycatra.com/connect#vscode)

### GitHub Copilot CLI

Lycatra in the Copilot command line.

```sh
copilot plugin marketplace add Lycatra/lycatra-plugin@beta
copilot plugin install lycatra@lycatra-beta
```

### Gemini CLI

Lycatra tools as a Gemini CLI extension.

```sh
gemini extensions install https://github.com/Lycatra/lycatra-plugin --ref beta --auto-update
```

### Goose

Lycatra tools as a Goose extension.

- [Add to Goose](https://dev.lycatra.com/connect#goose)

### LM Studio

Lycatra tools for local models.

- [Add to LM Studio](https://dev.lycatra.com/connect#lm-studio)

### Any other MCP client

Add the MCP server URL. It signs in with OAuth.

Set up every agent add-mcp finds:

```sh
npx add-mcp https://dev.lycatra.com/api/mcp
```

### The Lycatra CLI

Agents that can run shell commands install it themselves the first time they need your computer, for example to run a command inside one of your agents. To install it yourself:

```sh
curl -fsSL https://dev.lycatra.com/install.sh | bash
```

```powershell
irm https://dev.lycatra.com/install.ps1 | iex
```

## How it works

Every app talks to Lycatra's hosted MCP server for anything stored in your
account: agents, wiki, memory, schedules, notifications, teams, Matrix, vault
metadata, and a browser that runs inside your agents. You sign in once with
Lycatra's OAuth prompt, and the app only sees what your account can access.

Some tasks need a real computer, such as running a command inside one of your
agents or sharing a local port. Where the agent can run shell commands, as in
Claude Code and Codex, it installs the checksum-verified `lycatra` command the
first time it needs one of those tasks. Everything else stays on the hosted
tools, so an agent never has two ways to do the same thing.

Your app's normal permission prompts still apply to writes, deletions, and
anything visible to other people.

## Support

- Help: [lycatra.com/support](https://lycatra.com/support)
- Privacy: [lycatra.com/privacy](https://lycatra.com/privacy)
- Terms: [lycatra.com/terms](https://lycatra.com/terms)

