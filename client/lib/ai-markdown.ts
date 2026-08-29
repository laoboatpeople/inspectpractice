// ── Shared AI markdown renderer (SVG pass-through) ──
// Used by the student tutor page and the admin AI generator.
// The AI emits raw inline <svg>...</svg> for schema/diagram questions.
// We protect those blocks from the markdown regexes, then re-insert them.
// Also renders markdown (headings, bold, lists, numbered lists, links,
// tables) and LaTeX (display \[..\], inline \(..\)) converted to readable
// unicode (Ω, Δ, √, φ, η, ×, ², …), with paragraph/line spacing.
// Only ever applied to ASSISTANT content (trusted, from our own backend).

function cleanLatex(math: string): string {
  return math
    // Functions & roots
    .replace(/\\sqrt\{([^}]*)\}/g, '√($1)')
    .replace(/\\text\{([^}]*)\}/g, '$1')
    .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '($1) / ($2)')
    .replace(/\\dfrac\{([^}]*)\}\{([^}]*)\}/g, '($1) / ($2)')
    .replace(/\\tfrac\{([^}]*)\}\{([^}]*)\}/g, '($1) / ($2)')
    .replace(/\\cfrac\{([^}]*)\}\{([^}]*)\}/g, '($1) / ($2)')
    // Operators
    .replace(/\\times/g, '×')
    .replace(/\\cdot/g, '·')
    .replace(/\\div/g, '÷')
    .replace(/\\approx/g, '≈')
    .replace(/\\geq/g, '≥')
    .replace(/\\leq/g, '≤')
    .replace(/\\neq/g, '≠')
    .replace(/\\ne/g, '≠')
    .replace(/\\equiv/g, '≡')
    .replace(/\\propto/g, '∝')
    .replace(/\\pm/g, '±')
    .replace(/\\infty/g, '∞')
    .replace(/\\prime/g, '′')
    .replace(/\\in/g, '∈')
    .replace(/\\notin/g, '∉')
    .replace(/\\subset/g, '⊂')
    .replace(/\\subseteq/g, '⊆')
    .replace(/\\cup/g, '∪')
    .replace(/\\cap/g, '∩')
    // Greek & units (order matters: multi-char first, \Omega before \pi)
    .replace(/\\Omega/g, 'Ω')
    .replace(/\\Delta/g, 'Δ')
    .replace(/\\Phi/g, 'Φ')
    .replace(/\\Sigma/g, 'Σ')
    .replace(/\\Theta/g, 'Θ')
    .replace(/\\Lambda/g, 'Λ')
    .replace(/\\varphi/g, 'φ')
    .replace(/\\phi/g, 'φ')
    .replace(/\\eta/g, 'η')
    .replace(/\\mu/g, 'μ')
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\gamma/g, 'γ')
    .replace(/\\delta/g, 'δ')
    .replace(/\\epsilon/g, 'ε')
    .replace(/\\varepsilon/g, 'ε')
    .replace(/\\theta/g, 'θ')
    .replace(/\\lambda/g, 'λ')
    .replace(/\\rho/g, 'ρ')
    .replace(/\\sigma/g, 'σ')
    .replace(/\\tau/g, 'τ')
    .replace(/\\omega/g, 'ω')
    .replace(/\\kappa/g, 'κ')
    .replace(/\\pi/g, 'π')
    .replace(/\\deg/g, '°')
    .replace(/\\degree/g, '°')
    // Functions
    .replace(/\\arcsin/g, 'arcsin')
    .replace(/\\arccos/g, 'arccos')
    .replace(/\\arctan/g, 'arctan')
    .replace(/\\sinh/g, 'sinh')
    .replace(/\\cosh/g, 'cosh')
    .replace(/\\tanh/g, 'tanh')
    .replace(/\\cot/g, 'cot')
    .replace(/\\sec/g, 'sec')
    .replace(/\\csc/g, 'csc')
    .replace(/\\log/g, 'log')
    .replace(/\\ln/g, 'ln')
    .replace(/\\exp/g, 'exp')
    .replace(/\\cos/g, 'cos')
    .replace(/\\sin/g, 'sin')
    .replace(/\\tan/g, 'tan')
    // Spaces & misc
    .replace(/\\quad/g, ' ')
    .replace(/\\qquad/g, ' ')
    .replace(/\\,/g, ' ')
    .replace(/\\;/g, ' ')
    .replace(/\\:/g, ' ')
    .replace(/\\!/g, '')
    .replace(/\\ /g, ' ')
    // Decimal separators in French LaTeX: 0{,}63 → 0,63 (must run before \{ → {)
    .replace(/\\\{,\\\}/g, ',')
    .replace(/\\\{\.\\\}/g, '.')
    .replace(/\\%/g, '%')
    .replace(/\\displaystyle/g, '')
    .replace(/\\left/g, '')
    .replace(/\\right/g, '')
    .replace(/\\begin\{[^}]*\}/g, '')
    .replace(/\\end\{[^}]*\}/g, '')
    .replace(/\\(?:mathrm|mathbf|mathit|mathbb|mathcal)\{([^}]*)\}/g, '$1')
    .replace(/\\overline\{([^}]*)\}/g, '$1')
    .replace(/\\underline\{([^}]*)\}/g, '$1')
    .replace(/\\vec\{([^}]*)\}/g, '$1')
    .replace(/\\hat\{([^}]*)\}/g, '$1')
    .replace(/\\bar\{([^}]*)\}/g, '$1')
    .replace(/\\dot\{([^}]*)\}/g, '$1')
    .replace(/\\\{/g, '{')
    .replace(/\\\}/g, '}')
    // Any leftover backslash (e.g. line-break \\ inside align) becomes a space
    .replace(/\\\\/g, ' ')
    // Superscripts & subscripts (after \text/\mathrm cleanup)
    .replace(/\^\{([^}]*)\}/g, '<sup>$1</sup>')
    .replace(/\^([0-9]+)/g, '<sup>$1</sup>')
    .replace(/\_\{([^}]*)\}/g, '<sub>$1</sub>')
    .replace(/\_([a-zA-Z0-9]+)/g, '<sub>$1</sub>')
    .replace(/\s+/g, ' ')
    .trim();
}

