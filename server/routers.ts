import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { listEcosystemComponents, listEvidenceRecords } from "./db";
import { fetchNodeStatus, getZcommCatalog, getZcommPage, validateZlang, zlangValidationInput } from "./microcosm";

const safeRelativePath = z.string().regex(/^(?!\/)(?!.*\.\.)[A-Za-z0-9_./-]{1,180}$/, "Il percorso deve essere relativo al namespace autorizzato");

function validateLegacyZlang(source: string) {
  const lines = source.split(/\r?\n/);
  const output: string[] = [];
  const errors: string[] = [];
  let instructionCount = 0;
  for (let index = 0; index < lines.length; index++) {
    const raw = lines[index] ?? "";
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    if (line.startsWith("emit ")) {
      const value = line.slice(5).trim();
      if (!value) errors.push(`Riga ${index + 1}: emit richiede un testo.`);
      else { instructionCount++; output.push(value); }
      continue;
    }
    const storage = line.match(/^storage\.read\s+"([^"\n]+)"$/);
    if (storage) {
      const path = storage[1];
      const pathResult = safeRelativePath.safeParse(path);
      if (!pathResult.success) errors.push(`Riga ${index + 1}: path rifiutato; usare solo un percorso relativo allowlisted.`);
      else { instructionCount++; output.push(`READ-ONLY REQUEST · ${path}`); }
      continue;
    }
    errors.push(`Riga ${index + 1}: istruzione non supportata o non autorizzata. Il profilo ZLB2 v2.5 accetta solo emit e storage.read.`);
  }
  return { accepted: errors.length === 0, errors, output, instructionCount, profile: "ZLB2 v2.5", mode: "server-side validation only" };
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  ecosystem: router({ list: publicProcedure.query(() => listEcosystemComponents()) }),
  evidence: router({ list: publicProcedure.query(() => listEvidenceRecords()) }),
  node: router({
    status: publicProcedure.query(() => fetchNodeStatus()),
  }),
  zcomm: router({
    catalog: publicProcedure.query(() => getZcommCatalog()),
    page: publicProcedure.input(z.object({ code: z.string().regex(/^\*\d{2}#$/) })).query(({ input }) => getZcommPage(input.code)),
  }),
  zlang: router({
    validate: publicProcedure.input(zlangValidationInput).query(({ input }) => input.profile ? validateZlang(input.source, input.profile) : validateLegacyZlang(input.source)),
  }),
});

export type AppRouter = typeof appRouter;
