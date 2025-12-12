import { PrismaClient } from '@prisma/client'
import { generateSlug } from '../app/lib/utils'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data (optional - be careful in production!)
  console.log('🧹 Clearing existing data...')
  
  // Note: In production, you might want to skip this or be very careful
  if (process.env.NODE_ENV !== 'production') {
    await prisma.reaction.deleteMany()
    await prisma.postTag.deleteMany()
    await prisma.post.deleteMany()
    await prisma.tag.deleteMany()
    console.log('✅ Existing data cleared')
  }

  // Create tags
  console.log('🏷️ Creating tags...')
  const tags = [
    { name: 'Technology', slug: 'technology', color: '#3B82F6' },
    { name: 'Programming', slug: 'programming', color: '#10B981' },
    { name: 'Web Development', slug: 'web-development', color: '#8B5CF6' },
    { name: 'Next.js', slug: 'nextjs', color: '#000000' },
    { name: 'TypeScript', slug: 'typescript', color: '#3178C6' },
    { name: 'Tailwind CSS', slug: 'tailwind-css', color: '#06B6D4' },
    { name: 'Open Source', slug: 'open-source', color: '#F59E0B' },
    { name: 'Productivity', slug: 'productivity', color: '#EC4899' },
    { name: 'Design', slug: 'design', color: '#8B5CF6' },
    { name: 'Tutorial', slug: 'tutorial', color: '#EF4444' },
  ]

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    })
  }
  console.log(`✅ Created ${tags.length} tags`)

  // Create sample posts
  console.log('📝 Creating sample posts...')
  const posts = [
    {
      title: 'Welcome to Minimalist Blog',
      slug: 'welcome-to-minimalist-blog',
      excerpt: 'An introduction to this clean, distraction-free blogging platform built with modern web technologies.',
      content: `# Welcome to Minimalist Blog

Hello and welcome! This is a sample post to demonstrate the features of Minimalist Blog.

## What is this?

Minimalist Blog is a clean, distraction-free blogging platform built with:

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **PostgreSQL** with Prisma ORM
- **Render** for hosting

## Features

✨ **Modern Stack**: Built with the latest web technologies  
🔍 **Search**: Global search with keyboard shortcut (Ctrl+K)  
🎨 **Theming**: Light/dark mode with pastel accents  
📱 **Responsive**: Works perfectly on mobile and desktop  
🔐 **Secure**: Token-based admin authentication  
📊 **Analytics**: Built-in stats and post metrics  
📡 **RSS Feed**: Subscribe to updates  
🗺️ **Sitemap**: SEO optimized

## Getting Started

1. Clone the repository
2. Set up your PostgreSQL database
3. Configure environment variables
4. Run \`npm install\` and \`npm run dev\`

## Markdown Support

This editor supports **full Markdown** including:

- Headers (#, ##, ###)
- **Bold** and *italic* text
- Lists (ordered and unordered)
- [Links](https://example.com)
- \`Inline code\` and code blocks
- Blockquotes
- Images
- And more!

\`\`\`javascript
// Example code block
function greet(name) {
  return \`Hello, \${name}!\`
}

console.log(greet('World'))
\`\`\`

## Next Steps

Stay tuned for more posts about:
- Next.js App Router deep dive
- Tailwind v4 features
- Database optimization with Prisma
- Deployment strategies
- And much more!

---

*Thanks for reading! If you have any questions, feel free to reach out.*`,
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop',
      tags: ['Welcome', 'Introduction', 'Getting Started'],
      published: true,
      publishedAt: new Date('2024-01-15'),
    },
    {
      title: 'Building a Blog with Next.js 14',
      slug: 'building-a-blog-with-nextjs-14',
      excerpt: 'Learn how to build a modern blog using Next.js 14 App Router, TypeScript, and Tailwind CSS.',
      content: `# Building a Blog with Next.js 14

Next.js 14 introduces some exciting new features that make it perfect for building blogs. Let's explore how.

## Why Next.js 14?

### App Router
The new App Router provides a more intuitive file-based routing system with built-in support for:

- **Server Components**: Reduced client-side JavaScript
- **Nested Layouts**: Shared layouts without prop drilling
- **Streaming**: Progressive content loading
- **Suspense**: Better loading states

### Performance Improvements
- **Turbopack**: Faster development builds
- **Server Actions**: Direct server function calls
- **Partial Prerendering**: Dynamic content with static speed

## Project Structure

\`\`\`
app/
├── layout.tsx          # Root layout
├── page.tsx           # Homepage
├── posts/
│   └── [slug]/
│       └── page.tsx   # Dynamic post pages
├── api/
│   └── posts/
│       └── route.ts   # API endpoints
└── components/        # Reusable components
\`\`\`

## Key Features Implemented

### 1. Markdown Processing
We use \`remark\` and \`remark-html\` to convert Markdown content to HTML:

\`\`\`typescript
import { remark } from 'remark'
import html from 'remark-html'

export async function markdownToHtml(markdown: string) {
  const result = await remark().use(html).process(markdown)
  return result.toString()
}
\`\`\`

### 2. Database with Prisma
Prisma provides type-safe database access:

\`\`\`typescript
model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  slug      String   @unique
  published Boolean  @default(false)
  tags      PostTag[]
}
\`\`\`

### 3. Static Generation
We generate static pages at build time for better performance:

\`\`\`typescript
export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true }
  })

  return posts.map((post) => ({
    slug: post.slug,
  }))
}
\`\`\`

## Deployment

Deploying to Render is straightforward:

1. Connect your GitHub repository
2. Set environment variables
3. Render handles the rest automatically

The \`render.yaml\` file defines the infrastructure:

\`\`\`yaml
services:
  - type: web
    name: blog
    buildCommand: npm ci && npm run build
    startCommand: npm start
\`\`\`

## Conclusion

Next.js 14 provides an excellent foundation for modern blogs. The combination of performance, developer experience, and deployment simplicity makes it a great choice.

The key takeaways:
1. Use App Router for better structure
2. Leverage static generation for performance
3. Implement ISR for dynamic content
4. Choose the right database (PostgreSQL with Prisma)
5. Deploy to platforms like Render or Vercel

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Render Documentation](https://render.com/docs)

---

*Happy coding! Let me know if you have any questions.*`,
      coverImage: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w-1200&h=600&fit=crop',
      tags: ['Next.js', 'TypeScript', 'Tutorial', 'Web Development'],
      published: true,
      publishedAt: new Date('2024-01-20'),
    },
    {
      title: 'Tailwind CSS v4: What\'s New',
      slug: 'tailwind-css-v4-whats-new',
      excerpt: 'Exploring the new features and improvements in Tailwind CSS v4, including the simplified configuration and new utilities.',
      content: `# Tailwind CSS v4: What's New

Tailwind CSS v4 brings significant improvements to the popular utility-first CSS framework. Let's dive into the changes.

## Simplified Configuration

### No More \`tailwind.config.js\`?
One of the biggest changes is the move towards a more **CSS-centric** configuration. Instead of a separate config file, you can now configure Tailwind directly in your CSS:

\`\`\`css
@import "tailwindcss";

@theme {
  --color-primary: #3B82F6;
  --radius-lg: 1rem;
  --font-sans: Inter, system-ui, sans-serif;
}
\`\`\`

However, you can still use \`tailwind.config.js\` if you prefer the traditional approach.

## New Features

### 1. CSS Variables for Themes
Tailwind v4 makes extensive use of CSS custom properties:

\`\`\`css
:root {
  --color-primary: #3B82F6;
  --color-secondary: #10B981;
  --radius-lg: 1rem;
}

.dark {
  --color-primary: #60A5FA;
  --color-secondary: #34D399;
}
\`\`\`

### 2. Improved Dark Mode
Dark mode configuration is now more intuitive:

\`\`\`css
@theme {
  --color-background: light-dark(white, black);
  --color-foreground: light-dark(black, white);
}
\`\`\`

### 3. Container Queries
Native support for container queries is now available:

\`\`\`html
<div class="@container">
  <div class="@lg:text-xl">
    <!-- This text will be xl when container is lg -->
  </div>
</div>
\`\`\`

### 4. New Utility Classes
Several new utilities have been added:

- \`@supports-\*\` utilities for feature queries
- \`light-dark()\` function for automatic light/dark values
- \`has-\*\` and \`group-has-\*\` for parent selectors
- \`@starting-style\` for entry animations

## Performance Improvements

### Smaller Bundle Size
The new engine produces significantly smaller CSS bundles by:
- Better tree-shaking of unused utilities
- More efficient generation of variants
- Improved purge mechanism

### Faster Build Times
The compilation is up to **10x faster** thanks to:
- Rewritten engine in Rust
- Parallel processing
- Incremental builds

## Migration from v3

### Step 1: Update Dependencies
\`\`\`bash
npm install tailwindcss@latest @tailwindcss/v4
\`\`\`

### Step 2: Update Configuration
Update your \`tailwind.config.js\` to be v4 compatible:

\`\`\`javascript
// Old v3 config
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}

// New v4 config
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  experimental: {
    optimizeUniversalDefaults: true,
  },
}
\`\`\`

### Step 3: Update CSS Imports
\`\`\`css
/* Old */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* New */
@import "tailwindcss";
\`\`\`

## Benefits for Blog Platforms

### 1. Consistent Theming
CSS variables make theme switching trivial:

\`\`\`css
.pastel-theme {
  --color-primary: #FFD6E7;
  --color-secondary: #D6E5FF;
}
\`\`\`

### 2. Better Performance
Smaller CSS bundles mean faster page loads for readers.

### 3. Enhanced Responsiveness
Container queries allow more flexible layouts.

## Example: Blog Component with v4

\`\`\`tsx
export function BlogCard() {
  return (
    <article class="@container bg-card rounded-lg border p-6">
      <h3 class="text-lg font-semibold @lg:text-xl">
        Blog Post Title
      </h3>
      <p class="text-muted-foreground mt-2 @lg:mt-4">
        Post excerpt goes here...
      </p>
      <div class="mt-4 flex gap-2 @lg:mt-6">
        <span class="rounded-full bg-primary/10 px-3 py-1 text-sm">
          Tag
        </span>
      </div>
    </article>
  )
}
\`\`\`

## Conclusion

Tailwind CSS v4 represents a significant step forward for utility-first CSS. The move towards CSS-native configuration, improved performance, and new features make it an excellent choice for modern web projects.

For blog platforms specifically, the performance improvements and theming capabilities are particularly valuable.

## Resources

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs/v4)
- [Migration Guide](https://tailwindcss.com/docs/v4/migration)
- [v4 Announcement](https://tailwindcss.com/blog/tailwindcss-v4)

---

*Have you tried Tailwind CSS v4 yet? Share your thoughts in the comments!*`,
      coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop',
      tags: ['Tailwind CSS', 'CSS', 'Frontend', 'Design'],
      published: true,
      publishedAt: new Date('2024-01-25'),
    },
  ]

  let createdCount = 0
  for (const postData of posts) {
    const existingPost = await prisma.post.findUnique({
      where: { slug: postData.slug },
    })

    if (!existingPost) {
      // Calculate word count and reading time
      const wordCount = postData.content.trim().split(/\s+/).length
      const readingTime = Math.ceil(wordCount / 200)

      // Create post
      const post = await prisma.post.create({
        data: {
          title: postData.title,
          slug: postData.slug,
          excerpt: postData.excerpt,
          content: postData.content,
          coverImage: postData.coverImage,
          published: postData.published,
          publishedAt: postData.publishedAt,
          wordCount,
          readingTime,
          tags: {
            create: postData.tags.map(tagName => ({
              tag: {
                connectOrCreate: {
                  where: { name: tagName },
                  create: {
                    name: tagName,
                    slug: generateSlug(tagName),
                  },
                },
              },
            })),
          },
        },
      })
      createdCount++
      console.log(`   Created post: "${post.title}"`)
    }
  }

  console.log(`✅ Created ${createdCount} posts (${posts.length - createdCount} already existed)`)

  // Create some reactions
  console.log('❤️ Creating sample reactions...')
  const allPosts = await prisma.post.findMany()
  
  for (const post of allPosts) {
    // Create some random reactions
    const reactionTypes = ['like', 'love', 'clap', 'save']
    const numReactions = Math.floor(Math.random() * 15) + 5 // 5-20 reactions per post
    
    for (let i = 0; i < numReactions; i++) {
      const type = reactionTypes[Math.floor(Math.random() * reactionTypes.length)]
      const userHash = `user_${Math.floor(Math.random() * 1000)}`
      
      await prisma.reaction.create({
        data: {
          postId: post.id,
          type,
          userHash,
        },
      })
    }
  }
  
  console.log(`✅ Created reactions for ${allPosts.length} posts`)

  // Display final stats
  const finalStats = await prisma.$transaction([
    prisma.post.count(),
    prisma.tag.count(),
    prisma.reaction.count(),
  ])

  console.log('\n📊 Database seeded successfully!')
  console.log('================================')
  console.log(`Total Posts: ${finalStats[0]}`)
  console.log(`Total Tags: ${finalStats[1]}`)
  console.log(`Total Reactions: ${finalStats[2]}`)
  console.log('================================\n')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })