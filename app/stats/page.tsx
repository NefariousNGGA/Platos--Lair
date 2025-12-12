import { prisma } from '../lib/prisma'
import { 
  BarChart3, 
  FileText, 
  Tag, 
  Type, 
  Calendar,
  TrendingUp,
  Eye,
  Heart
} from 'lucide-react'

export const revalidate = 3600

async function getStats() {
  const [
    postCount,
    tagCount,
    totalWords,
    totalReactions,
    totalViews,
    postsByMonth,
    popularPosts
  ] = await Promise.all([
    prisma.post.count({ where: { published: true } }),
    prisma.tag.count(),
    prisma.post.aggregate({
      where: { published: true },
      _sum: { wordCount: true }
    }),
    prisma.reaction.count(),
    prisma.post.aggregate({
      where: { published: true },
      _sum: { views: true }
    }),
    prisma.post.groupBy({
      by: ['publishedAt'],
      where: { 
        published: true,
        publishedAt: {
          gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
        }
      },
      _count: true,
      orderBy: { publishedAt: 'asc' }
    }),
    prisma.post.findMany({
      where: { published: true },
      orderBy: { views: 'desc' },
      take: 5,
      select: { title: true, slug: true, views: true }
    })
  ])

  return {
    postCount,
    tagCount,
    totalWords: totalWords._sum.wordCount || 0,
    totalReactions,
    totalViews: totalViews._sum.views || 0,
    postsByMonth,
    popularPosts
  }
}

export default async function StatsPage() {
  const stats = await getStats()
  
  const statCards = [
    {
      title: 'Whispers',
      value: stats.postCount,
      icon: FileText,
      color: 'bg-pastel-blue',
      description: 'Thoughts captured'
    },
    {
      title: 'Ideologies',
      value: stats.tagCount,
      icon: Tag,
      color: 'bg-pastel-green',
      description: 'Distinct ideas'
    },
    {
      title: 'Words Woven',
      value: stats.totalWords.toLocaleString(),
      icon: Type,
      color: 'bg-pastel-yellow',
      description: 'Total syllables'
    },
    {
      title: 'Echoes Felt',
      value: stats.totalReactions,
      icon: Heart,
      color: 'bg-pastel-pink',
      description: 'Hearts, likes, claps'
    },
    {
      title: 'Shadows Viewed',
      value: stats.totalViews,
      icon: Eye,
      color: 'bg-pastel-purple',
      description: 'Times eyes lingered'
    },
  ]

  return (
    <div className="max-w-6xl mx-auto py-12">
      <h1 className="text-4xl font-bold mb-2">The Scrolls</h1>
      <p className="text-muted-foreground mb-12">
        Numbers that whisper stories about this thinking space.
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
        {statCards.map((stat) => (
          <div key={stat.title} className="bg-card rounded-2xl border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon size={24} className="text-foreground" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-2">{stat.value}</div>
            <div className="text-sm font-medium">{stat.title}</div>
            <div className="text-xs text-muted-foreground mt-2">{stat.description}</div>
          </div>
        ))}
      </div>

      {/* Popular Posts */}
      <div className="bg-card rounded-2xl border p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <BarChart3 size={24} />
          Most Pondered Shadows
        </h2>
        
        <div className="space-y-4">
          {stats.popularPosts.map((post, index) => (
            <a
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="flex items-center justify-between p-4 rounded-lg hover:bg-accent transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-muted-foreground">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium group-hover:text-pastel-blue transition-colors">
                    {post.title}
                  </div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {post.views?.toLocaleString()} gazes
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Posts by Month */}
      <div className="bg-card rounded-2xl border p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Calendar size={24} />
          Whispers Through Time
        </h2>
        
        <div className="flex items-end gap-1 h-32">
          {Array.from({ length: 12 }).map((_, index) => {
            const month = new Date()
            month.setMonth(index)
            const monthPosts = stats.postsByMonth.filter(p => 
              p.publishedAt && new Date(p.publishedAt).getMonth() === index
            )
            const count = monthPosts.reduce((sum, p) => sum + p._count, 0)
            const height = Math.max(20, count * 20)
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-pastel-blue rounded-t-lg transition-all hover:bg-pastel-purple"
                  style={{ height: `${height}px` }}
                  title={`${count} whispers in ${month.toLocaleString('default', { month: 'short' })}`}
                />
                <div className="text-xs text-muted-foreground mt-2">
                  {month.toLocaleString('default', { month: 'short' })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}