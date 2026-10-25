import en from "../i18n/en";
import kn from "../i18n/kn";

// This last-resort server response works even when the app cannot hydrate.
export function renderErrorPage(): string {
  const escape = (s: string) => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(en.errorPage.title)}</title>
  <style>:root{--navy:#0B1B3F;--blue:#2563EB;--background:#F5F7FB;--surface:#fff}body{font:18px/1.6 system-ui;background:var(--background);color:var(--navy);max-width:36rem;margin:4rem auto;padding:1rem}a{color:var(--blue)}section{background:var(--surface);padding:1.5rem;border-radius:1rem;margin-bottom:1rem}</style></head><body>
  ${[["en",en],["kn",kn]].map(([lang, d]) => {
    const dict = d as typeof en;
    return `<section lang="${lang}"><h1>${escape(dict.errorPage.title)}</h1><p>${escape(dict.errorPage.body)}</p><a href="/">${escape(dict.common.backHome)}</a></section>`;
  }).join("")}</body></html>`;
}

