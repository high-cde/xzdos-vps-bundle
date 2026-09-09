import { describe, expect, it } from "vitest";
import { getZcommCatalog, getZcommPage, validateZlang } from "./microcosm";

describe("shared Microcosm contracts", () => {
  it("publishes the same bounded ZComm pages", () => {
    const catalog = getZcommCatalog();
    expect(catalog.node_id).toBe("core-01");
    expect(catalog.pages.map((page) => page.code)).toEqual(["*01#", "*02#", "*03#"]);
    expect(catalog.execution).toBe("DENIED");
    expect(getZcommPage("*02#").found).toBe(true);
    expect(getZcommPage("*99#").found).toBe(false);
  });

  it("accepts and rejects Microcosm Zlang profiles deterministically", () => {
    expect(validateZlang("emit ZDOS ready", "zdos.zlang.microterm.v1").accepted).toBe(true);
    const denied = validateZlang("exec shell", "zdos.zlang.microterm.v1");
    expect(denied.accepted).toBe(false);
    expect(denied.execution).toBe("DENIED");
    expect(denied.policy).toBe("DEFAULT-DENY");
  });
});
