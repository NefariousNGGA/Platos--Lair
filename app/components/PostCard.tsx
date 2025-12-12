import Link from 'next/link'
import { Calendar, Clock } from 'lucide-react'

interface PostCardProps {
  post: {
    id: string
    slug: string
    title: string
    excerpt?: string | null
    coverImage?: string | null
    publishedAt?: Date | null
    readingTime?: number | null
    tags?: Array<{
      tag: {
        name: string
        slug: string
      }
    }>
  }
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border bg-card transition-all hover:shadow-lg">
      {post.coverImage && (
        <div className="aspect-video overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          {post.publishedAt && (
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          )}
          {post.readingTime && (
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {post.readingTime} min read
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold mb-3 group-hover:text-pastel-blue transition-colors">
          <Link href={`/posts/${post.slug}`} className="before:absolute before:inset-0">
            {post.title}
          </Link>
        </h3>

        {post.excerpt && (
          <p className="text-muted-foreground mb-4 line-clamp-2">
            {post.excerpt}
          </p>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map(({ tag }) => (
              <Link
                key={tag.slug}
                href={`/tags/${tag.slug}`}
                className="text-xs px-3 py-1 rounded-full bg-accent hover:bg-accent/80 transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}