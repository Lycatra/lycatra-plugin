# Lycatra plugin

Connect ChatGPT, Codex, Claude Cowork, and Claude Code to your Lycatra account.

Installation is intentionally two steps:

1. Add the Lycatra plugin from the platform's plugin directory.
2. Complete the Lycatra OAuth prompt.

There is no separate daemon or CLI setup. Cloud-only surfaces use the hosted MCP
server. Local Codex and Claude Code surfaces also start a small plugin process
that downloads the matching signed Lycatra CLI binary, verifies its SHA-256
checksum, and runs its local MCP bridge automatically. Normal host permission
prompts still apply to writes, destructive actions, and externally visible work.

Support: [lycatra.com/support](https://lycatra.com/support)

Privacy: [lycatra.com/privacy](https://lycatra.com/privacy)

Terms: [lycatra.com/terms](https://lycatra.com/terms)
