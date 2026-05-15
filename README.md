# DevSync AI - Developer Collaboration Platform

DevSync AI is a modern web application that helps developers find teammates, collaborate on projects, and get AI-powered code audits. Built with Next.js, Prisma, and Google Gemini AI.

---

## Features

### 1. Project Management
- **Import from GitHub**: Import any public/private repository for AI analysis
- **AI-Powered Audit**: Get detailed code quality scores using Gemini AI
  - Overall score, code quality, documentation, best practices, performance
  - Strengths & suggestions for improvement
  - Auto-detected tech stack
- **Workspace**: Team collaboration hub with Git clone commands, task tracking, and quick links
- **Explore**: Discover and filter projects by score, tech stack, or search

### 2. Idea Hub
- **Post Project Ideas**: Share your project vision to find teammates
- **Categories**: Filter by Web App, Mobile, AI/ML, Game, Tool, Other
- **Join Teams**: Browse open ideas and request to join
- **Search**: Find ideas by title or description
- **Status Tracking**: Open, In Progress, Completed

### 3. Team Collaboration
- **Collaboration Requests**: Request to join projects with a message
- **Project Members**: Multiple roles (owner, co-owner, member)
- **GitHub Integration**: Create actual GitHub repositories from ideas

### 4. Forum & Discussions
- **Categories**: General, Help, Showcase, Feedback, Collaboration
- **Project Discussions**: Link discussions to specific projects
- **Comments**: Threaded conversations on topics

### 5. User Discovery
- **Profile Pages**: View user projects, bio, reputation points
- **User Search**: Find collaborators by name or bio
- **Edit Profile**: Update your name and bio

### 6. Notifications
- Real-time notifications for:
  - Collaboration requests
  - Request accepted/rejected
  - Team members joining ideas
  - Comments on your discussions

### 7. Task Tracking
- **Issue Tracker**: In-workspace task management
- **Priority Levels**: Low, Medium, High, Urgent
- **Status**: Open, In Progress, Resolved, Closed

### 8. Activity Feed
- Global activity feed showing recent projects, ideas, and discussions

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth with GitHub OAuth
- **AI**: Google Gemini 2.5 Flash
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Package Manager**: npm

---

## Prerequisites

1. **Node.js** 18+ 
2. **PostgreSQL** database (local or cloud)
3. **GitHub OAuth App** (for GitHub login & repo access)
4. **Google Gemini API Key** (for AI audits)

---

## Installation

### 1. Clone and Install
```bash
git clone <your-repo>
cd DevSync-Ai
npm install
```

