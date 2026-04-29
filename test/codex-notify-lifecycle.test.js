const { describe, it } = require("node:test");
const assert = require("node:assert");

const { buildCodexNotifyEntry } = require("../src/permission").__test;

describe("codex notify lifecycle", () => {
  it("builds Codex notify entries without an auto-expire timer", () => {
    const before = Date.now();
    const entry = buildCodexNotifyEntry({
      sessionId: "codex-session",
      command: "echo hello",
    });
    const after = Date.now();

    assert.strictEqual(entry.sessionId, "codex-session");
    assert.deepStrictEqual(entry.toolInput, { command: "echo hello" });
    assert.strictEqual(entry.toolName, "CodexExec");
    assert.strictEqual(entry.isCodexNotify, true);
    assert.strictEqual(entry.agentId, "codex");
    assert.ok(entry.createdAt >= before && entry.createdAt <= after);
    assert.ok(!Object.prototype.hasOwnProperty.call(entry, "autoExpireTimer"));
  });
});
