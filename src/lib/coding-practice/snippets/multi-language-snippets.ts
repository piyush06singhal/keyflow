/**
 * Multi-Language Code Snippets
 *
 * Python, SQL, HTML, CSS, JSON, YAML, Docker, Bash, and Git snippets.
 */

import type { CodeSnippet } from "../types";
import { generateMetadata } from "../snippet-utils";

function createSnippet(partial: Omit<CodeSnippet, "id" | "metadata">): CodeSnippet {
  return {
    id: `multi-${Math.random().toString(36).substring(2, 11)}`,
    ...partial,
    metadata: generateMetadata(partial.code, partial.language),
  };
}

export const MULTI_LANGUAGE_SNIPPETS: CodeSnippet[] = [
  // === PYTHON ===
  createSnippet({
    title: "Python Function with Type Hints",
    description: "Modern Python function with type annotations",
    language: "python",
    category: "functions",
    difficulty: "beginner",
    type: "function",
    code: `def calculate_average(numbers: list[float]) -> float:
    if not numbers:
        return 0.0
    return sum(numbers) / len(numbers)

def greet(name: str, excited: bool = False) -> str:
    greeting = f"Hello, {name}"
    return greeting + "!" if excited else greeting + "."

print(calculate_average([1.5, 2.5, 3.5]))
print(greet("Python", excited=True))`,
    tags: ["python", "type-hints", "function"],
  }),

  createSnippet({
    title: "Python List Comprehension",
    description: "Pythonic list comprehension patterns",
    language: "python",
    category: "arrays",
    difficulty: "intermediate",
    type: "syntax",
    code: `numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Square all numbers
squared = [n ** 2 for n in numbers]

# Filter even numbers
evens = [n for n in numbers if n % 2 == 0]

# Nested comprehension
matrix = [[i * j for j in range(3)] for i in range(3)]

# Dictionary comprehension
word_lengths = {word: len(word) for word in ["hello", "world"]}

print(squared)
print(evens)`,
    tags: ["python", "comprehension", "list"],
  }),

  createSnippet({
    title: "Python Class with Properties",
    description: "Object-oriented Python with decorators",
    language: "python",
    category: "classes",
    difficulty: "intermediate",
    type: "class",
    code: `class BankAccount:
    def __init__(self, owner: str, balance: float = 0):
        self.owner = owner
        self._balance = balance

    @property
    def balance(self) -> float:
        return self._balance

    @balance.setter
    def balance(self, amount: float):
        if amount < 0:
            raise ValueError("Balance cannot be negative")
        self._balance = amount

    def deposit(self, amount: float):
        self._balance += amount

    def withdraw(self, amount: float):
        if amount > self._balance:
            raise ValueError("Insufficient funds")
        self._balance -= amount

account = BankAccount("Alice", 1000)
account.deposit(500)
print(f"Balance: $\\{account.balance\\}")`,
    tags: ["python", "class", "property"],
  }),

  createSnippet({
    title: "Python Async/Await",
    description: "Asynchronous Python with asyncio",
    language: "python",
    category: "functions",
    difficulty: "advanced",
    type: "function",
    code: `import asyncio
from typing import List

async def fetch_data(id: int) -> dict:
    await asyncio.sleep(1)  # Simulate network delay
    return {"id": id, "data": f"Data for {id}"}

async def fetch_multiple(ids: List[int]) -> List[dict]:
    tasks = [fetch_data(id) for id in ids]
    results = await asyncio.gather(*tasks)
    return results

async def main():
    ids = [1, 2, 3, 4, 5]
    results = await fetch_multiple(ids)
    for result in results:
        print(result)

# Run the async function
asyncio.run(main())`,
    tags: ["python", "async", "asyncio"],
  }),

  // === SQL ===
  createSnippet({
    title: "SQL SELECT with JOINs",
    description: "Complex SQL query with multiple joins",
    language: "sql",
    category: "sql-queries",
    difficulty: "intermediate",
    type: "query",
    code: `SELECT 
    u.id,
    u.name,
    u.email,
    COUNT(DISTINCT o.id) as total_orders,
    SUM(oi.quantity * oi.price) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE u.created_at >= '2024-01-01'
    AND u.is_active = true
GROUP BY u.id, u.name, u.email
HAVING COUNT(o.id) > 0
ORDER BY total_spent DESC
LIMIT 100;`,
    tags: ["sql", "join", "aggregate"],
  }),

  createSnippet({
    title: "SQL CREATE TABLE",
    description: "Table creation with constraints and indexes",
    language: "sql",
    category: "sql-queries",
    difficulty: "intermediate",
    type: "query",
    code: `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

ALTER TABLE users
    ADD CONSTRAINT check_role 
    CHECK (role IN ('admin', 'user', 'moderator'));`,
    tags: ["sql", "create-table", "constraints"],
  }),

  createSnippet({
    title: "SQL Window Functions",
    description: "Advanced SQL with window functions",
    language: "sql",
    category: "sql-queries",
    difficulty: "advanced",
    type: "query",
    code: `SELECT 
    date,
    revenue,
    LAG(revenue) OVER (ORDER BY date) as prev_day_revenue,
    revenue - LAG(revenue) OVER (ORDER BY date) as daily_change,
    SUM(revenue) OVER (
        ORDER BY date 
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) as rolling_7_day_sum,
    AVG(revenue) OVER (
        ORDER BY date 
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) as rolling_7_day_avg,
    RANK() OVER (ORDER BY revenue DESC) as revenue_rank
FROM daily_sales
WHERE date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY date DESC;`,
    tags: ["sql", "window-functions", "analytics"],
  }),

  // === HTML ===
  createSnippet({
    title: "HTML5 Semantic Layout",
    description: "Modern HTML5 semantic structure",
    language: "html",
    category: "html-layouts",
    difficulty: "beginner",
    type: "full-code",
    code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Semantic HTML Example</title>
</head>
<body>
    <header>
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <article>
            <h1>Welcome to Modern Web</h1>
            <p>This is a semantic HTML5 structure.</p>
        </article>
    </main>
    
    <footer>
        <p>&copy; 2024 Your Company</p>
    </footer>
</body>
</html>`,
    tags: ["html", "semantic", "layout"],
  }),

  // === CSS ===
  createSnippet({
    title: "CSS Grid Layout",
    description: "Responsive grid layout with CSS Grid",
    language: "css",
    category: "css-styling",
    difficulty: "intermediate",
    type: "full-code",
    code: `.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
}`,
    tags: ["css", "grid", "responsive"],
  }),

  createSnippet({
    title: "CSS Custom Properties",
    description: "CSS variables for theming",
    language: "css",
    category: "css-styling",
    difficulty: "intermediate",
    type: "full-code",
    code: `:root {
  --primary-color: #3b82f6;
  --secondary-color: #8b5cf6;
  --text-color: #1f2937;
  --bg-color: #ffffff;
  --border-radius: 0.5rem;
  --spacing-unit: 0.25rem;
}

[data-theme="dark"] {
  --primary-color: #60a5fa;
  --text-color: #f9fafb;
  --bg-color: #111827;
}

.button {
  background-color: var(--primary-color);
  color: white;
  padding: calc(var(--spacing-unit) * 3) calc(var(--spacing-unit) * 6);
  border-radius: var(--border-radius);
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.button:hover {
  filter: brightness(1.1);
}`,
    tags: ["css", "variables", "theming"],
  }),

  // === JSON ===
  createSnippet({
    title: "Package.json Configuration",
    description: "Node.js package.json with scripts",
    language: "json",
    category: "config-files",
    difficulty: "beginner",
    type: "config",
    code: `{
  "name": "my-typescript-app",
  "version": "1.0.0",
  "description": "A modern TypeScript application",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts"
  },
  "dependencies": {
    "express": "^4.18.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "typescript": "^5.3.0",
    "tsx": "^4.7.0",
    "vitest": "^1.2.0"
  }
}`,
    tags: ["json", "package", "config"],
  }),

  createSnippet({
    title: "TypeScript Config",
    description: "tsconfig.json for strict TypeScript",
    language: "json",
    category: "config-files",
    difficulty: "intermediate",
    type: "config",
    code: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022"],
    "moduleResolution": "bundler",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "allowSyntheticDefaultImports": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}`,
    tags: ["json", "typescript", "config"],
  }),

  // === YAML ===
  createSnippet({
    title: "Docker Compose Configuration",
    description: "Multi-service Docker Compose setup",
    language: "yaml",
    category: "config-files",
    difficulty: "intermediate",
    type: "config",
    code: `version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/myapp
    depends_on:
      - db
      - redis
    volumes:
      - ./src:/app/src
    networks:
      - app-network

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=myapp
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    networks:
      - app-network

volumes:
  postgres-data:

networks:
  app-network:
    driver: bridge`,
    tags: ["yaml", "docker-compose", "config"],
  }),

  createSnippet({
    title: "GitHub Actions Workflow",
    description: "CI/CD pipeline with GitHub Actions",
    language: "yaml",
    category: "config-files",
    difficulty: "advanced",
    type: "config",
    code: `name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Run linter
        run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to production
        run: |
          echo "Deploying to production..."
        env:
          API_KEY: \${{ secrets.API_KEY }}`,
    tags: ["yaml", "github-actions", "ci-cd"],
  }),

  // === DOCKER ===
  createSnippet({
    title: "Multi-Stage Dockerfile",
    description: "Optimized Docker build for Node.js",
    language: "docker",
    category: "config-files",
    difficulty: "intermediate",
    type: "config",
    code: `# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

ENV NODE_ENV=production
EXPOSE 3000

USER node

CMD ["node", "dist/index.js"]`,
    tags: ["docker", "multi-stage", "nodejs"],
  }),

  // === BASH ===
  createSnippet({
    title: "Bash Deployment Script",
    description: "Automated deployment bash script",
    language: "bash",
    category: "terminal-commands",
    difficulty: "intermediate",
    type: "command",
    code: `#!/bin/bash

set -e

echo "Starting deployment..."

# Check if git repo is clean
if [[ \`git status --porcelain\` ]]; then
  echo "Error: Working directory not clean"
  exit 1
fi

# Run tests
echo "Running tests..."
npm test

# Build project
echo "Building project..."
npm run build

# Deploy
if [ "$1" == "production" ]; then
  echo "Deploying to production..."
  scp -r dist/* user@server:/var/www/app/
else
  echo "Deploying to staging..."
  scp -r dist/* user@staging:/var/www/app/
fi

echo "Deployment complete!"`,
    tags: ["bash", "deployment", "script"],
  }),

  // === GIT ===
  createSnippet({
    title: "Git Feature Branch Workflow",
    description: "Standard Git workflow commands",
    language: "git",
    category: "git-commands",
    difficulty: "beginner",
    type: "command",
    code: `# Create and switch to feature branch
git checkout -b feature/new-feature

# Make changes and stage them
git add .

# Commit with message
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Update from main
git fetch origin
git rebase origin/main

# Merge to main (after PR approval)
git checkout main
git merge feature/new-feature
git push origin main`,
    tags: ["git", "workflow", "commands"],
  }),

  createSnippet({
    title: "Git Advanced Commands",
    description: "Advanced Git operations",
    language: "git",
    category: "git-commands",
    difficulty: "advanced",
    type: "command",
    code: `# Interactive rebase to squash commits
git rebase -i HEAD~3

# Cherry-pick specific commit
git cherry-pick abc123

# Stash changes with message
git stash push -m "WIP: feature work"

# Apply stash
git stash pop

# Reset to specific commit
git reset --hard HEAD~1

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Clean untracked files
git clean -fd

# Show file history
git log --follow -- path/to/file`,
    tags: ["git", "advanced", "commands"],
  }),
];

export const MULTI_LANG_SNIPPET_COUNT = MULTI_LANGUAGE_SNIPPETS.length;
