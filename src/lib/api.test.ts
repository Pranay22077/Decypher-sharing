import { describe, expect, it } from "vitest";
import { browserSha256 } from "./api";

describe("browserSha256", () => {
  it("is deterministic and changes when evidence bytes change", async () => {
    const first = new File(["same evidence"], "first.txt", { type: "text/plain" });
    const second = new File(["same evidence"], "second.txt", { type: "text/plain" });
    const changed = new File(["changed evidence"], "changed.txt", { type: "text/plain" });
    expect(await browserSha256(first)).toBe(await browserSha256(second));
    expect(await browserSha256(first)).not.toBe(await browserSha256(changed));
  });
});

