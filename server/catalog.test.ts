import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const caller = () => appRouter.createCaller({ user: undefined, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] });

describe("public evidence and ecosystem catalog", () => {
  it("returns evidence with authoritative verification states", async () => {
    const records = await caller().evidence.list();
    expect(records.length).toBeGreaterThan(0);
    expect(records.every(record => ["VERIFIED", "PREPARED", "ROADMAP", "NOT_VERIFIED"].includes(record.status))).toBe(true);
    expect(records.find(record => record.slug === "foundation-release")?.commitSha).toBe("6d33514793568259c765997064223743031d3ef0");
  });

  it("returns ecosystem roles with explicit boundaries", async () => {
    const components = await caller().ecosystem.list();
    expect(components.map(component => component.slug)).toEqual(expect.arrayContaining(["zdos", "zlang", "zdos-lab", "z-cybercore"]));
    expect(components.every(component => component.boundary.length > 0)).toBe(true);
    expect(components.find(component => component.slug === "z-cybercore")?.status).toBe("ROADMAP");
  });
});
