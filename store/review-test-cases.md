# Store review test cases

Use a reviewer account with two accessible agents, at least one inaccessible agent owned by another account, one wiki document, and one pending scheduled task. Reviewers should use a disposable wiki document, memory file, and scheduled task for write tests.

## Positive cases

1. **OAuth and identity** — Install Lycatra, complete OAuth, call `whoami`, and verify the returned name/email match the connected reviewer account without exposing an internal user id or token.
2. **Accessible-agent boundary** — Call `agents_list`, then `memory_write`, `memory_read`, and `memory_delete` on one returned agent. Verify the exact content round-trips and the delete requires confirmation.
3. **Wiki workflow** — Call `wiki_spaces`, create a draft document in an accessible space, read it, update its body, and delete it after confirmation.
4. **Scheduling workflow** — Call `schedule_create` for an accessible agent, verify it appears in `schedule_list`, then cancel that exact task after confirmation.
5. **Local bridge** — In Codex or Claude Code, enable the plugin and verify `lycatra_local_status` runs without a separate CLI or daemon installation. Complete OAuth through `lycatra_local_login`, then call a read-only local family tool.

## Negative cases

1. **No OAuth** — Call `tools/list` or a tool without a bearer token. Verify HTTP 401, `WWW-Authenticate` with the protected-resource metadata URL, and no resource data.
2. **Cross-user agent id** — Call any memory, schedule, notification, or team-member tool with the inaccessible agent id. Verify the response says the item was not found or inaccessible and the downstream service is not called.
3. **Interactive local command** — Attempt `lycatra_local_agents` with arguments beginning `ssh`. Verify MCP refuses it and directs the reviewer to use a terminal, preventing a hung tool call.
