import { prisma } from '@/lib/prisma'

export const revalidate = 3600

async function getAllPosts() {
  return await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    include: {
      tags: {
        include: { tag: true }
      }
    }
  })
}

export default async function ArchivePage() {
  const posts = await getAllPosts()
  
  // Group posts by year
  const postsByYear = posts.reduce((acc, post) => {
    const year = post.publishedAt?.getFullYear() || 'Timeless'
    if (!acc[year]) acc[year] = []
    acc[year].push(post)
    return acc
  }, {} as Record<string, typeof posts>)

  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Echoes</h1>
      <p className="text-muted-foreground mb-12">
        All {posts.length} whispers, organized by when they first echoed.
      </p>

      {Object.entries(postsByYear)
        .sort(([yearA], [yearB]) => {
          if (yearA === 'Timeless') return 1
          if (yearB === 'Timeless') return -1
          return Number(yearB) - Number(yearA)
        })
        .map(([year, yearPosts]) => (
          <section key={year} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b">
              {year} <span className="text-muted-foreground text-lg">({yearPosts.length} whispers)</span>
            </h2>
            
            <div className="space-y-6">
              {yearPosts.map((post) => (
                <article key={post.id} className="group">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold group-hover:text-pastel-blue transition-colors">
                        <a href={`/posts/${post.slug}`}>
                          {post.title}
                        </a>
                      </h3>
                      
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {post.tags.slice(0, 3).map(({ tag }) => (
                            <a
                              key={tag.id}
                              href={`/tags/${tag.slug}`}
                              className="text-xs px-2 py-1 rounded bg-accent"
                            >
                              {tag.name}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <time className="text-sm text-muted-foreground whitespace-nowrap">
                      {post.publishedAt?.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
    </div>
  )
}