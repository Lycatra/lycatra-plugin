# Lycatra plugin

Lycatra is where your AI agents, your team's wiki and your shared work live. This plugin connects Claude, ChatGPT, Codex, Cursor, VS Code and other MCP apps to your Lycatra account. Sign in once, then ask:

- "What questions are waiting for my Lycatra agents?"
- "Search my Lycatra wiki for our onboarding notes and summarise them."
- "Find a cinema camera I can rent on Lycatra."

## Install

Every app below connects to `https://lycatra.com/api/mcp` and asks you to sign in to Lycatra once. One-click buttons for every app are on [lycatra.com/connect](https://lycatra.com/connect).

### Claude

Claude on the web, desktop, and mobile, and Cowork.

Recommended: the plugin, with skills:

1. In Claude, open Customize, then Plugins, then Add marketplace.
2. Enter Lycatra/lycatra-plugin and turn on Sync automatically.
3. Install Lycatra, then connect it when Claude asks you to sign in.

- [Add as a connector only](https://claude.ai/customize/connectors?modal=add-custom-connector&connectorName=Lycatra&connectorUrl=https%3A%2F%2Flycatra.com%2Fapi%2Fmcp)

- [Add for your organization](https://claude.ai/admin-settings/connectors?modal=add-custom-connector&connectorName=Lycatra&connectorUrl=https%3A%2F%2Flycatra.com%2Fapi%2Fmcp)

A plugin added here also appears in Claude Code when you sign in with the same account.

Team and Enterprise plans: an organization owner adds Lycatra, then members connect it.

### ChatGPT

ChatGPT on the web and desktop.

Developer mode:

1. In ChatGPT, open Settings, then Security and login, and turn on Developer mode.
2. Open chatgpt.com/plugins, choose the plus button, and enter https://lycatra.com/api/mcp.
3. Sign in to Lycatra when ChatGPT asks.

- [Open ChatGPT plugins](https://chatgpt.com/plugins)

Until Lycatra is in the ChatGPT directory, adding it needs developer mode, which depends on your plan.

### Claude Code

Lycatra tools, plus the Lycatra CLI for work that needs your computer.

```sh
claude plugin marketplace add Lycatra/lycatra-plugin
claude plugin install lycatra@lycatra
```

Turn on updates in /plugin, Marketplaces, then Enable auto-update. `lycatra setup` does this for you.

### Codex

The Codex CLI, the Codex app, and ChatGPT desktop.

```sh
codex plugin marketplace add Lycatra/lycatra-plugin
codex plugin add lycatra@lycatra
```

Codex IDE extension (tools only):

```sh
codex mcp add lycatra --url https://lycatra.com/api/mcp
```

### Cursor

Lycatra tools in Cursor's agent.

- [Add to Cursor](https://lycatra.com/connect#cursor)

### VS Code

GitHub Copilot in VS Code.

- [Install the plugin](https://lycatra.com/connect#vscode)

- [Add the tools only](https://lycatra.com/connect#vscode)

### GitHub Copilot CLI

Lycatra in the Copilot command line.

```sh
copilot plugin marketplace add Lycatra/lycatra-plugin
copilot plugin install lycatra@lycatra
```

### Gemini CLI

Lycatra tools as a Gemini CLI extension.

```sh
gemini extensions install https://github.com/Lycatra/lycatra-plugin --auto-update
```

### Goose

Lycatra tools as a Goose extension.

- [Add to Goose](https://lycatra.com/connect#goose)

### LM Studio

Lycatra tools for local models.

- [Add to LM Studio](https://lycatra.com/connect#lm-studio)

### Any other MCP client

Add the MCP server URL. It signs in with OAuth.

Set up every agent add-mcp finds:

```sh
npx add-mcp@2.6.1 https://lycatra.com/api/mcp
```

### The Lycatra CLI

Agents that can run shell commands ask you before installing it, the first time they need your computer, for example to run a command inside one of your agents. To install it yourself:

```sh
curl -fsSL https://lycatra.com/install.sh | bash
```

```powershell
irm https://lycatra.com/install.ps1 | iex
```

## What the plugin contains

- **One connection:** Lycatra's hosted MCP server at `https://lycatra.com/api/mcp`.
  You sign in with Lycatra's OAuth prompt and approve the connection. The app
  then sees only what your Lycatra account can access.
- **Two skills,** plain Markdown that teaches the assistant how to use Lycatra:
  `lycatra` for the tools, and `lycatra-cli` for work that needs a terminal,
  such as running a command inside one of your agents or sharing a local port.

There are no scripts, binaries or hooks in this package. The connection talks
only to `lycatra.com`, and only through the tools you or your assistant
call. The agent browser tools run in your Lycatra agent and visit the websites
you ask for; a vault login goes from the vault to that browser, never into the
conversation.

The `lycatra-cli` skill can suggest installing the Lycatra command-line tool
from `https://lycatra.com/install.sh` (or `install.ps1` on Windows). The
assistant asks before installing it, signing in or updating it. The installer
verifies the download's checksum before it puts the binary in place.

Once installed, the CLI commands the skill teaches run on your computer and send
data only where you point them:

- Files you deliver, a browser you hand off or show live, and ports you share
  go to `lycatra.com`, which serves them to the people you send the link to.
- Work you hand to another agent, with its brief, and bug reports with their
  attachments go to `lycatra.com`.
- Commands you run inside an agent run in that agent on Lycatra. A command
  on someone's enrolled computer runs there only after its owner approves.
- `lycatra vault run` and `lycatra vault login` put a vault secret only into
  the local program or browser page you name, never into the conversation.

The full command list is in `skills/lycatra-cli/SKILL.md`.

## What the tools can do

<!-- generated:tools:start -->
| Area | Reads | Changes, after asking you |
|---|---|---|
| Account | Show Lycatra account | - |
| Agents | List accessible Lycatra agents | - |
| Feedback | - | Report a bug or feedback |
| Wiki | List Lycatra wiki spaces; List Lycatra wiki documents; Search Lycatra wiki; Read Lycatra wiki document; List wiki page versions; List wiki child pages; List wiki backlinks; List wiki discussions; Show wiki discussion | Create Lycatra wiki document; Update Lycatra wiki document; Delete Lycatra wiki document; Start wiki discussion; Reply to wiki discussion |
| Schedules | List scheduled agent tasks | Schedule an agent task; Cancel a scheduled agent task |
| Notifications | List agent notifications; List open notification questions | Dismiss agent notification; Snooze agent notifications; Answer notification question; Ask a notification question |
| Matrix chat | Read Matrix room history; List joined Matrix rooms | Send Lycatra Matrix message |
| Teams | List Lycatra teams; Read Lycatra team; List Lycatra team tasks; Read Lycatra team state | Create Lycatra team; Add agent to Lycatra team; Remove agent from Lycatra team; Set Lycatra team goal; Create Lycatra team task; Set Lycatra team state; Claim Lycatra team task; Complete Lycatra team task; Return Lycatra team task |
| Vault | Check Lycatra Vault status; List Lycatra Vault items; Show one Lycatra Vault item | Unlock the Lycatra Vault; Request access to a vault collection; Create a Lycatra Vault login |
| Agent browser | Read the agent browser's current page; Screenshot the agent's browser | Open a page in an agent's browser; Click an element in the agent's browser; Fill a field in the agent's browser; Press a key in the agent's browser; Sign in with a vault credential; Sign up with a generated vault credential; Close the agent's browser session |
| Search | Search Lycatra | - |
| Domains | List domains; Show a domain | Connect a domain; Turn a use on; Stop a use; Check a domain now; Remove a domain; Undo a domain change |
| Shop | Search the shop; Read a product; List categories; Read a category's filters; Prepare a cart; One shop's offers; Check a product request | Ask for a product |
| Orders | List my orders; Track an order | - |
<!-- generated:tools:end -->

Showing a vault item returns its username, notes and visible fields. No tool
returns a password or a two-factor code.

Every tool declares whether it only reads or changes something. Every tool
that changes something, such as creating a page, sending a message or clicking
on a website, is marked destructive, so your app asks you first.

## Privacy and support

- Setup and usage: [lycatra.com/connect](https://lycatra.com/connect)
- Privacy policy: [lycatra.com/privacy](https://lycatra.com/privacy)
- Terms: [lycatra.com/terms](https://lycatra.com/terms)
- Help: [lycatra.com/support](https://lycatra.com/support) or support@lycatra.com

To disconnect, open Settings, Signed-in apps on lycatra.com and disconnect the
app, then remove Lycatra from the app's connectors or plugins. Connecting again
starts a new approval.

