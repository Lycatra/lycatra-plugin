import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createInterface } from "node:readline";
import test from "node:test";

const EXPECTED_TOOLS = [
  "lycatra_local_login",
  "lycatra_local_status",
  "lycatra_local_wiki",
  "lycatra_local_memory",
  "lycatra_local_context",
  "lycatra_local_notifications",
  "lycatra_local_teams",
  "lycatra_local_schedule",
  "lycatra_local_matrix",
  "lycatra_local_agents",
  "lycatra_local_share",
  "lycatra_local_forward",
];

function request(child, id, method, params) {
  child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", id, method, params })}\n`);
}

test("publishes all local tools before downloading the CLI", async (context) => {
  const child = spawn(process.execPath, ["scripts/bootstrap-local-mcp.mjs"], {
    cwd: new URL("..", import.meta.url),
    env: {
      ...process.env,
      LYCATRA_ASSET_BASE: "http://127.0.0.1:1/must-not-be-contacted",
    },
    stdio: ["pipe", "pipe", "pipe"],
    windowsHide: true,
  });
  context.after(() => child.kill());

  let stderr = "";
  child.stderr.setEncoding("utf8");
  child.stderr.on("data", (chunk) => {
    stderr += chunk;
  });

  const lines = createInterface({ input: child.stdout, crlfDelay: Number.POSITIVE_INFINITY });
  const responses = new Map();
  const received = (async () => {
    for await (const line of lines) {
      const message = JSON.parse(line);
      responses.set(message.id, message);
      if (responses.has(1) && responses.has(2)) return;
    }
  })();

  request(child, 1, "initialize", {
    protocolVersion: "2025-06-18",
    capabilities: {},
    clientInfo: { name: "plugin-test", version: "1.0.0" },
  });
  request(child, 2, "tools/list", {});

  await Promise.race([
    received,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`MCP discovery timed out: ${stderr}`)), 2_000),
    ),
  ]);

  assert.equal(responses.get(1)?.result?.serverInfo?.name, "lycatra-local");
  assert.deepEqual(
    responses.get(2)?.result?.tools?.map((tool) => tool.name),
    EXPECTED_TOOLS,
  );

  child.stdin.end();
  await once(child, "exit");
  assert.equal(stderr, "");
});
