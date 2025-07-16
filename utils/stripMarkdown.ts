export function stripMarkdown(text: string): string {
  return text
    .replace(/^###\s*(.+)$/gm, (_, title) => `\n\n${title.toUpperCase()}\n`)
    .replace(/^(\*|-)\s+/gm, '• ')
    .replace(/^(\d+\.\s+)/gm, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`+/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
