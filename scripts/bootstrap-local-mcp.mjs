#!/usr/bin/env node
/**
 * Immediate-start MCP facade for the checksum-verified Lycatra CLI.
 *
 * Tool discovery never waits on the network or the standalone binary. The
 * binary is downloaded and verified lazily on the first tool call, then reused
 * from the plugin's writable cache for later calls.
 */

import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { chmod, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";
import { createInterface } from "node:readline";

const PROTOCOL_VERSION = "2025-06-18";
const PLUGIN_VERSION = "0.1.1";
const MAX_OUTPUT_CHARS = 32_000;
const COMMAND_TIMEOUT_MS = 10 * 60_000;
const ASSET_BASE = (
  process.env.LYCATRA_ASSET_BASE || "https://get.lycatra.com/cli/download"
).replace(/\/+$/, "");
const CHANNEL = process.env.LYCATRA_RELEASE_CHANNEL === "dev" ? "dev" : "stable";

const FAMILY_TOOLS = [
  {
    name: "lycatra_local_login",
    title: "Connect local Lycatra CLI",
    description:
      "Open Lycatra OAuth in the user's browser and securely save the resulting local CLI session. Use when another local Lycatra tool reports that login is required.",
    command: "login",
    fixedArgs: ["--json"],
    readOnly: false,
    destructive: false,
    openWorld: false,
  },
  {
    name: "lycatra_local_status",
    title: "Show local Lycatra CLI status",
    description:
      "Show whether this computer's Lycatra CLI is connected and which account it uses. The result never includes bearer tokens.",
    command: "whoami",
    fixedArgs: ["--json"],
    readOnly: true,
    destructive: false,
    openWorld: false,
  },
  {
    name: "lycatra_local_wiki",
    title: "Run local Lycatra wiki command",
    description:
      "Use the full public Lycatra wiki CLI on this computer for search, reads, documents, history, discussions, mentions, and spaces.",
    command: "wiki",
    readOnly: false,
    destructive: true,
    openWorld: false,
  },
  {
    name: "lycatra_local_memory",
    title: "Run local Lycatra memory command",
    description:
      "Use the full public Lycatra persistent-memory CLI for an authorized agent, including reads, writes, links, cleanup, and statistics.",
    command: "memory",
    readOnly: false,
    destructive: true,
    openWorld: false,
  },
  {
    name: "lycatra_local_context",
    title: "Run local Lycatra context command",
    description: "Use the full public Lycatra context-window CLI for an authorized agent.",
    command: "context",
    readOnly: false,
    destructive: true,
    openWorld: false,
  },
  {
    name: "lycatra_local_notifications",
    title: "Run local Lycatra notification command",
    description:
      "Use the full public Lycatra notification CLI, including inbox, acknowledgement, presence, delivery modes, and channels.",
    command: "notify",
    readOnly: false,
    destructive: true,
    openWorld: false,
  },
  {
    name: "lycatra_local_teams",
    title: "Run local Lycatra teams command",
    description:
      "Use the full public Lycatra teams CLI to coordinate goals, members, tasks, and team state.",
    command: "teams",
    readOnly: false,
    destructive: true,
    openWorld: false,
  },
  {
    name: "lycatra_local_schedule",
    title: "Run local Lycatra schedule command",
    description:
      "Use the full public Lycatra scheduling CLI to list, create, update, or cancel authorized agent tasks.",
    command: "schedule",
    readOnly: false,
    destructive: true,
    openWorld: false,
  },
  {
    name: "lycatra_local_matrix",
    title: "Run local Lycatra Matrix command",
    description:
      "Use the full public Lycatra Matrix CLI to read rooms and send messages or files as the authenticated user or authorized agent.",
    command: "matrix",
    readOnly: false,
    destructive: true,
    openWorld: true,
  },
  {
    name: "lycatra_local_agents",
    title: "Run local Lycatra agent command",
    description:
      "Use the public Lycatra agent CLI to list, create, wait for, or connect to agents owned by the authenticated user.",
    command: "agent",
    readOnly: false,
    destructive: true,
    openWorld: false,
  },
  {
    name: "lycatra_local_share",
    title: "Run local Lycatra share command",
    description:
      "Use the public Lycatra share CLI to publish an authorized local port through Lycatra's share fabric.",
    command: "share",
    readOnly: false,
    destructive: true,
    openWorld: true,
  },
  {
    name: "lycatra_local_forward",
    title: "Run local Lycatra forward command",
    description:
      "Use the public Lycatra forward CLI to connect an authorized shared port to local networking.",
    command: "forward",
    readOnly: false,
    destructive: true,
    openWorld: false,
  },
];

function toolDescriptor(tool) {
  return {
    name: tool.name,
    title: tool.title,
    description: tool.description,
    inputSchema: tool.fixedArgs
      ? { type: "object", properties: {}, additionalProperties: false }
      : {
          type: "object",
          properties: {
            arguments: {
              type: "array",
              items: { type: "string", maxLength: 4096 },
              maxItems: 64,
              default: [],
              description:
                "Exact arguments after the Lycatra command name, as separate argv items. Use --json when machine-readable output is useful.",
            },
          },
          additionalProperties: false,
        },
    outputSchema: {
      type: "object",
      properties: {
        exit_code: { type: "integer" },
        stdout: { type: "string" },
        stderr: { type: "string" },
      },
      required: ["exit_code", "stdout", "stderr"],
      additionalProperties: false,
    },
    annotations: {
      readOnlyHint: tool.readOnly,
      destructiveHint: tool.destructive,
      openWorldHint: tool.openWorld,
    },
  };
}

const TOOLS = FAMILY_TOOLS.map(toolDescriptor);
let binaryPromise;

function assetName() {
  const os =
    process.platform === "win32"
      ? "windows"
      : process.platform === "darwin"
        ? "darwin"
        : process.platform === "linux"
          ? "linux"
          : null;
  const arch = process.arch === "x64" ? "x64" : process.arch === "arm64" ? "arm64" : null;
  if (!os || !arch) {
    throw new Error(`Lycatra has no local binary for ${process.platform}/${process.arch}.`);
  }
  return `lycatra-${os}-${arch}${os === "windows" ? ".exe" : ""}`;
}

function dataDirectory() {
  const explicit = process.env.PLUGIN_DATA || process.env.CLAUDE_PLUGIN_DATA;
  if (explicit) return explicit;
  if (process.platform === "win32") {
    return path.join(
      process.env.LOCALAPPDATA || path.join(homedir(), "AppData", "Local"),
      "Lycatra",
      "plugin",
      PLUGIN_VERSION,
    );
  }
  return path.join(
    process.env.XDG_CACHE_HOME || path.join(homedir(), ".cache"),
    "lycatra",
    "plugin",
    PLUGIN_VERSION,
  );
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function expectedHash(sums, fileName) {
  for (const line of sums.split("\n")) {
    const match = line.trim().match(/^([0-9a-fA-F]{64})\s+\*?(.+)$/);
    if (match && match[2].trim() === fileName) return match[1].toLowerCase();
  }
  return null;
}

async function existingHash(filePath) {
  try {
    return sha256(await readFile(filePath));
  } catch {
    return null;
  }
}

async function trustedCachedHash(checksumPath) {
  try {
    const value = (await readFile(checksumPath, "utf8")).trim().toLowerCase();
    return /^[0-9a-f]{64}$/.test(value) ? value : null;
  } catch {
    return null;
  }
}

async function fetchBytes(url) {
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) throw new Error(`download failed (${response.status})`);
  return Buffer.from(await response.arrayBuffer());
}

async function ensureBinary() {
  const explicitBinary = process.env.LYCATRA_LOCAL_MCP_BINARY;
  if (explicitBinary) {
    if (!(await existingHash(explicitBinary))) {
      throw new Error(
        `LYCATRA_LOCAL_MCP_BINARY does not point to a readable file: ${explicitBinary}`,
      );
    }
    return explicitBinary;
  }

  const fileName = assetName();
  const directory = dataDirectory();
  const binaryPath = path.join(directory, fileName);
  const checksumPath = `${binaryPath}.sha256`;
  await mkdir(directory, { recursive: true });

  const [cachedActual, cachedTrusted] = await Promise.all([
    existingHash(binaryPath),
    trustedCachedHash(checksumPath),
  ]);
  if (cachedActual && cachedTrusted && cachedActual === cachedTrusted) return binaryPath;

  let sums;
  try {
    sums = (await fetchBytes(`${ASSET_BASE}/${CHANNEL}/SHA256SUMS`)).toString("utf8");
  } catch (error) {
    throw new Error(
      `Could not reach the Lycatra release service and no checksum-verified cached binary is available: ${String(error)}`,
    );
  }

  const expected = expectedHash(sums, fileName);
  if (!expected) throw new Error(`SHA256SUMS does not contain ${fileName}.`);
  const bytes = await fetchBytes(`${ASSET_BASE}/${CHANNEL}/${fileName}`);
  const actual = sha256(bytes);
  if (actual !== expected) {
    throw new Error(`Checksum mismatch for ${fileName}; refusing to run the download.`);
  }

  const temporary = `${binaryPath}.tmp-${process.pid}`;
  await writeFile(temporary, bytes, { mode: 0o755 });
  if (process.platform !== "win32") await chmod(temporary, 0o755);
  await rm(binaryPath, { force: true });
  await rename(temporary, binaryPath);
  await writeFile(checksumPath, `${expected}\n`, { encoding: "utf8", mode: 0o600 });
  return binaryPath;
}

function getBinary() {
  binaryPromise ??= ensureBinary();
  return binaryPromise;
}

function truncate(value) {
  if (value.length <= MAX_OUTPUT_CHARS) return value;
  return `${value.slice(0, MAX_OUTPUT_CHARS)}\n… output truncated by Lycatra local MCP`;
}

function parseArguments(value) {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > 64) return null;
  const args = [];
  for (const item of value) {
    if (typeof item !== "string" || item.length > 4096 || item.includes("\0")) return null;
    args.push(item);
  }
  return args;
}

