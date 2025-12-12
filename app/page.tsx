import { prisma } from './lib/prisma'
import PostCard from '@/app/components/PostCard'
import StatsPreview from '@/app/components/StatsPreview'

export const revalidate = 3600

async function getPosts() {
  return await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    take: 9,
    include: {
      tags: {
        include: { tag: true }
      }
    }
  })
}

async function getStats() {
  const [postCount, tagCount, totalWords, recentPosts] = await Promise.all([
    prisma.post.count({ where: { published: true } }),
    prisma.tag.count(),
    prisma.post.aggregate({
      where: { published: true },
      _sum: { wordCount: true }
    }),
    prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      select: { title: true, slug: true }
    })
  ])

  return {
    postCount,
    tagCount,
    totalWords: totalWords._sum.wordCount || 0,
    recentPosts
  }
}

export default async function Home() {
  const [posts, stats] = await Promise.all([getPosts(), getStats()])

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
          Welcome to{' '}
          <span className="bg-gradient-to-r from-pastel-pink via-pastel-blue to-pastel-green bg-clip-text text-transparent">
            Plato's Lair
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A thinking space for ideas that linger in shadows, 
          conversations with ghosts of philosophers past, 
          and thoughts too raw for daylight.
        </p>
        <p className="text-sm text-muted-foreground mt-4 max-w-xl mx-auto italic">
          "The unexamined life is not worth living" — but the overexamined one needs a place to rest.
        </p>
      </section>

      {/* Stats Preview */}
      <section className="mb-12">
        <StatsPreview stats={stats} />
      </section>

      {/* Featured Posts */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Recent Shadows</h2>
          <a
            href="/archive"
            className="text-sm font-medium text-pastel-blue hover:underline"
          >
            Explore all echoes →
          </a>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-2xl">
            <p className="text-muted-foreground">The cave is quiet... for now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section className="mt-16 text-center">
        <div className="bg-gradient-to-br from-pastel-pink/20 to-pastel-blue/20 rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-4">Join the Dialogue</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Truth isn't found in echo chambers. Subscribe for weekly provocations, 
            uncomfortable questions, and midnight thoughts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/feed.xml"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
            >
              Receive Epistles via RSS
            </a>
            <a
              href="/about"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border font-medium hover:bg-accent transition-colors"
            >
              Enter the Cave
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}