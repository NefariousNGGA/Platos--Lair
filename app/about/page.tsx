export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">The Cave</h1>
      
      <div className="prose prose-lg dark:prose-invert">
        <p className="lead italic border-l-4 border-pastel-blue pl-4 py-2">
          "We can easily forgive a child who is afraid of the dark; 
          the real tragedy of life is when men are afraid of the light."
          <br />
          <span className="text-sm not-italic">— Plato</span>
        </p>

        <h2>What is this place?</h2>
        <p>
          Plato's Lair is not a blog. It's a <strong>thinking space</strong>—a digital cave 
          where shadows of ideas dance on the walls, waiting to be questioned.
        </p>

        <p>
          Here, we don't just <em>consume</em> content. We <em>interrogate</em> it. 
          We sit with uncomfortable questions, chase half-formed thoughts into dark corners, 
          and occasionally, catch a glimpse of the fire that casts the shadows.
        </p>

        <h2>The Allegory</h2>
        <p>
          Like Plato's cave dwellers, most of us only see <strong>shadows</strong> of reality—filtered 
          through algorithms, polished by social media, simplified for consumption.
        </p>

        <p>
          This space is an attempt to turn around, to face the fire, to question the shapes on the wall. 
          Even if it hurts our eyes at first.
        </p>

        <h2>What you'll find here</h2>
        <ul>
          <li><strong>Midnight thoughts</strong> - Ideas that emerge when the world sleeps</li>
          <li><strong>Conversations with ghosts</strong> - Dialogues with philosophers long gone</li>
          <li><strong>Uncomfortable questions</strong> - The ones we usually avoid asking</li>
          <li><strong>Half-truths examined</strong> - Taking apart what "everyone knows"</li>
          <li><strong>Silence between words</strong> - What isn't said matters too</li>
        </ul>

        <h2>The Philosopher's Toolkit</h2>
        <div className="flex flex-wrap gap-2 my-4">
          {['Skepticism', 'Curiosity', 'Patience', 'Courage', 'Silence'].map((tool) => (
            <span key={tool} className="px-3 py-1 rounded-full bg-accent">
              {tool}
            </span>
          ))}
        </div>

        <h2>A Note on Technology</h2>
        <p>
          Even a philosopher's cave needs modern tools. This space is built with:
        </p>
        <div className="flex flex-wrap gap-2 my-4">
          {['Next.js 14', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Prisma'].map((tech) => (
            <span key={tech} className="px-3 py-1 rounded-full bg-pastel-blue/20">
              {tech}
            </span>
          ))}
        </div>

        <p>
          The code is open source because ideas should be examined, not hidden.
        </p>

        <h2>Entering the Cave</h2>
        <p>
          You don't need credentials. You don't need expertise. You only need:
        </p>
        <ol>
          <li>A willingness to question</li>
          <li>Comfort with uncertainty</li>
          <li>Patience with complexity</li>
        </ol>

        <p className="italic mt-8 p-4 bg-pastel-pink/10 rounded-lg">
          "The heaviest penalty for declining to rule is to be ruled by someone inferior to yourself."
          <br />
          <span className="text-sm not-italic">— Plato, The Republic</span>
        </p>

        <p className="mt-8">
          Welcome to the lair. The shadows await your questions.
        </p>
      </div>
    </div>
  )
}