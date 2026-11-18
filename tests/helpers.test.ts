import { describe, expect, it } from "vitest";
import { DIGEST_END, DIGEST_START, stripDigest, withDigest } from "../src/digestBlock";
import { buildPrompt } from "../src/prompt";
import { extractQuestions } from "../src/questions";
import { DigestSchedule } from "../src/schedule";

describe("extractQuestions", () => {
  it("returns only lines ending in ? without bullet and timestamp", () => {
    const notes = "- 09:10 bought milk\n- 14:32 what is a monad?\n- 15:00 done";
    expect(extractQuestions(notes)).toEqual(["what is a monad?"]);
  });
});

describe("digest block", () => {
  it("appends a block to a note without one", () => {
    const result = withDigest("- 09:10 hi", "Summary");
    expect(result).toBe(`- 09:10 hi\n\n${DIGEST_START}\nSummary\n${DIGEST_END}\n`);
  });

  it("replaces an existing block instead of stacking", () => {
    const once = withDigest("- 09:10 hi", "First");
    const twice = withDigest(once, "Second");
    expect(twice).toContain("Second");
    expect(twice).not.toContain("First");
  });

  it("strips the block and leaves the user's notes", () => {
    expect(stripDigest(withDigest("- 09:10 hi", "Summary"))).toBe("- 09:10 hi");
  });
});

describe("buildPrompt", () => {
  it("fills notes and questions", () => {
    const prompt = buildPrompt("N:{{notes}} Q:{{questions}}", "note", ["why?"]);
    expect(prompt).toBe("N:note Q:- why?");
  });
});

describe("DigestSchedule", () => {
  const schedule = new DigestSchedule("21:00");

  it("is not due before the digest time", () => {
    expect(schedule.isDue(new Date(2026, 10, 18, 20, 59), "")).toBe(false);
  });

  it("is due after the digest time when not yet run today", () => {
    expect(schedule.isDue(new Date(2026, 10, 18, 21, 0), "2026-11-17")).toBe(true);
  });

  it("is not due when already run today", () => {
    expect(schedule.isDue(new Date(2026, 10, 18, 22, 0), "2026-11-18")).toBe(false);
  });
});
