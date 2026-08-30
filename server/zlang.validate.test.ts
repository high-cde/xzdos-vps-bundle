import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function caller() {
  const ctx: TrpcContext = {
    user: undefined,
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
  return appRouter.createCaller(ctx);
}

describe("zlang.validate", () => {
  it("accepts the supported ZLB2 v2.5 profile", async () => {
    const result = await caller().zlang.validate({ source: '# example\nemit hello\nstorage.read "allowed/file.txt"' });
    expect(result.accepted).toBe(true);
    expect(result.profile).toBe("ZLB2 v2.5");
    expect(result.instructionCount).toBe(2);
  });

  it("rejects unsupported execution and traversal", async () => {
    const result = await caller().zlang.validate({ source: 'exec shell\nstorage.read "../secret"\nlet x = 1' });
    expect(result.accepted).toBe(false);
    expect(result.errors).toHaveLength(3);
    expect(result.errors.join(" ")).toContain("non supportata");
    expect(result.errors.join(" ")).toContain("path rifiutato");
  });
});
