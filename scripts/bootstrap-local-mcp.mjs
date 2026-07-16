#!/usr/bin/env node
/**
 * Cross-platform launcher for the checksum-verified Lycatra CLI's local MCP mode.
 *
 * The plugin stays small: on first use this downloads the platform-specific
 * standalone binary, verifies it against the separately published SHA256SUMS,
 * and stores it in the plugin's writable data directory. Later starts reuse the
 * verified cache and continue working offline.
 */

import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { chmod, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";

const ASSET_BASE = (
  process.env.LYCATRA_ASSET_BASE || "https://get.lycatra.com/cli/download"
).replace(/\/+$/, "");
const CHANNEL = process.env.LYCATRA_RELEASE_CHANNEL === "dev" ? "dev" : "stable";

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
    );
  }
  return path.join(
    process.env.XDG_CACHE_HOME || path.join(homedir(), ".cache"),
    "lycatra",
    "plugin",
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

  let sums;
  try {
    sums = (await fetchBytes(`${ASSET_BASE}/${CHANNEL}/SHA256SUMS`)).toString("utf8");
  } catch (error) {
    const [actual, trusted] = await Promise.all([
      existingHash(binaryPath),
      trustedCachedHash(checksumPath),
    ]);
    if (actual && trusted && actual === trusted) {
      process.stderr.write(
        `lycatra plugin: release check unavailable; using the cached verified binary (${String(error)}).\n`,
      );
      return binaryPath;
    }
    throw new Error(
      `Could not reach the Lycatra release service and no checksum-verified cached binary is available: ${String(error)}`,
    );
  }

  const expected = expectedHash(sums, fileName);
  if (!expected) throw new Error(`SHA256SUMS does not contain ${fileName}.`);
  if ((await existingHash(binaryPath)) === expected) {
    await writeFile(checksumPath, `${expected}\n`, { encoding: "utf8", mode: 0o600 });
    return binaryPath;
  }

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

async function main() {
  const binary = await ensureBinary();
  const child = spawn(binary, ["mcp"], {
    stdio: "inherit",
    env: { ...process.env, LYCATRA_NO_UPDATE: "1" },
    windowsHide: true,
  });

  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => child.kill(signal));
  }
  child.on("error", (error) => {
    process.stderr.write(`lycatra plugin: could not start local MCP: ${error.message}\n`);
    process.exitCode = 1;
  });
  child.on("exit", (code, signal) => {
    process.exitCode = code ?? (signal ? 1 : 0);
  });
}

main().catch((error) => {
  process.stderr.write(
    `lycatra plugin: ${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
});
