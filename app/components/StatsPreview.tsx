import { Post, Tag } from 'lucide-react'

interface StatsPreviewProps {
  stats: {
    postCount: number
    tagCount: number
    totalWords: number
    recentPosts: Array<{ title: string; slug: string }>
  }
}

export default function StatsPreview({ stats }: StatsPreviewProps) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-pastel-blue/20 to-pastel-purple/20 p-6">
      <h2 className="text-2xl font-bold mb-6">Blog Stats</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/50 dark:bg-gray-900/50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-pastel-blue">
              <Post className="text-blue-600" size={24} />
            </div>
            <div>
              <div className="text-3xl font-bold">{stats.postCount}</div>
              <div className="text-sm text-muted-foreground">Published Posts</div>
            </div>
          </div>
        </div>

        <div className="bg-white/50 dark:bg-gray-900/50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-pastel-green">
              <Tag className="text-green-600" size={24} />
            </div>
            <div>
              <div className="text-3xl font-bold">{stats.tagCount}</div>
              <div className="text-sm text-muted-foreground">Tags</div>
            </div>
          </div>
        </div>

        <div className="bg-white/50 dark:bg-gray-900/50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-pastel-yellow">
              <div className="text-yellow-600 font-bold text-lg">📝</div>
            </div>
            <div>
              <div className="text-3xl font-bold">
                {stats.totalWords.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Words</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}