export function renderAIResponse(content: string): string {
  const svgBlocks: string[] = [];
  let html = content.replace(/<svg[\s\S]*?<\/svg>/gi, (m) => {
    svgBlocks.push(m);
    return `\u0000SVG${svgBlocks.length - 1}\u0000`;
  });

  // Defensive: the AI occasionally emits an UNCLOSED <svg> (truncated response).
  // An unclosed <svg> in the DOM swallows the rest of the bubble and renders as
  // a blank white box — strip everything from an unclosed <svg> to the end.
  html = html.replace(/<svg[\s\S]*$/i, '');

  // Collect generated anchors, then re-insert at the end so bare-URL linkify
  // can never double-wrap an URL already inside an href attribute.
  const linkBlocks: string[] = [];
  const anchor = (href: string, text: string): string => {
    linkBlocks.push(
      `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-blue underline hover:opacity-80 break-all">${text}</a>`
    );
    return `\u0000LINK${linkBlocks.length - 1}\u0000`;
  };

  html = html
    // Markdown headings (# → h3, ## → h4, ### → h5) — keep visual hierarchy small in chat
    .replace(/^### (.+)$/gm, '<h5 class="text-sm font-semibold mt-3 mb-1 text-text-primary">$1</h5>')
    .replace(/^## (.+)$/gm, '<h4 class="text-base font-semibold mt-3 mb-1 text-text-primary">$1</h4>')
    .replace(/^# (.+)$/gm, '<h3 class="text-lg font-semibold mt-3 mb-1 text-text-primary">$1</h3>')
    // Bold markers
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Horizontal rules
    .replace(/^---+$/gm, '<hr class="border-border my-2" />')
    // Lines starting with - or * as list items
    .replace(/^[-*] (.+)$/gm, '<li class="ml-4 mb-1.5 text-text-secondary">$1</li>')
    // Numbered list items (1. item)
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 mb-1.5 text-text-secondary">$1. $2</li>')
    // Markdown links [text](url) → clickable anchors (before bare-URL linkify)
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      (_m, text: string, url: string) => anchor(url, text)
    )
    // Linkify bare URLs (https/http) into clickable anchors
    .replace(
      /(https?:\/\/[^\s<]+[^\s<.,;:!?)])/g,
      (_m, url: string) => anchor(url, url)
    );

  // Display math \[ ... \]
  html = html.replace(/\\\[([\s\S]*?)\\\]/g, (_m, math: string) => {
    const cleaned = cleanLatex(math);
    return `<pre class="bg-[#0A0E1A] border border-border p-3 rounded-lg my-2.5 text-sm font-mono overflow-x-auto text-text-primary">${cleaned}</pre>`;
  });

  // Inline math \( ... \)
  html = html.replace(/\\\(([\s\S]*?)\\\)/g, (_m, math: string) => {
    const cleaned = cleanLatex(math);
    return `<code class="bg-[#0A0E1A] px-2 py-0.5 rounded text-xs font-mono text-text-primary">${cleaned}</code>`;
  });

  // ── Markdown tables: | a | b | with --- separator → real <table> ──
  const tableBlocks: string[] = [];
  html = html.replace(/((?:^\s*\|.*\|\s*$[\r\n]*)+)/gm, (block) => {
    const lines = block
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.startsWith('|') && l.endsWith('|') && l.length > 2);
    if (lines.length < 2) return block;
    const isSep = (l: string) => /^\|[\s:|-]+\|$/.test(l);
    const cells = (r: string) => r.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
    let header: string | null = null;
    let body = lines;
    if (isSep(lines[1] ?? '')) {
      header = lines[0];
      body = lines.slice(2);
    }
    let t = '<div class="overflow-x-auto my-2.5"><table class="w-full text-xs border-collapse">';
    if (header) {
      t += '<thead><tr>' + cells(header)
        .map((c) => `<th class="border border-border bg-[#0A0E1A] px-2 py-1.5 text-left font-semibold text-text-primary">${c}</th>`)
        .join('') + '</tr></thead>';
    }
    t += '<tbody>';
    for (const r of body) {
      t += '<tr>' + cells(r)
        .map((c) => `<td class="border border-border px-2 py-1.5 text-text-secondary">${c}</td>`)
        .join('') + '</tr>';
    }
    t += '</tbody></table></div>';
    const idx = tableBlocks.length;
    tableBlocks.push(t);
    return `\u0000TABLE${idx}\u0000`;
  });

  // ── Convert remaining newlines to visible spacing (HTML collapses raw \n) ──
  // Double newlines = paragraph break; single newlines = line break.
  html = html.replace(/\n{2,}/g, '<div class="h-2.5"></div>').replace(/\n/g, '<br/>');

  // Re-insert the preserved SVG blocks untouched
  html = html.replace(/\u0000SVG(\d+)\u0000/g, (_m, i: string) => svgBlocks[Number(i)] ?? '');
  // Re-insert generated link anchors
  html = html.replace(/\u0000LINK(\d+)\u0000/g, (_m, i: string) => linkBlocks[Number(i)] ?? '');
  // Re-insert table blocks
  html = html.replace(/\u0000TABLE(\d+)\u0000/g, (_m, i: string) => tableBlocks[Number(i)] ?? '');

  return html;
}
