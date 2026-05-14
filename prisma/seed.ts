import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const users = [
  { name: "Alex Chen", email: "alex@example.com", bio: "Full-stack developer passionate about React and Node.js. Building cool stuff since 2020.", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", githubId: "alexchen", reputationPoints: 2450 },
  { name: "Sarah Kim", email: "sarah@example.com", bio: "Frontend specialist. Love turning complex problems into simple, beautiful interfaces.", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", githubId: "sarahkim", reputationPoints: 1890 },
  { name: "Marcus Johnson", email: "marcus@example.com", bio: "Backend engineer. Distributed systems, databases, and APIs are my jam.", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus", githubId: "marcusj", reputationPoints: 3120 },
  { name: "Priya Sharma", email: "priya@example.com", bio: "ML engineer exploring the intersection of AI and developer tools.", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya", githubId: "priyasharma", reputationPoints: 1560 },
  { name: "James Wilson", email: "james@example.com", bio: "DevOps enthusiast. Docker, Kubernetes, and cloud infrastructure.", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=James", githubId: "jameswilson", reputationPoints: 980 },
  { name: "Emily Zhao", email: "emily@example.com", bio: "UI/UX designer who codes. Accessibility advocate and design system builder.", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily", githubId: "emilyzhao", reputationPoints: 2100 },
  { name: "David Park", email: "david@example.com", bio: "Mobile developer (React Native/Flutter). Also love web3 and blockchain.", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David", githubId: "davidpark", reputationPoints: 1340 },
  { name: "Olivia Martinez", email: "olivia@example.com", bio: "Open source contributor. Rust and systems programming enthusiast.", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia", githubId: "oliviam", reputationPoints: 2780 },
];

const projects = [
  {
    name: "TaskFlow",
    description: "A beautiful project management tool with drag-and-drop kanban boards, real-time collaboration, and AI-powered task prioritization.",
    repoUrl: "https://github.com/devsync-demo/taskflow",
    deploymentUrl: "https://taskflow-demo.vercel.app",
    overallScore: 95, codeQuality: 94, documentation: 92, bestPractices: 90, performance: 88,
    strengths: ["Exceptional code organization and architecture", "Comprehensive documentation with API references", "Robust real-time collaboration implementation"],
    suggestions: ["Add end-to-end tests for critical flows", "Optimize bundle size with lazy loading", "Add rate limiting on real-time endpoints"],
    summary: "A production-grade project management tool with excellent code quality, comprehensive documentation, and sophisticated real-time features.",
    techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Socket.io", "Tailwind CSS"],
    status: "active",
  },
  {
    name: "ChatSync",
    description: "Real-time messaging platform with end-to-end encryption, file sharing, and bot integrations. Built for developer teams.",
    repoUrl: "https://github.com/devsync-demo/chatsync",
    deploymentUrl: "https://chatsync-demo.vercel.app",
    overallScore: 88, codeQuality: 90, documentation: 85, bestPractices: 82, performance: 86,
    strengths: ["Clean separation of concerns in architecture", "Well-documented API endpoints", "Strong security practices with encryption"],
    suggestions: ["Add message search indexing", "Implement WebSocket reconnection with backoff", "Add integration tests for bot system"],
    summary: "A well-engineered messaging platform with strong architecture, good security practices, and solid documentation.",
    techStack: ["React", "Node.js", "MongoDB", "Socket.io", "Redis", "Docker"],
    status: "active",
  },
  {
    name: "CodeReviewer",
    description: "AI-powered code review tool that integrates with GitHub PRs. Provides automated suggestions, security analysis, and style checks.",
    repoUrl: "https://github.com/devsync-demo/codereviewer",
    deploymentUrl: "https://codereviewer-demo.vercel.app",
    overallScore: 82, codeQuality: 78, documentation: 80, bestPractices: 85, performance: 75,
    strengths: ["Innovative AI integration with GitHub API", "Good use of design patterns in service layer", "Clear project structure and module boundaries"],
    suggestions: ["Improve error handling in AI service calls", "Add request caching for repeated analyses", "Implement background job processing for large PRs"],
    summary: "An innovative AI-powered tool with solid architecture and good practices, though performance could be improved with caching.",
    techStack: ["Next.js", "Python", "FastAPI", "PostgreSQL", "OpenAI", "Docker"],
    status: "active",
  },
  {
    name: "BudgetTracker",
    description: "Personal finance tracker with visual analytics, budget goals, and automated transaction categorization using ML.",
    repoUrl: "https://github.com/devsync-demo/budgettracker",
    deploymentUrl: "https://budgettracker-demo.vercel.app",
    overallScore: 76, codeQuality: 74, documentation: 70, bestPractices: 72, performance: 80,
    strengths: ["Effective ML integration for transaction categorization", "Responsive and accessible UI components"],
    suggestions: ["Add comprehensive test coverage for ML models", "Improve error boundaries for chart components", "Add data export functionality"],
    summary: "A practical finance tracking app with smart ML features and solid frontend architecture, though testing coverage could be better.",
    techStack: ["React", "TypeScript", "Node.js", "MongoDB", "Chart.js", "Tailwind CSS"],
    status: "active",
  },
  {
    name: "LearnHub",
    description: "Online learning platform with interactive courses, progress tracking, and community forums for students.",
    repoUrl: "https://github.com/devsync-demo/learnhub",
    overallScore: 72, codeQuality: 70, documentation: 65, bestPractices: 68, performance: 74,
    strengths: ["Good course content structure and data modeling", "Clean and intuitive user interface"],
    suggestions: ["Add loading states and skeleton screens", "Implement proper pagination for course listings", "Add SEO metadata for course pages"],
    summary: "A solid learning platform with good data modeling and UI, but needs performance optimizations and better loading states.",
    techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Stripe", "Tailwind CSS"],
    status: "active",
  },
  {
    name: "FitTrack",
    description: "Fitness tracking app with workout logging, progress charts, and social challenges. Stay motivated with friends.",
    repoUrl: "https://github.com/devsync-demo/fittrack",
    overallScore: 65, codeQuality: 62, documentation: 58, bestPractices: 60, performance: 70,
    strengths: ["Cross-platform support with React Native", "Good data visualization for progress tracking"],
    suggestions: ["Add offline-first support for workout logging", "Improve error handling for API failures", "Add proper TypeScript types across the codebase"],
    summary: "A functional fitness tracker with good cross-platform support, but needs better error handling and offline capabilities.",
    techStack: ["React Native", "TypeScript", "Node.js", "PostgreSQL", "Expo"],
    status: "active",
  },
  {
    name: "WeatherNow",
    description: "Beautiful weather dashboard with 7-day forecasts, radar maps, and severe weather alerts. PWA with offline support.",
    repoUrl: "https://github.com/devsync-demo/weathernow",
    deploymentUrl: "https://weathernow-demo.vercel.app",
    overallScore: 58, codeQuality: 55, documentation: 50, bestPractices: 52, performance: 65,
    strengths: ["Great PWA implementation with offline support", "Beautiful data visualizations"],
    suggestions: ["Add geolocation fallback for manual city input", "Implement proper state management", "Add unit tests for weather data parsing"],
    summary: "A visually appealing weather app with solid PWA features, but needs better state management and testing.",
    techStack: ["React", "TypeScript", "Vite", "OpenWeather API", "Chart.js"],
    status: "active",
  },
  {
    name: "RecipeBox",
    description: "Recipe sharing platform where food lovers can share, discover, and save their favorite recipes.",
    repoUrl: "https://github.com/devsync-demo/recipebox",
    overallScore: 52, codeQuality: 50, documentation: 45, bestPractices: 48, performance: 55,
    strengths: ["Clean and simple UI design", "Good recipe search functionality"],
    suggestions: ["Add image upload with proper compression", "Implement recipe rating system", "Add form validation and loading states"],
    summary: "A simple recipe sharing platform with a clean UI, but needs image handling and better UX patterns.",
    techStack: ["Vue.js", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    status: "active",
  },
  {
    name: "NoteKeeper",
    description: "Minimalist note-taking app with markdown support, folders, tags, and quick search. Built for speed.",
    repoUrl: "https://github.com/devsync-demo/notekeeper",
    overallScore: 45, codeQuality: 42, documentation: 38, bestPractices: 40, performance: 50,
    strengths: ["Fast and lightweight markdown editor", "Efficient search with debouncing"],
    suggestions: ["Add data persistence and sync", "Implement user authentication", "Add keyboard shortcuts for common actions"],
    summary: "A fast note-taking app with a great editor experience, but lacks data persistence and user accounts.",
    techStack: ["Svelte", "TypeScript", "SQLite", "Vite"],
    status: "active",
  },
  {
    name: "PixelArt",
    description: "Browser-based pixel art editor with layers, animation support, and export to GIF/PNG.",
    repoUrl: "https://github.com/devsync-demo/pixelart",
    overallScore: 35, codeQuality: 32, documentation: 30, bestPractices: 28, performance: 45,
    strengths: ["Impressive Canvas API implementation", "Animation timeline feature is well done"],
    suggestions: ["Add undo/redo history system", "Implement proper state management instead of direct DOM", "Add mobile touch support"],
    summary: "A creative pixel art tool with impressive Canvas features, but needs better state management and undo support.",
    techStack: ["JavaScript", "Canvas API", "HTML5", "CSS3"],
    status: "active",
  },
];

const ideas = [
  {
    title: "AI Study Buddy",
    vision: "An AI-powered study companion that helps students understand complex topics through interactive Q&A, generates practice problems, and tracks learning progress. Integrates with common LMS platforms.",
    requiredRoles: ["ML Engineer", "Frontend Developer", "Backend Developer"],
    maxMembers: 4,
    status: "open",
  },
  {
    title: "Dev Portfolio Generator",
    vision: "Automatically generate a beautiful developer portfolio from GitHub profile, repos, and contributions. Supports custom themes, blog integration, and one-click deployment to Vercel/Netlify.",
    requiredRoles: ["Frontend Developer", "UI/UX Designer", "Backend Developer"],
    maxMembers: 3,
    status: "open",
  },
  {
    title: "Game Night Platform",
    vision: "Online platform for playing board games and card games with friends. Features include video chat, game lobbies, turn-based play, and a ranking system. Start with chess, checkers, and poker.",
    requiredRoles: ["Fullstack Developer", "Game Developer", "UI/UX Designer"],
    maxMembers: 4,
    status: "open",
  },
  {
    title: "Open Source Dashboard",
    vision: "Dashboard that tracks your open source contributions across GitHub. Shows PRs merged, issues closed, repos starred, and a contribution heatmap. Gamify your OSS journey.",
    requiredRoles: ["Frontend Developer", "Backend Developer", "DevOps"],
    maxMembers: 3,
    status: "open",
  },
  {
    title: "Eco Footprint Tracker",
    vision: "App that helps users track and reduce their carbon footprint. Scan receipts, track transportation, get personalized suggestions for eco-friendly alternatives. Social features for community challenges.",
    requiredRoles: ["Mobile Developer", "ML Engineer", "Backend Developer", "UI/UX Designer"],
    maxMembers: 5,
    status: "open",
  },
];

const discussions = [
  { title: "Best practices for Next.js App Router", content: "Hey everyone! I've been working with the Next.js App Router for a few months now and wanted to share some best practices I've discovered:\n\n1. Use Server Components by default\n2. Keep client components at the leaf level\n3. Leverage streaming for data-heavy pages\n4. Use Route Groups for better organization\n\nWhat tips do you all have?", category: "general" },
  { title: "Help: Prisma connection pooling issue", content: "I'm getting connection timeout errors in production with Prisma. I'm using PostgreSQL on a free tier. Has anyone dealt with this? Should I use a connection pooler like PgBouncer?", category: "help" },
  { title: "TaskFlow - My first major project!", content: "Just finished building TaskFlow, a comprehensive project management tool! Would love for you all to check it out and give feedback. The AI-powered task prioritization feature was the most challenging part to implement.\n\nRepo: https://github.com/devsync-demo/taskflow", category: "showcase" },
  { title: "Feedback needed on my portfolio site", content: "I've been working on my developer portfolio and would really appreciate some honest feedback before I launch it. Specifically looking for input on the color scheme and mobile layout.", category: "feedback" },
  { title: "Looking for collaborators on a dev tools project", content: "I'm planning to build an open-source VS Code extension for live code sharing. Think Google Docs but for coding. Looking for 2-3 developers who are passionate about developer tooling. Experience with VS Code extension API is a plus!", category: "collaboration" },
  { title: "How do you handle API rate limiting?", content: "Building a public API and need to implement rate limiting. What strategies do you recommend? Token bucket? Sliding window? Using Redis or in-memory?", category: "help" },
  { title: "Just deployed my first full-stack app!", content: "After months of learning, I finally deployed my first full-stack application - a recipe sharing platform! It was a great learning experience. Next up: adding image upload and social features.", category: "showcase" },
  { title: "What's your dev stack in 2026?", content: "Curious what everyone's using these days. My current stack: Next.js 16, Prisma, PostgreSQL, Tailwind CSS, and Vercel for deployment. What about you all?", category: "general" },
];

const comments = [
  "Great tips! I'd add that using React Suspense with streaming SSR has been a game changer for our app's performance.",
  "I had the same issue! What worked for me was switching to a connection pooler. NeonDB has a built-in one that's free.",
  "This looks amazing! The UI is really clean. How did you handle the real-time collaboration?",
  "The color scheme looks good overall, but I'd suggest increasing the contrast on the secondary text for better accessibility.",
  "I'm interested! I've built a couple of VS Code extensions before. Would love to contribute to this.",
  "I use the token bucket approach with Redis. It's simple and works well. There's a great library called 'express-rate-limit' for Node.js.",
  "Congratulations! That's a big milestone. The recipe box concept is really nice - you should add a meal planner feature next!",
  "I'm on a similar stack but using Bun instead of Node.js. The dev experience is incredible - it's noticeably faster.",
  "Make sure to handle the WebSocket reconnection properly. We used Socket.io which handles it gracefully.",
  "The AI task prioritization feature is really cool! Are you using GPT or a custom model for that?",
  "For the portfolio, I'd recommend adding some subtle animations on scroll. Framer Motion works great for this.",
  "Rate limiting tip: make sure to return proper Retry-After headers so clients can back off intelligently.",
  "Would love to see the code for the canvas rendering in PixelArt! The color palette is really well chosen.",
  "I switched from MongoDB to PostgreSQL recently and Prisma made the transition so much smoother.",
  "Great discussion! I'd also recommend checking out the Next.js documentation on caching - it's really well written now.",
];

async function main() {
  console.log("🌱 Seeding database...\n");

  // Clean existing data (in reverse dependency order)
  await prisma.comment.deleteMany();
  await prisma.discussion.deleteMany();
  await prisma.userIdea.deleteMany();
  await prisma.ideaTicket.deleteMany();
  await prisma.userProject.deleteMany();
  await prisma.project.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();
  console.log("  ✓ Cleaned existing data\n");

  // Create users
  const createdUsers: Record<string, any> = {};
  for (const u of users) {
    const user = await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        emailVerified: true,
        bio: u.bio,
        image: u.image,
        githubId: u.githubId,
        reputationPoints: u.reputationPoints,
      },
    });
    // Also create a minimal account so better-auth doesn't break
    await prisma.account.create({
      data: {
        userId: user.id,
        type: "oauth",
        providerId: "github",
        accountId: u.githubId,
        accessToken: "seed_token_mock",
      },
    });
    createdUsers[u.githubId] = user;
  }
  console.log(`  ✓ Created ${users.length} users\n`);

  const userList = Object.values(createdUsers);

  // Create projects with members
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    const owner = userList[i % userList.length];

    const project = await prisma.project.create({
      data: {
        name: p.name,
        description: p.description,
        repoUrl: p.repoUrl,
        deploymentUrl: p.deploymentUrl || null,
        ownerId: owner.id,
        overallScore: p.overallScore,
        codeQuality: p.codeQuality,
        documentation: p.documentation,
        bestPractices: p.bestPractices,
        performance: p.performance,
        techStack: p.techStack,
        strengths: p.strengths || [],
        suggestions: p.suggestions || [],
        summary: p.summary || "",
        status: p.status,
        members: {
          create: { userId: owner.id, role: "owner" },
        },
      },
    });

    // Add some random members to most projects
    if (i > 1) {
      const memberCount = Math.min(1 + (i % 3), userList.length - 1);
      const available = userList.filter((u: any) => u.id !== owner.id);
      for (let j = 0; j < memberCount && j < available.length; j++) {
        const member = available[(i + j) % available.length];
        try {
          await prisma.userProject.create({
            data: { userId: member.id, projectId: project.id, role: j === 0 ? "contributor" : "member" },
          });
        } catch { /* unique constraint */ }
      }
    }
  }
  console.log(`  ✓ Created ${projects.length} projects with team members\n`);

  // Create ideas
  for (let i = 0; i < ideas.length; i++) {
    const id = ideas[i];
    const owner = userList[i % userList.length];

    const idea = await prisma.ideaTicket.create({
      data: {
        title: id.title,
        vision: id.vision,
        requiredRoles: id.requiredRoles,
        maxMembers: id.maxMembers,
        status: id.status,
        ownerId: owner.id,
        members: { create: { userId: owner.id, role: "owner" } },
      },
    });

    // Add a few members to some ideas
    if (i > 0) {
      const count = i % 3;
      const available = userList.filter((u: any) => u.id !== owner.id);
      for (let j = 0; j < count && j < available.length; j++) {
        try {
          await prisma.userIdea.create({
            data: { userId: available[j].id, ideaId: idea.id, role: "member" },
          });
        } catch { /* unique */ }
      }
      // If at least half filled, mark as in-progress
      if (count >= 2) {
        await prisma.ideaTicket.update({ where: { id: idea.id }, data: { status: "in-progress" } });
      }
    }
  }
  console.log(`  ✓ Created ${ideas.length} idea tickets with teams\n`);

  // Create discussions
  let commentIdx = 0;
  for (let i = 0; i < discussions.length; i++) {
    const d = discussions[i];
    const author = userList[i % userList.length];

    // Link some discussions to projects
    const projectId = i < 5 && i < projects.length
      ? (await prisma.project.findFirst({ skip: i }))?.id
      : null;

    const discussion = await prisma.discussion.create({
      data: {
        title: d.title,
        content: d.content,
        authorId: author.id,
        category: d.category,
        projectId: projectId || null,
        upvotes: Math.floor(Math.random() * 25),
      },
    });

    // Add comments to discussions (2-4 each)
    const commentCount = 2 + (i % 3);
    for (let j = 0; j < commentCount && commentIdx < comments.length; j++) {
      const commentAuthor = userList[(commentIdx + j) % userList.length];
      await prisma.comment.create({
        data: {
          content: comments[commentIdx],
          authorId: commentAuthor.id,
          discussionId: discussion.id,
        },
      });
      commentIdx++;
    }
  }
  console.log(`  ✓ Created ${discussions.length} discussions with comments\n`);

  console.log("✅ Done! Database has been seeded with:");
  console.log(`   - ${users.length} users`);
  console.log(`   - ${projects.length} projects (with team members)`);
  console.log(`   - ${ideas.length} idea tickets (with team members)`);
  console.log(`   - ${discussions.length} discussions (with ${commentIdx} comments)`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
