# Store review test cases

Use the supplied production reviewer account. It intentionally starts with no
agents and includes the seeded **Lycatra Store Review Welcome** wiki document.
Use a disposable wiki document for confirmed write tests.

## Positive cases

1. **OAuth and account boundary** — Install Lycatra, complete OAuth, call `whoami`, and verify the returned name/email match the reviewer account without exposing an internal user id or token.
2. **Empty agent boundary** — Call `agents_list` and verify the account's valid empty state is returned without inventing or leaking agents from another account.
3. **Wiki discovery and read** — Call `wiki_spaces`, `wiki_list`, and `wiki_search`, locate **Lycatra Store Review Welcome**, then read the returned slug with `wiki_read`.
4. **Confirmed wiki CRUD** — Create a disposable wiki document, update it, and delete that exact document only after the platform presents and receives confirmation for the destructive action.
5. **Account overview** — Use `teams_list`, `agents_list`, and the wiki tools to summarize only resources accessible to the connected reviewer account.

## Negative cases

1. **General knowledge** — Ask an unrelated factual question and verify Lycatra tools are not called.
2. **Arithmetic** — Ask for a simple calculation and verify Lycatra tools are not called.
3. **Public weather** — Ask for public weather information and verify Lycatra tools are not called.

## Local coding-surface validation

In Codex or Claude Code, install the same plugin package and verify
`lycatra_local_status` is available on the first turn without a separate CLI or
daemon installation. Complete OAuth through `lycatra_local_login`, retry status,
and then call a read-only local family tool. Attempting `lycatra_local_agents`
with arguments beginning `ssh` must be refused so an interactive command cannot
hang an MCP call.
