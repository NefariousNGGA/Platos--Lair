import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { Calendar, Clock, Tag } from 'lucide-react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import ReactionButtons from '@/app/components/ReactionButtons'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: {
      tags: {
        include: { tag: true }
      }
    }
  })

  if (!post) return {}

  return {
    title: post.title,
    description: post.excerpt || `Read ${post.title} on Minimalist Blog`,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      authors: ['Your Name'],
    },
  }
}

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true }
  })

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: {
      tags: {
        include: { tag: true }
      }
    }
  })

  if (!post) {
    notFound()
  }

  // Increment view count
  await prisma.post.update({
    where: { id: post.id },
    data: { views: { increment: 1 } }
  })

  // Parse markdown
  const htmlContent = marked(post.content || '')
  const cleanHtml = DOMPurify.sanitize(htmlContent)

  return (
    <article className="max-w-3xl mx-auto">
      {/* Post Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          {post.publishedAt && (
            <>
              <Calendar size={14} />
              <time dateTime={post.publishedAt.toISOString()}>
                {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
              </time>
              <span className="mx-2">•</span>
            </>
          )}
          <Clock size={14} />
          <span>{post.readingTime} min read</span>
          {post.views > 0 && (
            <>
              <span className="mx-2">•</span>
              <span>{post.views} views</span>
            </>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-xl text-muted-foreground mb-6">
            {post.excerpt}
          </p>
        )}

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map(({ tag }) => (
              <a
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-accent hover:bg-accent/80 transition-colors"
              >
                <Tag size={12} />
                {tag.name}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="mb-8 rounded-2xl overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* Post Content */}
      <div 
        className="prose prose-lg dark:prose-invert max-w-none mb-8"
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />

      {/* Reactions */}
      <div className="border-t pt-8 mt-8">
        <ReactionButtons postId={post.id} />
      </div>

      {/* Post Footer */}
      <footer className="mt-12 pt-8 border-t">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Posted {post.publishedAt && format(new Date(post.publishedAt), 'MMMM d, yyyy')}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`/posts/${post.slug}#comments`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Add comment
            </a>
            <a
              href={`/posts/${post.slug}#share`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Share post
            </a>
          </div>
        </div>
      </footer>
    </article>
  )
}