### 2. Environment Variables
Create a `.env` file:
```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/devsync"

# Better Auth
BETTER_AUTH_SECRET="your-32-character-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# GitHub OAuth (create at https://github.com/settings/developers)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Gemini AI (get at https://aistudio.google.com/app/apikey)
GEMINI_API_KEY="your-gemini-api-key"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Setup
```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── ideas/         # Ideas CRUD
│   │   ├── projects/      # Projects CRUD, requests, issues
│   │   ├── discussions/   # Forum discussions
│   │   ├── notifications/ # Notifications API
│   │   ├── users/         # User search
│   │   ├── activity/      # Activity feed
│   │   ├── github/        # GitHub repos, create repo
│   │   ├── audit/         # AI code audit
│   │   └── auth/          # Better Auth endpoints
│   ├── ideas/             # Ideas pages
│   ├── projects/          # Projects pages
│   ├── workspace/         # Workspace page
│   ├── forum/             # Forum pages
│   ├── users/             # User search
│   ├── notifications/     # Notifications page
│   ├── activity/          # Activity feed
│   ├── profile/           # User profiles
│   ├── dashboard/         # User dashboard
│   ├── explore/           # Project discovery
│   └── signin/            # Authentication
├── components/            # React components
│   ├── navbar.tsx         # Navigation bar
│   ├── toast.tsx          # Toast notifications
│   ├── skeleton.tsx       # Loading skeletons
│   ├── grade-badge.tsx    # Score badges
│   ├── score-radar.tsx    # Radar chart
│   ├── tech-stack.tsx     # Tech tags
│   └── ...
├── lib/                   # Utilities
│   ├── prisma.ts          # Prisma client
│   ├── auth.ts            # Better Auth config
│   ├── session.tsx        # Session hook
│   ├── auth-client.ts     # Auth client
│   ├── gemini.ts          # Gemini AI client
│   └── notifications.ts   # Notification helper
└── ...
```

---

## Database Schema

### Core Models

| Model | Description |
|-------|-------------|
| **User** | Platform users with auth, bio, reputation |
| **Project** | Imported GitHub repos with AI audit data |
| **IdeaTicket** | Project ideas for recruiting teammates |
| **Discussion** | Forum posts (general or project-linked) |
| **Comment** | Discussion replies |
| **Notification** | User notifications |
| **Issue** | Task tracker for projects |
| **CollaborationRequest** | Project join requests |
| **UserProject** | Project membership |
| **UserIdea** | Idea membership |

---

## API Reference

### Projects
- `GET /api/projects` - List projects (with filters, pagination)
- `POST /api/projects` - Create project
- `GET /api/projects/[id]` - Get project details
- `DELETE /api/projects/[id]` - Delete project
- `POST /api/projects/[id]/requests` - Send collaboration request
- `GET /api/projects/[id]/requests` - List pending requests (owner only)
- `POST /api/projects/[id]/requests/[reqId]/accept` - Accept request
- `POST /api/projects/[id]/requests/[reqId]/reject` - Reject request
- `GET /api/projects/[id]/issues` - List issues
- `POST /api/projects/[id]/issues` - Create issue

### Ideas
- `GET /api/ideas` - List ideas (with filters, search)
- `POST /api/ideas` - Create idea
- `GET /api/ideas/[id]` - Get idea details
- `POST /api/ideas/[id]/join` - Join idea team
- `POST /api/ideas/[id]/project` - Create project from idea

### Discussions
- `GET /api/discussions` - List discussions
- `POST /api/discussions` - Create discussion
- `GET /api/discussions/[id]` - Get discussion with comments
- `POST /api/discussions/[id]/comments` - Add comment

### Users
- `GET /api/users?q=` - Search users by name/bio
- `GET /api/profile` - Get current user profile
- `PATCH /api/profile` - Update profile

### Notifications
- `GET /api/notifications` - Get notifications
- `PATCH /api/notifications` - Mark as read

### GitHub
- `GET /api/github/repos` - List user's GitHub repos
- `POST /api/github/create-repo` - Create new GitHub repo

### AI
- `POST /api/audit` - Analyze repository with Gemini AI

### Activity
- `GET /api/activity` - Get recent platform activity

---

## Page Routes

| Path | Description |
|------|-------------|
| `/` | Landing page |
| `/signin` | Authentication |
| `/dashboard` | User dashboard |
| `/explore` | Discover projects |
| `/ideas` | Browse & post ideas |
| `/ideas/[id]` | Idea details |
| `/projects/[id]` | Project details & audit |
| `/projects/new` | Import new project |
| `/workspace/[id]` | Team workspace |
| `/forum` | Forum homepage |
| `/forum/[id]` | Discussion thread |
| `/users` | User search |
| `/profile/[id]` | User profile |
| `/notifications` | Notifications page |
| `/activity` | Activity feed |

---

## Features in Detail

### AI Code Audit
When importing a project, the system:
1. Fetches repository metadata from GitHub
2. Uses Gemini AI to analyze code quality
3. Generates scores and suggestions
4. Saves audit results to database

### GitHub Integration
- OAuth for authentication
- List user's repositories
- Create new repositories
- Clone URLs and quick-start commands

### Notifications System
Triggers notifications for:
- New collaboration request → Project owner
- Request accepted → Requester
- Request rejected → Requester
- Someone joined your idea → Idea owner
- New comment on your discussion → Discussion author

### Pagination
Cursor-based pagination on:
- Projects list
- Ideas list  
- Discussions list

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Yes | Secret for auth (32+ chars) |
| `BETTER_AUTH_URL` | Yes | App URL (production: your domain) |
| `GITHUB_CLIENT_ID` | Yes | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | Yes | GitHub OAuth app client secret |
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `NEXT_PUBLIC_APP_URL` | Yes | Public app URL |

---

## Development Commands

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm run start

# Lint
npm run lint

# Database
npx prisma studio        # Open Prisma GUI
npx prisma generate      # Generate client
npx prisma db push       # Push schema to DB
npm run db:seed          # Seed database
```

---

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Self-Hosted
```bash
npm run build
npm run start
```

Set `BETTER_AUTH_URL` to your production domain.

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Test locally
5. Push and create PR

---

## License

MIT License

---

## Support

For issues or questions:
- Open an issue on GitHub
- Check existing issues first