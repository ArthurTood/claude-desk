const { describe, it } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const updateBubble = require("../src/update-bubble");
const updateBubbleHtml = fs.readFileSync(path.join(__dirname, "..", "src", "update-bubble.html"), "utf8");

describe("update bubble follow-pet positioning", () => {
  it("anchors a short bubble directly below the pet hitbox when there is room", () => {
    const bounds = updateBubble.__test.computeUpdateBubbleBounds({
      bubbleFollowPet: true,
      width: 340,
      edgeMargin: 8,
      gap: 6,
      height: 150,
      reservedHeight: 0,
      workArea: { x: 0, y: 0, width: 800, height: 900 },
      petBounds: { x: 300, y: 60, width: 120, height: 120 },
      hitRect: { left: 320, top: 88, right: 400, bottom: 168 },
    });

    assert.deepStrictEqual(bounds, { x: 190, y: 168, width: 340, height: 150 });
  });

  it("does not let reserved corner stack space force a bubble away from the pet", () => {
    const bounds = updateBubble.__test.computeUpdateBubbleBounds({
      bubbleFollowPet: true,
      width: 340,
      edgeMargin: 8,
      gap: 6,
      height: 150,
      reservedHeight: 600,
      workArea: { x: 0, y: 0, width: 800, height: 900 },
      petBounds: { x: 300, y: 60, width: 120, height: 120 },
      hitRect: { left: 320, top: 88, right: 400, bottom: 168 },
    });

    assert.deepStrictEqual(bounds, { x: 190, y: 168, width: 340, height: 150 });
  });

  it("keeps an error bubble below the pet when its measured height still fits under the hitbox", () => {
    const bounds = updateBubble.__test.computeUpdateBubbleBounds({
      bubbleFollowPet: true,
      width: 340,
      edgeMargin: 8,
      gap: 6,
      height: 300,
      reservedHeight: 0,
      workArea: { x: 0, y: 0, width: 800, height: 800 },
      petBounds: { x: 300, y: 120, width: 120, height: 120 },
      hitRect: { left: 320, top: 140, right: 400, bottom: 220 },
    });

    assert.deepStrictEqual(bounds, { x: 190, y: 220, width: 340, height: 300 });
  });

  it("uses above-pet placement before side fallback when there is no room below the pet", () => {
    assert.ok(updateBubble.__test && typeof updateBubble.__test.computeUpdateBubbleBounds === "function");

    const bounds = updateBubble.__test.computeUpdateBubbleBounds({
      bubbleFollowPet: true,
      width: 340,
      edgeMargin: 8,
      gap: 6,
      height: 220,
      reservedHeight: 0,
      workArea: { x: 0, y: 0, width: 800, height: 600 },
      petBounds: { x: 300, y: 420, width: 120, height: 120 },
      hitRect: { left: 320, top: 440, right: 400, bottom: 520 },
    });

    assert.deepStrictEqual(bounds, { x: 190, y: 220, width: 340, height: 220 });
  });

  it("keeps a tall error bubble vertically attached to the pet instead of dropping to the workspace corner", () => {
    const bounds = updateBubble.__test.computeUpdateBubbleBounds({
      bubbleFollowPet: true,
      width: 340,
      edgeMargin: 8,
      gap: 6,
      height: 300,
      reservedHeight: 0,
      workArea: { x: 0, y: 0, width: 800, height: 600 },
      petBounds: { x: 300, y: 260, width: 120, height: 120 },
      hitRect: { left: 320, top: 280, right: 400, bottom: 360 },
    });

    assert.deepStrictEqual(bounds, { x: 406, y: 170, width: 340, height: 300 });
  });

  it("offsets side fallback by the follow gap so the bubble still reads as attached to the pet", () => {
    const bounds = updateBubble.__test.computeUpdateBubbleBounds({
      bubbleFollowPet: true,
      width: 340,
      edgeMargin: 8,
      gap: 6,
      height: 520,
      reservedHeight: 0,
      workArea: { x: 0, y: 0, width: 800, height: 600 },
      petBounds: { x: 300, y: 200, width: 120, height: 120 },
      hitRect: { left: 320, top: 220, right: 400, bottom: 300 },
    });

    assert.deepStrictEqual(bounds, { x: 406, y: 8, width: 340, height: 520 });
  });

  it("caps an overlong bubble to the visible work area so action buttons are not clipped", () => {
    const bounds = updateBubble.__test.computeUpdateBubbleBounds({
      bubbleFollowPet: false,
      width: 340,
      edgeMargin: 8,
      gap: 6,
      height: 1200,
      reservedHeight: 0,
      workArea: { x: 0, y: 0, width: 800, height: 600 },
      petBounds: { x: 300, y: 200, width: 120, height: 120 },
      hitRect: null,
    });

    assert.deepStrictEqual(bounds, { x: 452, y: 8, width: 340, height: 584 });
  });

  it("keeps action buttons visible when update text is long", () => {
    assert.match(updateBubbleHtml, /\.card \{[\s\S]*height: calc\(100vh - 12px\);[\s\S]*\}/);
    assert.match(updateBubbleHtml, /\.summary \{[\s\S]*overflow-y: auto;[\s\S]*\}/);
    assert.match(updateBubbleHtml, /\.actions \{[\s\S]*flex-shrink: 0;[\s\S]*\}/);
  });
});
