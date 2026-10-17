/**
 * Institute of Da'wa Islamiyya (IDI) - Mailbox Security & Sanitization
 * Safely sanitizes incoming & outgoing HTML email bodies to prevent XSS.
 */

/**
 * Escapes HTML characters for plain text display
 */
export function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Converts plain text into safe, readable HTML with line breaks and autolinked URLs
 */
export function plainTextToSafeHtml(plainText: string): string {
  if (!plainText) return '';
  const escaped = escapeHtml(plainText);
  // Convert URLs to clickable links
  const linked = escaped.replace(
    /(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #006d44; text-decoration: underline;">$1</a>'
  );
  // Convert newlines to breaks
  return linked.replace(/\n/g, '<br />');
}

/**
 * Strips HTML tags and returns a short plain-text snippet (e.g. for email list preview)
 */
export function extractSnippet(htmlOrText: string, maxLength: number = 140): string {
  if (!htmlOrText) return '';
  // Remove script and style tags and content
  let text = htmlOrText
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    // Replace breaks and paragraphs with spaces
    .replace(/<br\s*[\/]?>/gi, ' ')
    .replace(/<\/(p|div|h[1-6]|li)>/gi, ' ')
    // Strip remaining tags
    .replace(/<[^>]+>/g, '')
    // Unescape common HTML entities
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#039;/gi, "'")
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Sanitizes HTML content for safe rendering in email view.
 * Removes all dangerous script elements, event listeners, and dangerous protocols.
 */
export function sanitizeEmailHtml(html: string): string {
  if (!html) return '';

  let sanitized = html;

  // 1. Remove dangerous executable containers: scripts, applets, objects, embeds, iframes, forms
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  sanitized = sanitized.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
  sanitized = sanitized.replace(/<applet\b[^<]*(?:(?!<\/applet>)<[^<]*)*<\/applet>/gi, '');
  sanitized = sanitized.replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '');
  sanitized = sanitized.replace(/<base\b[^>]*>/gi, '');
  sanitized = sanitized.replace(/<link\b[^>]*>/gi, '');
  sanitized = sanitized.replace(/<meta\b[^>]*>/gi, '');

  // 2. Strip inline styles that try to use behavior, expression, or javascript: urls
  sanitized = sanitized.replace(/style=["'][^"']*expression\([^"']*["']/gi, '');
  sanitized = sanitized.replace(/style=["'][^"']*behavior:[^"']*["']/gi, '');

  // 3. Remove all on* event attributes (onclick, onload, onerror, onmouseover, etc.)
  sanitized = sanitized.replace(/\s+on[a-zA-Z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');

  // 4. Strip dangerous URI schemes in href and src (javascript:, vbscript:, data:text/html)
  sanitized = sanitized.replace(
    /\s+(href|src)\s*=\s*(['"])\s*(?:javascript|vbscript|data:(?!image\/)):.*?\2/gi,
    ' $1="#"'
  );

  // 5. Ensure all links open in a new tab with noopener
  sanitized = sanitized.replace(/<a\b([^>]*)>/gi, (match, attrs) => {
    let cleanAttrs = attrs.replace(/\btarget\s*=\s*['"][^'"]*['"]/gi, '');
    cleanAttrs = cleanAttrs.replace(/\brel\s*=\s*['"][^'"]*['"]/gi, '');
    return `<a ${cleanAttrs} target="_blank" rel="noopener noreferrer">`;
  });

  return sanitized;
}
