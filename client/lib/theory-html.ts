/**
 * Server-safe markdown → HTML converter for theory content.
 * Mirrors the client-side TheoryRenderer in app/(app)/theory/page.tsx:
 * splits SVG blocks out, parses headings/bullets/numbered/hr/paragraphs,
 * and wraps SVGs in the standard diagram container.
 */

export function theoryContentToHtml(content: string): string {
  if (!content) return '';
  const parts = content.split(/(<svg[\s\S]*?<\/svg>)/gi);
  const out: string[] = [];

  for (const part of parts) {
    if (!part.trim()) continue;

    // SVG block — pass through in the standard diagram container
    if (part.trim().toLowerCase().startsWith('<svg')) {
      out.push(
        `<div class="my-4 flex justify-center overflow-x-auto rounded-card border border-border bg-white p-3">${part.trim()}</div>`
      );
      continue;
    }

    const lines = part.split('\n');
    let inList: 'ul' | 'ol' | null = null;
    let inFence = false;
    let inCodeOpen = false;

    const closeList = () => {
      if (inList) {
        out.push(`</${inList}>`);
        inList = null;
      }
    };

    const closeCode = () => {
      if (inCodeOpen) {
        out.push('</pre>');
        inCodeOpen = false;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Markdown table: header row followed by a separator row (|---|)
      if (
        trimmed.startsWith('|') &&
        i + 1 < lines.length &&
        /^\|[\s\-|:]+\|?$/.test(lines[i + 1].trim())
      ) {
        closeList();
        closeCode();
        const header = trimmed
          .split('|')
          .map((c) => c.trim())
          .filter((c) => c !== '');
        const body: string[][] = [];
        i += 1; // skip separator
        while (i + 1 < lines.length && lines[i + 1].trim().startsWith('|')) {
          i += 1;
          body.push(
            lines[i]
              .split('|')
              .map((c) => c.trim())
              .filter((c) => c !== '')
          );
        }
        out.push(
          '<div class="my-4 overflow-x-auto rounded-card border border-border"><table class="w-full text-sm"><thead><tr>' +
            header.map((h) => `<th class="border-b border-border px-3 py-2 text-left">${inline(h)}</th>`).join('') +
            '</tr></thead><tbody>' +
            body
              .map(
                (row) =>
                  `<tr>` +
                  row
                    .map(
                      (cell, ci) =>
                        `<td class="border-b border-border px-3 py-2 ${ci === 0 ? 'font-medium' : ''}">${inline(cell)}</td>`
                    )
                    .join('') +
                  `</tr>`
              )
              .join('') +
            '</tbody></table></div>'
        );
        continue;
      }

      // Code fences (```) — toggle and never render the fence markers
      if (trimmed.startsWith('```')) {
        if (inFence) closeCode();
        inFence = !inFence;
        continue;
      }

      // Inside a fence: render as a styled code block (no literal backticks)
      if (inFence) {
        if (!inCodeOpen) {
          out.push('<pre class="overflow-x-auto rounded-lg border border-border bg-white p-3 text-sm">');
          inCodeOpen = true;
        }
        out.push(escapeHtml(trimmed));
        continue;
      }

      const hMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
      if (hMatch) {
        closeList();
        const level = hMatch[1].length;
        const tag = level <= 2 ? 'h2' : level === 3 ? 'h3' : 'h4';
        out.push(`<${tag}>${inline(trimmed.slice(hMatch[1].length + 1))}</${tag}>`);
        continue;
      }

      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (inList !== 'ul') {
          closeList();
          out.push('<ul>');
          inList = 'ul';
        }
        out.push(`<li>${inline(trimmed.slice(2))}</li>`);
        continue;
      }

      if (trimmed.match(/^\d+\.\s+/)) {
        if (inList !== 'ol') {
          closeList();
          out.push('<ol>');
          inList = 'ol';
        }
        out.push(`<li>${inline(trimmed.replace(/^\d+\.\s+/, ''))}</li>`);
        continue;
      }

      if (trimmed === '---') {
        closeList();
        out.push('<hr class="my-6 border-border" />');
        continue;
      }

      closeList();
      out.push(`<p>${inline(trimmed)}</p>`);
    }
    closeList();
    closeCode();
  }

  return out.join('\n');
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function inline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

/** Strip markdown to a plain-text excerpt (for meta descriptions). */
export function theoryToPlainText(content: string, maxChars = 200): string {
  const withoutSvg = content.replace(/<svg[\s\S]*?<\/svg>/gi, '');
  const text = withoutSvg
    .replace(/[#*`>_]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > maxChars ? text.slice(0, maxChars).trimEnd() + '…' : text;
}
