// Checks the plugin against the published Antigravity manifest schema
// (https://antigravity.google/schemas/v1/plugin.json) and the Build plugins
// pre-publish checklist. It does not replace `agy plugin validate --strict`.
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const errors = [];
const fail = (m) => errors.push(m);
const json = (p) => { try { return JSON.parse(readFileSync(p, "utf8")); } catch (e) { fail(`${p}: ${e.message}`); return {}; } };

const ALLOWED = ["$schema", "name", "displayName", "description", "version", "disabled", "logo",
  "suggestedPrompts", "skills", "author", "homepage", "repository", "license", "keywords", "extensions"];
const BRANDS = /^(antigravity|gemini|claude|cursor)/i;

const m = json("plugin.json");
for (const k of Object.keys(m)) if (!ALLOWED.includes(k)) fail(`plugin.json: unknown key "${k}"`);
for (const k of ["name", "displayName", "description", "version", "logo", "suggestedPrompts", "author"])
  if (m[k] === undefined) fail(`plugin.json: "${k}" is required for the Marketplace`);
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(m.name ?? "")) fail("plugin.json: name must be lowercase kebab-case");
if (BRANDS.test(m.name ?? "") || BRANDS.test(m.displayName ?? "")) fail("plugin.json: name or displayName leads with a reserved brand");
if (/\b(plugin|mcp)$/i.test(m.displayName ?? "")) fail('plugin.json: displayName ends with "Plugin" or "MCP"');
const dl = (m.description ?? "").length;
if (dl < 120 || dl > 160) fail(`plugin.json: description is ${dl} characters, expected 120 to 160`);
if (!/^\d+\.\d+\.\d+$/.test(m.version ?? "")) fail("plugin.json: version must be semantic, such as 1.0.0");
if (!/\.(png|svg|jpe?g|webp)$/i.test(m.logo ?? "") || !existsSync(m.logo ?? "")) fail("plugin.json: logo must be a bundled image file");
const sp = m.suggestedPrompts ?? [];
if (!Array.isArray(sp) || sp.length < 1 || sp.length > 3 || sp.some((s) => !String(s).trim())) fail("plugin.json: suggestedPrompts needs 1 to 3 non-empty prompts");
for (const k of ["homepage", "repository"]) if (m[k] && !m[k].startsWith("https://")) fail(`plugin.json: ${k} must be https`);
if (m.author?.url && !m.author.url.startsWith("https://")) fail("plugin.json: author.url must be https");
if ((m.keywords ?? []).some((k) => k !== k.toLowerCase())) fail("plugin.json: keywords must be lowercase");
if (!existsSync("README.md")) fail("README.md is required");

const mcp = json("mcp_config.json");
for (const [key, s] of Object.entries(mcp.mcpServers ?? {})) {
  const url = s.url ?? s.serverUrl;
  if (!s.command && !/^https:\/\//.test(url ?? "")) fail(`mcp_config.json: ${key} needs an https url`);
  if (/secret|token|bearer/i.test(JSON.stringify(s)) && !s.variables) fail(`mcp_config.json: ${key} looks like it holds a credential`);
}

const frontmatter = (p) => {
  const t = readFileSync(p, "utf8");
  const mm = t.match(/^---\n([\s\S]*?)\n---\n/);
  if (!mm) { fail(`${p}: missing frontmatter`); return {}; }
  const out = {};
  for (const line of mm[1].split("\n")) {
    const kv = line.match(/^([A-Za-z-]+):\s*(.+)$/);
    if (!kv) { fail(`${p}: frontmatter line is not plain "key: value": ${line}`); continue; }
    let v = kv[2].trim();
    if (v.startsWith('"')) { try { v = JSON.parse(v); } catch { fail(`${p}: bad quoted value for ${kv[1]}`); } }
    out[kv[1]] = v;
  }
  return out;
};

for (const dir of readdirSync("skills")) {
  const d = join("skills", dir);
  if (!statSync(d).isDirectory()) continue;
  const p = join(d, "SKILL.md");
  if (!existsSync(p)) { fail(`${d}: missing SKILL.md`); continue; }
  const f = frontmatter(p);
  for (const k of Object.keys(f)) if (!["name", "description", "disable-model-invocation", "license", "compatibility"].includes(k)) fail(`${p}: unknown key "${k}"`);
  if (f.name !== dir) fail(`${p}: name "${f.name}" must match the folder`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(dir) || dir.length > 64) fail(`${p}: name must be kebab-case, at most 64 characters`);
  const n = (f.description ?? "").length;
  if (n < 1 || n > 1024) fail(`${p}: description is ${n} characters, expected 1 to 1024`);
}

if (existsSync("rules")) for (const file of readdirSync("rules")) {
  if (!file.endsWith(".md") || /^(AGENTS|GEMINI)\.md$/.test(file)) continue;
  const p = join("rules", file);
  const f = frontmatter(p);
  if (!["always_on", "model_decision", "glob", "manual"].includes(f.trigger)) fail(`${p}: invalid trigger`);
  if (f.trigger === "model_decision" && !f.description) fail(`${p}: model_decision needs a description`);
  if (f.trigger === "glob" && typeof f.globs !== "string") fail(`${p}: globs must be a comma-separated string`);
}

if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log("Plugin checks passed.");
