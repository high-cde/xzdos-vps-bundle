import { useMemo, useState } from "react";
import { ArrowUpRight, Check, ChevronRight, Copy, ExternalLink, LockKeyhole, Play, ShieldCheck, Terminal, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { ecosystemCatalog, evidenceCatalog, retroSources } from "@shared/xzdosData";

const statusStyle: Record<string, string> = {
  VERIFIED: "status-verified",
  PREPARED: "status-prepared",
  ROADMAP: "status-roadmap",
  NOT_VERIFIED: "status-unverified",
};

function StatusBadge({ status }: { status: string }) {
  return <span className={cn("status-badge", statusStyle[status] ?? "status-unverified")}><span className="status-dot" />{status}</span>;
}

function SectionKicker({ number, children }: { number: string; children: React.ReactNode }) {
  return <div className="section-kicker"><span>{number}</span><span>{children}</span></div>;
}

const pipeline = [
  { id: "01", label: "ZLANG", title: "Sorgente leggibile", detail: "Profilo .zlang con istruzioni esplicite", status: "VERIFIED", symbol: "λ" },
  { id: "02", label: "ZLB2 v2.5", title: "Contratto bytecode", detail: "Magic, versione, opcode, HALT", status: "VERIFIED", symbol: "⌘" },
  { id: "03", label: "ZDOS", title: "Runtime bare-metal", detail: "Kernel x86_64 con default-deny", status: "VERIFIED", symbol: "◈" },
  { id: "04", label: "QEMU", title: "Boot osservabile", detail: "ISO GRUB Multiboot2 + seriale", status: "VERIFIED", symbol: "▣" },
  { id: "05", label: "EVIDENCE", title: "Provenienza pubblica", detail: "Hash, commit, transcript, manifest", status: "PREPARED", symbol: "◎" },
];

export default function Home() {
  const [activeExample, setActiveExample] = useState("hello");
  const [source, setSource] = useState("# ZLB2 v2.5\nemit ZDOS risponde.\nemit Ogni capability deve lasciare una traccia.");
  const [validation, setValidation] = useState<ReturnType<typeof validateLocal> | null>(null);
  const evidenceQuery = trpc.evidence.list.useQuery();
  const ecosystemQuery = trpc.ecosystem.list.useQuery();
  const nodeQuery = trpc.node.status.useQuery();
  const zcommQuery = trpc.zcomm.catalog.useQuery();
  const validateQuery = trpc.zlang.validate.useQuery({ profile: "zdos.zlang.microterm.v1", source }, { enabled: false, retry: false });
  const evidence = evidenceQuery.data?.length ? evidenceQuery.data : evidenceCatalog;
  const ecosystem = ecosystemQuery.data?.length ? ecosystemQuery.data : ecosystemCatalog;
  const verifiedCount = useMemo(() => evidence.filter(item => item.status === "VERIFIED").length, [evidence]);

  async function runValidation() { const response = await validateQuery.refetch(); if (response.data) setValidation(response.data); }
  function loadExample(name: string) {
    setActiveExample(name);
    setValidation(null);
    setSource(name === "deny" ? "emit Prima riga\nlet secreto = 42\nexec shell\nstorage.read \"../private.key\"" : "# ZLB2 v2.5\nemit ZDOS risponde.\nemit Ogni capability deve lasciare una traccia.");
  }

  return (
    <div className="min-h-screen bg-[#070b11] text-[#f0f4f7] selection:bg-cyan-300 selection:text-[#071017]">
      <header className="site-header"><a href="#top" className="brand"><span className="brand-mark">Z</span><span>ZDOS<span className="brand-sub"> / EVIDENCE ECOSYSTEM</span></span></a><nav className="desktop-nav"><a href="#runtime">Runtime</a><a href="#evidence">Evidence</a><a href="#ecosystem">Ecosystem</a><a href="#security">Security</a><a href="#retro">Retro</a></nav><div className="header-actions"><a className="header-link github-link" href="https://github.com/high-cde/ZDOS" target="_blank" rel="noreferrer">GitHub <ExternalLink size={14} /></a><a className="warroom-button" href="https://warroom.zdos-sec.it/" target="_blank" rel="noreferrer"><LockKeyhole size={14} /> War Room</a></div></header><nav className="mobile-nav container" aria-label="Navigazione mobile"><a href="#runtime">Runtime</a><a href="#evidence">Evidence</a><a href="#ecosystem">Ecosystem</a><a href="#security">Security</a><a href="#retro">Retro</a><a href="https://github.com/high-cde/ZDOS" target="_blank" rel="noreferrer">GitHub</a><a href="https://warroom.zdos-sec.it/" target="_blank" rel="noreferrer">War Room</a></nav><main id="top">
        <section className="hero container">
          <div className="hero-copy"><div className="eyebrow"><span className="pulse" /> FOUNDATION RELEASE / 0.2.0 <span className="eyebrow-divider" /> X86_64 VERIFIED</div><h1>Build what<br /><em>you can prove.</em></h1><p className="hero-lede">Un ecosistema computazionale ispezionabile in cui **Zlang**, runtime, sicurezza e provenienza convergono in una filiera leggibile.</p><div className="hero-actions"><a href="#runtime" className="primary-cta">Segui la filiera <ChevronRight size={16} /></a><a href="#evidence" className="secondary-cta">Vedi le prove <ArrowUpRight size={16} /></a></div><div className="hero-footnote"><span>NO BLACK-BOX CLAIMS</span><span>EVERY CAPABILITY CARRIES A STATE</span></div></div>
          <div className="hero-visual"><div className="visual-grid" /><div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" /><div className="visual-core"><span className="core-tag">PUBLIC TRACE / 01</span><div className="core-symbol">Z</div><span className="core-caption">OBSERVABLE<br />RUNTIME SURFACE</span></div><div className="visual-label label-top">QEMU BOOT PROOF <span>↗</span></div><div className="visual-label label-bottom">SHA256 / VERIFIED <span className="mini-pulse" /></div></div>
        </section>

        <section id="runtime" className="section container runtime-section"><div className="section-heading"><div><SectionKicker number="01">THE PIPELINE</SectionKicker><h2>Dal sorgente<br /><span>alla traccia.</span></h2></div><p>Una capability non è una promessa. È un percorso: ogni passaggio espone un contratto, un limite e un segnale osservabile.</p></div><div className="pipeline-grid">{pipeline.map((step, index) => <div className="pipeline-step" key={step.id}><div className="pipeline-line" /><div className="step-top"><span>{step.id}</span><StatusBadge status={step.status} /></div><div className="step-symbol">{step.symbol}</div><span className="step-label">{step.label}</span><h3>{step.title}</h3><p>{step.detail}</p>{index < pipeline.length - 1 && <span className="step-arrow">→</span>}</div>)}</div><div className="runtime-strip"><span><span className="strip-dot" /> CORE-01 / OBSERVABILITY</span><span>POLICY <b>DEFAULT-DENY</b></span><span>NETWORK <b>NO-LISTENER</b></span><span>MODE <b>READ-ONLY</b></span></div><div className="runtime-strip"><span>NODE <b>{nodeQuery.data?.status ?? "CHECKING"}</b></span><span>ZCOMM <b>{zcommQuery.data?.pages.length ?? 0} PAGES</b></span><span>API <b>SHARED WITH MICROcosm</b></span></div></section>

        <section id="zlang" className="section container playground-section"><div className="section-heading"><div><SectionKicker number="02">ZLANG PLAYGROUND</SectionKicker><h2>Un contratto<br /><span>che rifiuta.</span></h2></div><p>Prova il profilo ZLB2 v2.5. La validazione avviene server-side; ciò che non è definito o autorizzato viene respinto esplicitamente.</p></div><div className="playground-grid"><Card className="code-card"><CardHeader className="code-header"><div className="code-title"><Terminal size={15} /> ZLANG / SOURCE</div><div className="example-tabs"><button className={cn({ active: activeExample === "hello" })} onClick={() => loadExample("hello")}>hello.zlang</button><button className={cn({ active: activeExample === "deny" })} onClick={() => loadExample("deny")}>deny.zlang</button></div></CardHeader><CardContent><Textarea value={source} onChange={event => { setSource(event.target.value); setValidation(null); }} className="code-editor" spellCheck={false} aria-label="Codice Zlang" /><div className="code-footer"><span>PROFILE <b>ZLB2 v2.5</b></span><Button onClick={runValidation} disabled={validateQuery.isFetching} className="run-button"><Play size={14} /> {validateQuery.isFetching ? "Validating…" : "Validate server-side"}</Button></div></CardContent></Card><Card className={cn("output-card", validation?.accepted === false && "output-error")}><CardHeader><div className="output-title"><span className={cn("output-indicator", validation ? (validation.accepted ? "ok" : "error") : "idle")} /> SERVER RESPONSE</div><span className="output-mode">READ-ONLY</span></CardHeader><CardContent>{!validation ? <div className="empty-output"><span className="empty-mark">⌁</span><p>Invia un programma per vedere la decisione del contratto.</p><span>NESSUNA ESECUZIONE · SOLO VALIDAZIONE</span></div> : <div className="validation-result"><div className="decision"><span className={validation.accepted ? "decision-ok" : "decision-no"}>{validation.accepted ? "ACCEPTED" : "REJECTED"}</span><span>{validation.profile}</span></div>{validation.errors.length > 0 && <div className="error-list">{validation.errors.map(error => <p key={error}><X size={13} />{error}</p>)}</div>}{validation.output.length > 0 && <div className="accepted-output"><span>OUTPUT PREVIEW</span>{validation.output.map(line => <code key={line}>{line}</code>)}</div>}<div className="validation-foot">{validation.instructionCount} istruzioni · {validation.mode}</div></div>}</CardContent></Card></div><div className="playground-note"><ShieldCheck size={16} /><span>Capacita condivise con Microcosm: <b>emit</b> e profili allowlisted. Shell, rete, scrittura, path assoluti e traversal non fanno parte del profilo.</span></div></section>

        <section id="evidence" className="section container evidence-section"><div className="section-heading"><div><SectionKicker number="03">PUBLIC EVIDENCE RAIL</SectionKicker><h2>Una release<br /><span>è una ricevuta.</span></h2></div><p>{verifiedCount} evidenze verificabili nel catalogo corrente. Ogni record conserva provenienza, stato e link all’artefatto originale.</p></div><div className="evidence-table"><div className="table-head"><span>RECORD</span><span>TYPE</span><span>STATUS</span><span>PROVENANCE</span><span /></div>{evidence.map(item => <div className="evidence-row" key={item.slug}><div className="evidence-name"><span className="row-index">/</span><div><strong>{item.title}</strong><small>{item.summary}</small></div></div><span className="evidence-kind">{item.kind}</span><StatusBadge status={item.status} /><span className="provenance">{item.releaseTag ?? item.commitSha ?? "PUBLIC CATALOG"}{item.checksum && <small>SHA256 {item.checksum.slice(0, 12)}…</small>}</span><a className="row-link" href={item.sourceUrl ?? "https://github.com/high-cde/ZDOS"} target="_blank" rel="noreferrer" aria-label={`Apri ${item.title}`}><ArrowUpRight size={16} /></a></div>)}</div><div className="checksum-card"><div><span className="checksum-kicker">CURRENT RELEASE / ZDOS v0.2.0</span><strong>f2f9e5003f86f7f2…</strong><small>SHA-256 integrity anchor · x86_64 ISO</small></div><a href="https://github.com/high-cde/ZDOS/releases/latest/download/zdos-x86_64.iso" target="_blank" rel="noreferrer" className="download-link">Download verified ISO <ArrowUpRight size={15} /></a></div></section>

        <section id="ecosystem" className="section container ecosystem-section"><div className="section-heading"><div><SectionKicker number="04">THE ECOSYSTEM</SectionKicker><h2>Sei superfici,<br /><span>una direzione.</span></h2></div><p>Ruoli separati, confini dichiarati, stati non ambigui. Un catalogo non promuove un componente oltre la prova che possiede.</p></div><div className="ecosystem-grid">{ecosystem.map((item, index) => <a key={item.slug} href={item.repositoryUrl ?? "#"} target="_blank" rel="noreferrer" className="ecosystem-card"><div className="eco-top"><span>0{index + 1}</span><StatusBadge status={item.status} /></div><h3>{item.name}</h3><p>{item.role}</p><div className="eco-boundary"><span>BOUNDARY</span>{item.boundary}</div><div className="eco-link">Inspect repository <ArrowUpRight size={14} /></div></a>)}</div></section>

        <section id="security" className="section security-section"><div className="container"><div className="section-heading"><div><SectionKicker number="05">Z-CYBERCORE / SECURITY</SectionKicker><h2>Potente perché<br /><span>misurabile.</span></h2></div><p>Security Operations per programmi autorizzati. Default-deny, evidence-first, human approval. La superficie pubblica osserva; la War Room autenticata conserva il lavoro reale.</p></div><div className="security-grid"><div className="security-map"><div className="map-header"><span>CONTROL MAP</span><span className="online"><span className="mini-pulse" /> SYSTEM READY</span></div>{["PROGRAM / policy + safe harbor", "SCOPE / authorization basis", "EVIDENCE / hash-linked record", "TRIAGE / severity + owner", "DISCLOSURE / coordinated path"].map((line, index) => <div className="map-row" key={line}><span>0{index + 1}</span><b>{line.split(" / ")[0]}</b><small>{line.split(" / ")[1]}</small><Check size={14} /></div>)}<div className="map-footer">DEFAULT-DENY <span>·</span> EVIDENCE-FIRST <span>·</span> AUTHORIZED-ONLY</div></div><div className="security-copy"><div className="boundary-box"><LockKeyhole size={18} /><div><strong>Execution gated</strong><span>Nessuna shell remota. Nessuna azione fuori scope.</span></div></div><div className="boundary-box"><ShieldCheck size={18} /><div><strong>Non-destructive profiles</strong><span>Baseline, header, TLS e inventario passivo.</span></div></div><a href="https://warroom.zdos-sec.it/" target="_blank" rel="noreferrer" className="warroom-card"><div><span>AUTHENTICATED SURFACE</span><strong>Enter the War Room</strong><small>Programs · Assets · Findings · Audit</small></div><ArrowUpRight size={20} /></a></div></div></div></section>

        <section id="retro" className="section container retro-section"><div className="section-heading"><div><SectionKicker number="06">RETRO COMPUTING</SectionKicker><h2>Hardware<br /><span>che insegna.</span></h2></div><p>Una sezione documentaria sul rapporto fra hardware accessibile, programmazione creativa e comunità. La storia ispira; non altera il perimetro runtime.</p></div><div className="retro-grid">{retroSources.map((item, index) => <a href={item.sourceUrl} target="_blank" rel="noreferrer" className={cn("retro-card", `retro-${index}`)} key={item.title}><div className="retro-number">0{index + 1}</div><div className="retro-content"><span>{item.year} / ARCHIVE</span><h3>{item.title}</h3><p>{item.summary}</p><div>Read source <ArrowUpRight size={14} /></div></div></a>)}</div><div className="rights-note"><span>RIGHTS & BOUNDARY</span><p>Questa sezione non distribuisce ROM, BIOS, malware o materiale proprietario. Usa esclusivamente immagini e software di cui possiedi i diritti o distribuiti legalmente.</p></div></section>
      </main>

      <footer className="site-footer container"><a href="#top" className="brand"><span className="brand-mark">Z</span><span>ZDOS<span className="brand-sub"> / BUILD WHAT YOU CAN PROVE</span></span></a><div className="footer-links"><a href="https://github.com/high-cde/ZDOS" target="_blank" rel="noreferrer">GitHub</a><a href="https://zdos-sec.it/" target="_blank" rel="noreferrer">Security</a><a href="https://zdos-hub.it/retro-computing.html" target="_blank" rel="noreferrer">Retro Hub</a></div><span className="footer-copy">FOUNDATION RELEASE / 0.2.0 · © HIGH-CDE</span></footer>
    </div>
  );
}

type LocalValidation = { accepted: boolean; errors: string[]; output: string[]; instructionCount: number; profile: string; mode: string };
function validateLocal(source: string): LocalValidation {
  const errors = source.split(/\r?\n/).filter(line => line.trim() && !line.trim().startsWith("#") && !line.trim().startsWith("emit ") && !/^storage\.read\s+"[^"\n]+"$/.test(line.trim())).map((_, i) => `Istruzione non supportata alla riga ${i + 1}.`);
  return { accepted: errors.length === 0, errors, output: [], instructionCount: 0, profile: "ZLB2 v2.5", mode: "server-side validation only" };
}
