import { remark } from 'remark'
import html from 'remark-html'
import prism from 'remark-prism'

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(html, { sanitize: true })
    .use(prism)
    .process(markdown)
  return result.toString()
}

export function extractExcerpt(markdown: string, maxLength: number = 200): string {
  // Remove code blocks, images, and links
  const plainText = markdown
    .replace(/```[\s\S]*?```/g, '') // Code blocks
    .replace(/`[^`]*`/g, '') // Inline code
    .replace(/!\[.*?\]\(.*?\)/g, '') // Images
    .replace(/\[.*?\]\(.*?\)/g, '') // Links
    .replace(/[#*\-_>`]/g, '') // Markdown symbols
    .replace(/\n+/g, ' ') // Newlines to spaces
    .trim()

  if (plainText.length <= maxLength) return plainText
  return plainText.substring(0, maxLength).trim() + '...'
}

export function calculateReadingTime(markdown: string): number {
  const words = markdown.trim().split(/\s+/).length
  const wordsPerMinute = 200
  return Math.ceil(words / wordsPerMinute)
}

export function countWords(markdown: string): number {
  return markdown.trim().split(/\s+/).length
}