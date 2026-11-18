import assert from "node:assert/strict";
import { test } from "node:test";
import { pickProjects, titleOf, type Repo } from "./projects.ts";

const rules = { user: "me", tag: "portfolio", featuredTag: "featured" };
const repo = (name: string, over: Partial<Repo> = {}): Repo => ({
  name, description: null, language: null, topics: [], homepage: null,
  html_url: "", pushed_at: "2026-01-01", fork: false, archived: false, ...over,
});

test("only tagged repos show, featured first, then most recent", () => {
  const got = pickProjects(
    [
      repo("old", { topics: ["portfolio"], pushed_at: "2025-01-01" }),
      repo("new", { topics: ["portfolio"], pushed_at: "2026-06-01" }),
      repo("star", { topics: ["portfolio", "featured"], pushed_at: "2024-01-01" }),
      repo("untagged"),
    ],
    rules,
  );
  assert.deepEqual(got.map((r) => r.name), ["star", "new", "old"]);
  assert.equal(got[0]?.featured, true);
});

test("forks, archived, the profile repo and the site repo never show", () => {
  const got = pickProjects(
    [repo("fork", { fork: true }), repo("gone", { archived: true }), repo("me"), repo("me.github.io"), repo("real")],
    rules,
  );
  assert.deepEqual(got.map((r) => r.name), ["real"]);
});

test("titles read like words and keep acronyms upper-case", () => {
  assert.equal(titleOf("r-drop_project"), "R Drop Project");
  assert.equal(titleOf("registro-n8n-ia"), "Registro N8N IA");
  assert.equal(titleOf("producto-3d"), "Producto 3D");
});
