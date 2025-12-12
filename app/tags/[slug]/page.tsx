import { notFound } from 'next/navigation'
import { prisma } from '../../lib/prisma'
import PostCard from '@/app/components/PostCard'

interface TagPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: TagPageProps) {
  const { slug } = await params
  const tag = await prisma.tag.findUnique({ where: { slug } })
  
  if (!tag) return {}
  
  return {
    title: `Posts tagged "${tag.name}"`,
    description: tag.description || `All posts about ${tag.name}`,
  }
}

export async function generateStaticParams() {
  const tags = await prisma.tag.findMany({
    select: { slug: true }
  })

  return tags.map((tag) => ({
    slug: tag.slug,
  }))
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params
  
  const tag = await prisma.tag.findUnique({
    where: { slug },
    include: {
      posts: {
        include: {
          post: {
            include: {
              tags: {
                include: { tag: true }
              }
            }
          }
        },
        where: {
          post: { published: true }
        }
      }
    }
  })

  if (!tag) {
    notFound()
  }

  const posts = tag.posts.map(({ post }) => post)

  return (
    <div className="max-w-6xl mx-auto py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Posts tagged "<span className="text-pastel-blue">{tag.name}</span>"
        </h1>
        {tag.description && (
          <p className="text-xl text-muted-foreground">
            {tag.description}
          </p>
        )}
        <p className="text-muted-foreground mt-2">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'}
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-2xl">
          <p className="text-muted-foreground">No posts with this tag yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}