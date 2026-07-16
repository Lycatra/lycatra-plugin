# Lycatra capability routing

| Need | Cloud tools | Local coding surfaces |
|---|---|---|
| Connected account | `whoami` | `lycatra_local_status` |
| Agents | `agents_list` | `lycatra_local_agents` |
| Wiki | `wiki_*` | `lycatra_local_wiki` |
| Persistent memory | `memory_list`, `memory_read`, `memory_write`, `memory_delete`, `memory_stats` | `lycatra_local_memory` |
| Context window | Not exposed by the cloud service until context sessions have a strict user-auth boundary | `lycatra_local_context` |
| Notifications | `notifications_list`, `notification_acknowledge`, `notification_mode_set` | `lycatra_local_notifications` |
| Teams and tasks | `teams_list`, `team_read`, `team_create`, `team_member_add`, `team_tasks_list`, `team_task_create`, `team_task_update`, `team_state_list`, `team_state_set` | `lycatra_local_teams` |
| Schedules | `schedule_list`, `schedule_create`, `schedule_cancel` | `lycatra_local_schedule` |
| Matrix chat/files | `matrix_send_message` sends as the OAuth-connected human; cloud history/files stay private until equivalent user-scoped routes exist | `lycatra_local_matrix` |
| Local port sharing | Not available from cloud-only hosts | `lycatra_local_share` / `lycatra_local_forward` |

The cloud registry intentionally exposes atomic, reviewable tools. The local
bridge exposes public CLI families with argv arrays so it can reach newer
Lycatra capabilities without shell evaluation. Internal/staff CLI families such
as deploy, registry, diagnostics, and issue administration are never exposed by
the public plugin.

OAuth and normal platform permission prompts are mandatory. There is no
separate daemon-install toggle or manual CLI provisioning step.
