#!/usr/bin/env node
import { readdir, stat, readFile } from "node:fs/promises";
import path from "node:path";

const BOM = "\ufeff";
const ROOT = process.cwd();
const TARGET_DIRECTORIES = ["app", "components", "lib", "styles", "pages", "src"];
const IGNORED = new Set(["node_modules", ".next", ".git", "public", "out", ".turbo"]);

async function walk(directory) {
  const files = [];
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (IGNORED.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

async function findBomFiles() {
  const offenders = [];

  for (const dir of TARGET_DIRECTORIES) {
    const targetPath = path.join(ROOT, dir);
    try {
      const stats = await stat(targetPath);
      if (!stats.isDirectory()) {
        continue;
      }
    } catch {
      continue;
    }

    const files = await walk(targetPath);
    for (const file of files) {
      try {
        const content = await readFile(file, "utf8");
        if (content.startsWith(BOM)) {
          offenders.push(file);
        }
      } catch {
        // ignore unreadable files
      }
    }
  }

  return offenders;
}

const offenders = await findBomFiles();

if (offenders.length) {
  console.error("Byte Order Marks detected in the following files:");
  offenders.forEach((file) => console.error(` - ${path.relative(ROOT, file)}`));
  process.exit(1);
}

console.log("No BOM issues detected.");
