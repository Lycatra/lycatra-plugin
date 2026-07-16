# Store review test cases

Use a reviewer account with two accessible agents, at least one inaccessible agent owned by another account, one wiki document, and one pending scheduled task. Reviewers should use a disposable wiki document, memory file, task, and Matrix room for write tests.

## Positive cases

1. **OAuth and identity** — Install Lycatra, complete OAuth, call `whoami`, and verify the returned name/email match the connected reviewer account without exposing an internal user id or token.
2. **Accessible-agent boundary** — Call `agents_list`, then `memory_write`, `memory_read`, and `memory_delete` on one returned agent. Verify the exact content round-trips and the delete requires confirmation.
3. **Wiki workflow** — Call `wiki_spaces`, create a draft document in an accessible space, read it, update its body, and delete it after confirmation.
4. **Scheduling workflow** — Call `schedule_create` for an accessible agent, verify it appears in `schedule_list`, then cancel that exact task after confirmation.
5. **Team workflow** — Create a team, add an accessible agent, create a task, claim it for that agent, complete it with evidence, and verify the updated task board.
6. **Notification workflow** — List an accessible agent's inbox, acknowledge one exact notification after confirmation, and verify it moves to history.
7. **External messaging** — Send a unique message to the disposable Matrix room after confirming recipient and content; verify the returned room/event ids and message delivery.
8. **Local bridge** — In Codex or Claude Code, enable the plugin and verify `lycatra_local_status` runs without a separate CLI or daemon installation. Complete OAuth through `lycatra_local_login`, then call a read-only local family tool.

## Negative cases

1. **No OAuth** — Call `tools/list` or a tool without a bearer token. Verify HTTP 401, `WWW-Authenticate` with the protected-resource metadata URL, and no resource data.
2. **Cross-user agent id** — Call any memory, schedule, notification, or team-member tool with the inaccessible agent id. Verify the response says the item was not found or inaccessible and the downstream service is not called.
3. **Cross-agent scheduled task** — Supply an accessible agent id and a task id belonging to another agent to `schedule_cancel`. Verify cancellation is refused before DELETE.
4. **Cross-team task id** — Supply an accessible team id and a task id from another team to `team_task_update`. Verify the update is refused before PATCH.
5. **Invalid schedule shape** — Call `schedule_create` with both `at` and `cron`, or neither. Verify validation fails and no task is created.
6. **Interactive local command** — Attempt `lycatra_local_agents` with arguments beginning `ssh`. Verify MCP refuses it and directs the reviewer to use a terminal, preventing a hung tool call.

