"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { Code2, ChevronRight } from "lucide-react";

const codeSnippets = {
  JavaScript: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,
  TypeScript: `interface User {
  id: number;
  name: string;
  email: string;
}

const getUser = async (id: number): Promise<User> => {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
};`,
  Python: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)`,
  Java: `public class BinarySearch {
  public static int search(int[] arr, int target) {
    int lo = 0, hi = arr.length - 1;
    while (lo <= hi) {
      int mid = (lo + hi) / 2;
      if (arr[mid] == target) return mid;
      if (arr[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return -1;
  }
}`,
  "C++": `#include <vector>

int sumEven(const std::vector<int>& nums) {
  int total = 0;
  for (int n : nums) {
    if (n % 2 == 0) total += n;
  }
  return total;
}`,
  SQL: `SELECT users.name, COUNT(orders.id) AS order_count
FROM users
LEFT JOIN orders ON orders.user_id = users.id
GROUP BY users.name
ORDER BY order_count DESC
LIMIT 10;`,
  React: `export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`,
};

const languages = Object.keys(codeSnippets) as (keyof typeof codeSnippets)[];

const FILE_EXTENSIONS: Record<keyof typeof codeSnippets, string> = {
  JavaScript: "js",
  TypeScript: "ts",
  Python: "py",
  Java: "java",
  "C++": "cpp",
  SQL: "sql",
  React: "jsx",
};

export function CodingPracticeSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedLang, setSelectedLang] =
    useState<keyof typeof codeSnippets>("JavaScript");
  const activeSnippet = codeSnippets[selectedLang];
  const snippetLines = activeSnippet.split("\n");

  return (
    <section id="coding" className="relative py-24 sm:py-32" ref={ref}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <div className="border-border bg-primary/10 text-primary shadow-pop-sm mb-4 inline-flex w-fit items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-bold">
              <Code2 className="h-4 w-4" />
              Coding Practice
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
              Type Real Code,
              <br />
              <span className="from-primary to-accent-foreground bg-gradient-to-r bg-clip-text text-transparent">
                Build Real Skills
              </span>
            </h2>

            <p className="text-muted-foreground mt-6 text-lg leading-relaxed text-pretty">
              Practice typing actual code snippets from popular programming languages.
              Get comfortable with syntax, special characters, and common patterns used
              in real-world development.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "✓ Real indentation, brackets, and line breaks",
                "✓ Real-world code patterns",
                "✓ 17 programming languages",
                "✓ Track code-specific metrics",
              ].map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3 text-base"
                >
                  <span className="text-success">{feature.split(" ")[0]}</span>
                  <span className="text-muted-foreground">{feature.substring(2)}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-8"
            >
              <Button size="lg" className="group" asChild>
                <Link href="/practice/code/dashboard">
                  Start Coding Practice
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Column - Code Editor Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex min-w-0 items-center"
          >
            <Card className="w-full min-w-0 overflow-hidden">
              {/* Editor Header */}
              <div className="border-border-subtle bg-muted/30 flex items-center justify-between border-b-2 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="bg-destructive/80 h-3 w-3 rounded-full" />
                  <div className="bg-warning/80 h-3 w-3 rounded-full" />
                  <div className="bg-success/80 h-3 w-3 rounded-full" />
                </div>
                <div className="text-muted-foreground font-mono text-xs">
                  practice.{FILE_EXTENSIONS[selectedLang]}
                </div>
              </div>

              {/* Language Tabs */}
              <div className="border-border-subtle bg-muted/20 border-b-2">
                <div className="flex gap-1 overflow-x-auto p-2">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLang(lang)}
                      className={`rounded px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                        selectedLang === lang
                          ? "bg-background text-foreground shadow-key-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Display */}
              <div className="relative overflow-hidden">
                <div className="max-h-[400px] overflow-x-auto overflow-y-auto p-6 font-mono text-sm leading-relaxed">
                  <motion.pre
                    key={selectedLang}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-foreground/90 w-max min-w-full"
                  >
                    <code>{activeSnippet}</code>
                  </motion.pre>
                </div>

                {/* Gradient Overlay */}
                <div className="from-card pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t to-transparent" />
              </div>

              {/* Editor Footer */}
              <div className="border-border-subtle bg-muted/30 text-muted-foreground flex items-center justify-between border-t-2 px-4 py-2 text-xs">
                <span>Lines: {snippetLines.length}</span>
                <span>Characters: {activeSnippet.length}</span>
                <span className="text-success">Ready</span>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
