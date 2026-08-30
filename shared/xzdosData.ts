export type VerificationStatus = "VERIFIED" | "PREPARED" | "ROADMAP" | "NOT_VERIFIED";

export const ecosystemCatalog = [
  { slug: "zdos", name: "ZDOS", role: "Kernel, distro, build x86_64, boot QEMU e strumenti Evidence Chain.", status: "VERIFIED" as const, boundary: "Bare-metal x86_64 verificato; niente filesystem, rete o processi utente dichiarati nel profilo attuale.", repositoryUrl: "https://github.com/high-cde/ZDOS", surfaceUrl: "https://x-zdos.it/" },
  { slug: "zlang", name: "Zlang", role: "Linguaggio, compilatore, ZLB2 v2.5 e runtime bytecode.", status: "VERIFIED" as const, boundary: "Profilo esplicito: emit e storage.read confinato; sintassi non definita rifiutata.", repositoryUrl: "https://github.com/high-cde/Zlang", surfaceUrl: "https://x-zdos.it/#runtime" },
  { slug: "zdos-organism", name: "zdos-organism", role: "Runtime bio-computazionale sperimentale e organismo digitale modulare.", status: "PREPARED" as const, boundary: "Foundation/staging; separato dal percorso minimo del kernel ZDOS.", repositoryUrl: "https://github.com/high-cde/zdos-organism", surfaceUrl: "https://x-zdos.it/#ecosystem" },
  { slug: "zdos-lab", name: "ZDOS Lab", role: "Forge per catalogo, contratti, orchestrazione, workspace e artefatti.", status: "PREPARED" as const, boundary: "Coordina fonti ufficiali senza sostituire repository o prove sorgente.", repositoryUrl: "https://github.com/high-cde/ZDOS-lab-v1", surfaceUrl: "https://x-zdos.it/#ecosystem" },
  { slug: "zdos-sec-portal", name: "ZDOS-SEC-PORTAL", role: "HUD operativa, telemetry, ledger locale e integrazione build.", status: "PREPARED" as const, boundary: "Prototipo: compilazione esterna solo con auth, sandbox, timeout e isolamento.", repositoryUrl: "https://github.com/high-cde/ZDOS-SEC-PORTAL", surfaceUrl: "https://zdos-sec.it/" },
  { slug: "z-cybercore", name: "Z-CYBERCORE", role: "Security Operations autorizzate, scope, finding, safe probes ed evidenze.", status: "ROADMAP" as const, boundary: "Default-deny/read-only; niente exploit, brute force, evasione, persistence o DoS.", repositoryUrl: "https://github.com/high-cde/Z-CYBERCORE", surfaceUrl: "https://zdos-sec.it/" },
];

export const evidenceCatalog = [
  { slug: "foundation-release", title: "Foundation Release v0.2.0", kind: "Release / ISO", status: "VERIFIED" as const, summary: "ISO x86_64 bootable con GRUB Multiboot2 e boot end-to-end in QEMU.", releaseTag: "v0.2.0", commitSha: "6d33514793568259c765997064223743031d3ef0", checksum: "f2f9e5003f86f7f2f0ce702b321dc55490e782341896d8b1860a8fe8c28dc023", sourceUrl: "https://github.com/high-cde/ZDOS/releases/tag/v0.2.0", artifactUrl: "https://github.com/high-cde/ZDOS/releases/download/v0.2.0/zdos-x86_64.iso" },
  { slug: "zlb2-contract", title: "Contratto bytecode ZLB2 v2.5", kind: "Contract", status: "VERIFIED" as const, summary: "Magic ZLB2, versione 2.5, opcode espliciti, lunghezze controllate e HALT deterministico.", commitSha: "74958a3452897694f022ebfc8e2097702f3ba73a", sourceUrl: "https://github.com/high-cde/Zlang/blob/main/docs/zdos-x86_64-profile.md" },
  { slug: "qemu-boot", title: "Boot seriale QEMU x86_64", kind: "Boot proof", status: "VERIFIED" as const, summary: "Percorso verificabile da sorgente Zlang a bytecode, kernel, ISO e output seriale.", commitSha: "6d33514793568259c765997064223743031d3ef0", sourceUrl: "https://github.com/high-cde/ZDOS/actions", artifactUrl: "https://github.com/high-cde/ZDOS/releases/download/v0.2.0/zdos-x86_64.manifest" },
  { slug: "storage-read-v1", title: "Capability storage.read-v1", kind: "Capability", status: "PREPARED" as const, summary: "Lettura read-only confinata al bridge Linux con namespace, quota, path relativo e hash.", sourceUrl: "https://github.com/high-cde/Zlang/blob/main/docs/syscalls.md" },
  { slug: "strict-release-gate", title: "Self-test strict nella CI/release", kind: "Gate", status: "ROADMAP" as const, summary: "Prossimo gate: eseguire il self-test end-to-end senza SKIP, archiviando transcript, manifest e checksum.", commitSha: "6d33514793568259c765997064223743031d3ef0", sourceUrl: "https://github.com/high-cde/ZDOS/blob/main/tools/zdos-selftest.sh", artifactUrl: "https://github.com/high-cde/ZDOS/releases/download/v0.2.0/zdos-x86_64.manifest" },
];

export const retroSources = [
  { title: "Atari 2600", year: "1977", summary: "Cartucce intercambiabili, accessibilità e diffusione del videogioco domestico.", sourceUrl: "https://www.museumofplay.org/toys/atari-2600-game-system/" },
  { title: "Commodore 64", year: "1982", summary: "Computer domestico accessibile con MOS 6510, 64 KB, BASIC, grafica e audio.", sourceUrl: "https://americanhistory.si.edu/collections/object/nmah_334636" },
  { title: "Amiga", year: "1985", summary: "Multitasking, grafica e audio come strumenti di creatività personale.", sourceUrl: "https://computerhistory.org/blog/amiga-computing-at-the-computer-history-museum/" },
];

export const zlangSupported = ["emit", "storage.read"] as const;