async function runProcess(binary, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(binary, args, {
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, LYCATRA_NO_UPDATE: "1" },
      windowsHide: true,
    });
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", reject);
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill();
    }, COMMAND_TIMEOUT_MS);
    child.on("exit", (code) => {
      clearTimeout(timer);
      resolve({ exitCode: timedOut ? 124 : (code ?? 1), stdout, stderr });
    });
  });
}

async function runCommand(tool, input) {
  const supplied = tool.fixedArgs ?? parseArguments(input?.arguments);
  if (!supplied) {
    return {
      content: [{ type: "text", text: "arguments must be an array of at most 64 strings." }],
      isError: true,
    };
  }
  if (tool.command === "agent" && supplied[0] === "ssh") {
    return {
      content: [
        {
          type: "text",
          text: "Interactive SSH is intentionally unavailable through MCP. Run `lycatra agent ssh <agent>` in a terminal instead.",
        },
      ],
      isError: true,
    };
  }

  try {
    const binary = await getBinary();
    const completed = await runProcess(binary, [tool.command, ...supplied]);
    const result = {
      exit_code: completed.exitCode,
      stdout: truncate(completed.stdout.trim()),
      stderr: truncate(completed.stderr.trim()),
    };
    const rendered = [result.stdout, result.stderr].filter(Boolean).join("\n");
    return {
      content: [
        {
          type: "text",
          text: rendered || `Lycatra command completed with exit code ${completed.exitCode}.`,
        },
      ],
      structuredContent: result,
      ...(completed.exitCode === 0 ? {} : { isError: true }),
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Lycatra local CLI could not start: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
}

function send(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

function rpcError(id, code, message) {
  return { jsonrpc: "2.0", id: id ?? null, error: { code, message } };
}

async function handleMessage(message) {
  const id = message.id;
  const method = typeof message.method === "string" ? message.method : "";
  if (method === "notifications/initialized" || method === "notifications/cancelled") return;
  if (method === "initialize") {
    send({
      jsonrpc: "2.0",
      id: id ?? null,
      result: {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: "lycatra-local", version: "1.0.0" },
        instructions:
          "This server runs the public Lycatra CLI locally. Read before writing and ask for explicit user confirmation before destructive or externally visible commands.",
      },
    });
    return;
  }
  if (method === "ping") {
    send({ jsonrpc: "2.0", id: id ?? null, result: {} });
    return;
  }
  if (method === "tools/list") {
    send({ jsonrpc: "2.0", id: id ?? null, result: { tools: TOOLS } });
    return;
  }
  if (method === "tools/call") {
    const params = message.params && typeof message.params === "object" ? message.params : {};
    const name = typeof params.name === "string" ? params.name : "";
    const tool = FAMILY_TOOLS.find((candidate) => candidate.name === name);
    if (!tool) {
      send(rpcError(id, -32602, `Unknown tool: ${name || "(none)"}`));
      return;
    }
    const input =
      params.arguments && typeof params.arguments === "object" ? params.arguments : undefined;
    send({ jsonrpc: "2.0", id: id ?? null, result: await runCommand(tool, input) });
    return;
  }
  send(rpcError(id, -32601, `Method not found: ${method || "(none)"}`));
}

async function main() {
  const lines = createInterface({ input: process.stdin, crlfDelay: Number.POSITIVE_INFINITY });
  for await (const line of lines) {
    if (!line.trim()) continue;
    try {
      const message = JSON.parse(line);
      if (!message || message.jsonrpc !== "2.0") {
        send(rpcError(message?.id, -32600, "Invalid Request: jsonrpc must be 2.0"));
        continue;
      }
      await handleMessage(message);
    } catch (error) {
      send(rpcError(null, error instanceof SyntaxError ? -32700 : -32603, "Internal error"));
    }
  }
}

main().catch((error) => {
  process.stderr.write(
    `lycatra plugin: ${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
});
