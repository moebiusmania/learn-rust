/**
 * Tiny Rust tokenizer → HTML with .tok-* classes. Runs both at build time
 * (widget frontmatter) and in the browser (playground editor). It is meant
 * for short teaching snippets, not as a full grammar.
 */
const KEYWORDS = new Set(
  ('as async await break const continue crate dyn else enum extern false fn for if impl in let loop match mod move mut pub ref ' +
    'return self Self static struct super trait true type union unsafe use where while yield box').split(' '),
);
const PRIMITIVES = new Set(
  'i8 i16 i32 i64 i128 isize u8 u16 u32 u64 u128 usize f32 f64 bool char str'.split(' '),
);

const RULES: [string, RegExp][] = [
  ['com', /^\/\/[^\n]*/],
  ['com', /^\/\*[\s\S]*?(?:\*\/|$)/],
  ['attr', /^#!?\[[^\]\n]*\]?/],
  ['str', /^b?r(#*)"[\s\S]*?(?:"\1|$)/],
  ['str', /^b?"(?:\\[\s\S]|[^"\\])*(?:"|$)/],
  ['str', /^b?'(?:\\(?:x[0-9a-fA-F]{2}|u\{[0-9a-fA-F]+\}|.)|[^\\'\n])'/],
  ['life', /^'[A-Za-z_]\w*/],
  ['num', /^(?:0x[\da-fA-F_]+|0o[0-7_]+|0b[01_]+|\d[\d_]*(?:\.\d[\d_]*)?(?:[eE][+-]?\d+)?)(?:_?(?:[iu](?:8|16|32|64|128|size)|f32|f64))?/],
  ['mac', /^[A-Za-z_]\w*!/],
  ['ident', /^[A-Za-z_]\w*/],
];

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function highlightRust(code: string): string {
  let out = '';
  let i = 0;
  let plain = '';
  const flush = () => {
    if (plain) out += escapeHtml(plain);
    plain = '';
  };
  outer: while (i < code.length) {
    const rest = code.slice(i);
    for (const [kind, re] of RULES) {
      const m = re.exec(rest);
      if (!m) continue;
      const text = m[0];
      let cls: string | null = kind;
      if (kind === 'ident') {
        if (KEYWORDS.has(text)) cls = 'kw';
        else if (PRIMITIVES.has(text) || /^[A-Z]/.test(text)) cls = 'type';
        else if (/^\s*(?:::<[^>]*>)?\s*\(/.test(code.slice(i + text.length))) cls = 'fn';
        else cls = null;
      }
      flush();
      out += cls ? `<span class="tok-${cls}">${escapeHtml(text)}</span>` : escapeHtml(text);
      i += text.length;
      continue outer;
    }
    plain += code[i];
    i++;
  }
  flush();
  return out;
}

/** Highlights and splits into per-line HTML (for .code-lines steppers). */
export function highlightRustLines(code: string): string[] {
  // Highlight line by line so spans never cross line boundaries.
  return code.replace(/\n$/, '').split('\n').map((line) => highlightRust(line) || ' ');
}
