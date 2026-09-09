import { z } from "zod";

export const ZDOS_NODE_ID = "core-01" as const;
export const ZDOS_NODE_STATUS_SCHEMA = "zdos.node.status.v1" as const;
export const ZCOMM_SERVICE_SCHEMA = "zdos.zcomm.catalog.v1" as const;

export const zlangValidationInput = z.object({
  profile: z.string().max(96).optional(),
  source: z.string().max(12000),
});

export type ZdosNodeStatus = "ONLINE" | "STALE" | "OFFLINE";

const catalogPages = [
  { code: "*01#", title: "ZDOS STATUS", rows: ["NODE core-01", "POLICY DEFAULT-DENY", "HEARTBEAT PUBLIC HTTPS", "CAPABILITY READ-ONLY"] },
  { code: "*02#", title: "ZLANG RUNTIME", rows: ["PROFILE ZLB2 v2.5", "VALIDATOR DETERMINISTIC", "BYTECODE EXECUTION DENIED", "HALT LINKED"] },
  { code: "*03#", title: "EVIDENCE CHAIN", rows: ["PUBLIC RELEASE RECORDS", "USER RECEIPTS APPEND-ONLY", "READ-ONLY SERVICE", "ATTESTATION OBSERVABLE"] },
] as const;

export function getZcommCatalog() {
  return {
    schema: ZCOMM_SERVICE_SCHEMA,
    node_id: ZDOS_NODE_ID,
    policy: "DEFAULT-DENY" as const,
    capabilities: ["zcomm.catalog.read", "zcomm.page.read"] as const,
    pages: catalogPages,
    execution: "DENIED" as const,
    transport: "HTTPS-READ-ONLY" as const,
  };
}

export function getZcommPage(code: string) {
  const page = catalogPages.find((item) => item.code === code);
  return page
    ? { found: true as const, ...page, detail: `${code} served by the shared ZComm catalog` }
    : { found: false as const, code, title: "SERVICE CODE NOT FOUND", rows: [], detail: "code is not allowlisted" };
}

export function validateZlang(source: string, profile = "zdos.zlang.microterm.v1") {
  const lines = source.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith("#"));
  const accepted = profile === "zdos.videotex.native.v1"
    ? lines.every((line) => /^status node\.profile$|^emit .+$|^storage\.read "\.videotex_index"$|^attest videotex\.session\.initialized$/.test(line))
    : profile === "zdos.evidence.append.v1"
      ? lines.every((line) => /^storage\.append "evidence\.receipt"$|^storage\.read "evidence\.recent"$|^attest evidence\.batch\.committed$/.test(line))
      : profile === "zdos.zlang.microterm.v1" && lines.every((line) => /^(help|emit .+)$/.test(line));
  const denied = accepted ? [] : lines.filter((line) => !((profile === "zdos.videotex.native.v1" && /^status node\.profile$|^emit .+$|^storage\.read "\.videotex_index"$|^attest videotex\.session\.initialized$/.test(line)) || (profile === "zdos.evidence.append.v1" && /^storage\.append "evidence\.receipt"$|^storage\.read "evidence\.recent"$|^attest evidence\.batch\.committed$/.test(line)) || (profile === "zdos.zlang.microterm.v1" && /^(help|emit .+)$/.test(line))));
  return {
    schema: "zdos.zlang.validator.v1",
    profile,
    accepted: lines.length > 0 && accepted,
    errors: denied.map((line) => `Instruction denied by ${profile}: ${line}`),
    denied,
    operations: lines.filter((line) => !denied.includes(line)),
    output: lines.filter((line) => !denied.includes(line)).map((line) => line.startsWith("emit ") ? line.slice(5) : line),
    instructionCount: lines.length,
    policy: "DEFAULT-DENY",
    mode: "server-side validation only",
    execution: "DENIED",
  };
}

export async function fetchNodeStatus(): Promise<{ status: ZdosNodeStatus; payload: unknown; detail: string; checked_at: string }> {
  const checkedAt = new Date().toISOString();
  const url = process.env.ZDOS_NODE_STATUS_URL || "https://x-zdos.it/api/node/core-01/status";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url, { headers: { Accept: "application/json" }, signal: controller.signal });
    if (!response.ok) return { status: "OFFLINE", payload: null, detail: `HTTP ${response.status}`, checked_at: checkedAt };
    const payload = await response.json() as Record<string, unknown>;
    if (payload.schema !== ZDOS_NODE_STATUS_SCHEMA || payload.node_id !== ZDOS_NODE_ID) return { status: "OFFLINE", payload: null, detail: "invalid node status payload", checked_at: checkedAt };
    const heartbeat = typeof payload.heartbeat_at === "string" ? Date.parse(payload.heartbeat_at) : Number.NaN;
    const fresh = Number.isFinite(heartbeat) && Date.now() - heartbeat >= 0 && Date.now() - heartbeat <= 90_000;
    return { status: payload.status === "ONLINE" && fresh ? "ONLINE" : payload.status === "ONLINE" ? "STALE" : "OFFLINE", payload, detail: fresh ? "recent HTTPS heartbeat received" : "heartbeat is stale", checked_at: checkedAt };
  } catch (error) {
    return { status: "OFFLINE", payload: null, detail: error instanceof Error && error.name === "AbortError" ? "request timeout" : "HTTPS request failed", checked_at: checkedAt };
  } finally { clearTimeout(timeout); }
}
