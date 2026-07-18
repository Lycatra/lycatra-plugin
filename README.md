# Lycatra plugin

Connect ChatGPT, Codex, Claude Cowork, and Claude Code to your Lycatra account.

## Install

After store approval, search for **Lycatra** in the ChatGPT/Codex or Claude
plugin directory, add it, and complete the Lycatra OAuth prompt. That is the
entire setup.

Until the directory listings finish review, the same signed public package can
be installed directly from GitHub:

```powershell
codex plugin marketplace add Lycatra/lycatra-plugin
codex plugin add lycatra@lycatra
```

```powershell
claude plugin marketplace add Lycatra/lycatra-plugin
claude plugin install lycatra@lycatra --scope user
```

In either route, installation is intentionally two steps:

1. Add the Lycatra plugin from the platform's plugin directory.
2. Complete the Lycatra OAuth prompt.

There is no separate daemon or CLI setup. Cloud-only surfaces use the hosted MCP
server. Local Codex and Claude Code surfaces also start a small plugin process
that exposes the local tools immediately, downloads the matching Lycatra CLI
binary on their first use, verifies its SHA-256 checksum before running it, and
starts automatically on later sessions.
Normal host permission prompts still apply to writes, destructive actions, and
externally visible work.

Support: [lycatra.com/support](https://lycatra.com/support)

Privacy: [lycatra.com/privacy](https://lycatra.com/privacy)

Terms: [lycatra.com/terms](https://lycatra.com/terms)
