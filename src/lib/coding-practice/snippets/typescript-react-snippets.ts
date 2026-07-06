/**
 * TypeScript & React Code Snippets
 *
 * TypeScript type definitions, interfaces, and React components.
 */

import type { CodeSnippet } from "../types";
import { generateMetadata } from "../snippet-utils";

function createSnippet(partial: Omit<CodeSnippet, "id" | "metadata">): CodeSnippet {
  return {
    id: `ts-react-${Math.random().toString(36).substring(2, 11)}`,
    ...partial,
    metadata: generateMetadata(partial.code, partial.language),
  };
}

export const TYPESCRIPT_REACT_SNIPPETS: CodeSnippet[] = [
  // === TYPESCRIPT BASICS ===
  createSnippet({
    title: "Type Annotations",
    description: "Basic TypeScript type annotations",
    language: "typescript",
    category: "basic-syntax",
    difficulty: "beginner",
    type: "syntax",
    code: `const name: string = "TypeScript";
const age: number = 5;
const isTyped: boolean = true;
const tags: string[] = ["type-safe", "modern"];

function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`,
    tags: ["types", "annotations", "basic"],
  }),

  createSnippet({
    title: "Interface Definition",
    description: "TypeScript interface for type safety",
    language: "typescript",
    category: "basic-syntax",
    difficulty: "intermediate",
    type: "interface",
    code: `interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  isActive?: boolean;
}

function createUser(data: Omit<User, "id">): User {
  return {
    id: Math.random(),
    ...data
  };
}

const user = createUser({
  name: "Alice",
  email: "alice@example.com",
  role: "user"
});`,
    tags: ["interface", "types", "omit"],
  }),

  createSnippet({
    title: "Generic Function",
    description: "Type-safe generic function",
    language: "typescript",
    category: "functions",
    difficulty: "advanced",
    type: "function",
    code: `function identity<T>(value: T): T {
  return value;
}

function getProperty<T, K extends keyof T>(
  obj: T,
  key: K
): T[K] {
  return obj[key];
}

interface Person {
  name: string;
  age: number;
}

const person: Person = { name: "Bob", age: 30 };
const name = getProperty(person, "name");`,
    tags: ["generics", "keyof", "types"],
  }),

  createSnippet({
    title: "Type Guards",
    description: "Custom type guards for runtime checks",
    language: "typescript",
    category: "basic-syntax",
    difficulty: "advanced",
    type: "function",
    code: `interface Cat {
  type: "cat";
  meow: () => void;
}

interface Dog {
  type: "dog";
  bark: () => void;
}

type Animal = Cat | Dog;

function isCat(animal: Animal): animal is Cat {
  return animal.type === "cat";
}

function makeSound(animal: Animal) {
  if (isCat(animal)) {
    animal.meow();
  } else {
    animal.bark();
  }
}`,
    tags: ["type-guard", "union", "discriminated"],
  }),

  // === REACT COMPONENTS ===
  createSnippet({
    title: "Simple Button Component",
    description: "Basic React component with TypeScript",
    language: "typescript",
    framework: "react",
    category: "react-components",
    difficulty: "beginner",
    type: "component",
    code: `interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function Button({
  label,
  onClick,
  disabled = false
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="btn-primary"
    >
      {label}
    </button>
  );
}`,
    tags: ["react", "component", "props"],
  }),

  createSnippet({
    title: "Counter with useState",
    description: "React state management with TypeScript",
    language: "typescript",
    framework: "react",
    category: "react-components",
    difficulty: "intermediate",
    type: "component",
    code: `import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState<number>(0);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(0);

  return (
    <div className="counter">
      <h2>Count: {count}</h2>
      <div className="buttons">
        <button onClick={increment}>+</button>
        <button onClick={decrement}>-</button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}`,
    tags: ["react", "hooks", "useState"],
  }),

  createSnippet({
    title: "Form with Controlled Inputs",
    description: "React form with type-safe state management",
    language: "typescript",
    framework: "react",
    category: "react-components",
    difficulty: "intermediate",
    type: "component",
    code: `import { useState, FormEvent } from "react";

interface FormData {
  name: string;
  email: string;
  message: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Submitted:", formData);
  };

  const handleChange = (
    field: keyof FormData,
    value: string
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
        placeholder="Name"
      />
      <input
        value={formData.email}
        onChange={(e) => handleChange("email", e.target.value)}
        placeholder="Email"
      />
      <textarea
        value={formData.message}
        onChange={(e) => handleChange("message", e.target.value)}
        placeholder="Message"
      />
      <button type="submit">Submit</button>
    </form>
  );
}`,
    tags: ["react", "form", "controlled"],
  }),

  createSnippet({
    title: "Custom Hook",
    description: "Reusable custom React hook with TypeScript",
    language: "typescript",
    framework: "react",
    category: "react-components",
    difficulty: "advanced",
    type: "function",
    code: `import { useState, useEffect } from "react";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useFetch<T>(url: string): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const response = await fetch(url);
        const data = await response.json();

        if (!cancelled) {
          setState({ data, loading: false, error: null });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: error as Error
          });
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return state;
}`,
    tags: ["react", "custom-hook", "fetch"],
  }),

  createSnippet({
    title: "Context Provider",
    description: "React Context with TypeScript",
    language: "typescript",
    framework: "react",
    category: "react-components",
    difficulty: "advanced",
    type: "component",
    code: `import { createContext, useContext, useState, ReactNode } from "react";

interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}`,
    tags: ["react", "context", "provider"],
  }),

  // === NEXT.JS COMPONENTS ===
  createSnippet({
    title: "Next.js Server Component",
    description: "React Server Component in Next.js",
    language: "typescript",
    framework: "nextjs",
    category: "react-components",
    difficulty: "intermediate",
    type: "component",
    code: `interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
}

async function getUserData(id: string) {
  const res = await fetch(\`https://api.example.com/users/\${id}\`);
  return res.json();
}

export default async function UserPage({ params }: PageProps) {
  const user = await getUserData(params.id);

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}`,
    tags: ["nextjs", "server-component", "async"],
  }),

  createSnippet({
    title: "Next.js API Route",
    description: "Type-safe Next.js API route handler",
    language: "typescript",
    framework: "nextjs",
    category: "api-calls",
    difficulty: "advanced",
    type: "function",
    code: `import { NextRequest, NextResponse } from "next/server";

interface CreateUserBody {
  name: string;
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateUserBody = await request.json();

    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const user = {
      id: Math.random().toString(36),
      ...body,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}`,
    tags: ["nextjs", "api-route", "post"],
  }),

  createSnippet({
    title: "Next.js Middleware",
    description: "Next.js middleware for authentication",
    language: "typescript",
    framework: "nextjs",
    category: "api-calls",
    difficulty: "advanced",
    type: "function",
    code: `import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token");

  if (!token) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  const response = NextResponse.next();

  response.headers.set("x-custom-header", "value");

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"]
};`,
    tags: ["nextjs", "middleware", "auth"],
  }),
];

export const TS_REACT_SNIPPET_COUNT = TYPESCRIPT_REACT_SNIPPETS.length;
