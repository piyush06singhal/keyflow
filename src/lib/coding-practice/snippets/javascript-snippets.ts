/**
 * JavaScript Code Snippets
 *
 * Comprehensive collection of JavaScript snippets for coding practice.
 */

import type { CodeSnippet } from "../types";
import { generateMetadata } from "../snippet-utils";

function createSnippet(partial: Omit<CodeSnippet, "id" | "metadata">): CodeSnippet {
  return {
    id: `js-${Math.random().toString(36).substring(2, 11)}`,
    ...partial,
    metadata: generateMetadata(partial.code, partial.language),
  };
}

export const JAVASCRIPT_SNIPPETS: CodeSnippet[] = [
  // === BEGINNER LEVEL ===
  createSnippet({
    title: "Variable Declarations",
    description: "Modern JavaScript variable declarations",
    language: "javascript",
    category: "variables",
    difficulty: "beginner",
    type: "syntax",
    code: `const name = "JavaScript";
let count = 0;
const isActive = true;

count += 1;
console.log(\`\${name}: \${count}\`);`,
    tags: ["variables", "const", "let", "template-literals"],
  }),

  createSnippet({
    title: "Arrow Function",
    description: "ES6 arrow function syntax",
    language: "javascript",
    category: "functions",
    difficulty: "beginner",
    type: "function",
    code: `const add = (a, b) => a + b;
const square = num => num * num;
const greet = () => "Hello!";

console.log(add(5, 3));
console.log(square(4));
console.log(greet());`,
    tags: ["arrow-function", "es6", "function"],
  }),

  createSnippet({
    title: "Array Methods",
    description: "Common JavaScript array methods",
    language: "javascript",
    category: "arrays",
    difficulty: "beginner",
    type: "function",
    code: `const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);
const sum = numbers.reduce((acc, n) => acc + n, 0);
const hasThree = numbers.includes(3);

console.log({ doubled, evens, sum, hasThree });`,
    tags: ["array", "map", "filter", "reduce"],
  }),

  createSnippet({
    title: "Object Literals",
    description: "JavaScript object creation and access",
    language: "javascript",
    category: "objects",
    difficulty: "beginner",
    type: "syntax",
    code: `const user = {
  name: "Alice",
  age: 25,
  email: "alice@example.com",
  isActive: true
};

const { name, email } = user;
console.log(\`\${name} - \${email}\`);

user.age += 1;
console.log(user.age);`,
    tags: ["object", "destructuring", "properties"],
  }),

  createSnippet({
    title: "For Loop",
    description: "Basic JavaScript for loop",
    language: "javascript",
    category: "loops",
    difficulty: "beginner",
    type: "syntax",
    code: `for (let i = 0; i < 5; i++) {
  console.log(\`Iteration: \${i}\`);
}

const items = ["apple", "banana", "orange"];
for (const item of items) {
  console.log(item);
}`,
    tags: ["loop", "for", "iteration"],
  }),

  createSnippet({
    title: "If Else Statement",
    description: "Conditional logic in JavaScript",
    language: "javascript",
    category: "conditionals",
    difficulty: "beginner",
    type: "syntax",
    code: `const age = 18;

if (age >= 18) {
  console.log("Adult");
} else if (age >= 13) {
  console.log("Teenager");
} else {
  console.log("Child");
}

const status = age >= 18 ? "Adult" : "Minor";
console.log(status);`,
    tags: ["conditional", "if-else", "ternary"],
  }),

  // === INTERMEDIATE LEVEL ===
  createSnippet({
    title: "Async/Await Function",
    description: "Asynchronous JavaScript with async/await",
    language: "javascript",
    category: "functions",
    difficulty: "intermediate",
    type: "function",
    code: `async function fetchUser(id) {
  try {
    const response = await fetch(\`/api/users/\${id}\`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw error;
  }
}

fetchUser(1).then(user => console.log(user));`,
    tags: ["async", "await", "promises", "fetch"],
  }),

  createSnippet({
    title: "Class Definition",
    description: "ES6 class with constructor and methods",
    language: "javascript",
    category: "classes",
    difficulty: "intermediate",
    type: "class",
    code: `class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  get area() {
    return this.width * this.height;
  }

  static fromSquare(side) {
    return new Rectangle(side, side);
  }
}

const rect = new Rectangle(10, 5);
console.log(rect.area);`,
    tags: ["class", "constructor", "getter", "static"],
  }),

  createSnippet({
    title: "Promise Chain",
    description: "Working with JavaScript Promises",
    language: "javascript",
    category: "functions",
    difficulty: "intermediate",
    type: "function",
    code: `function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

delay(1000)
  .then(() => console.log("1 second"))
  .then(() => delay(1000))
  .then(() => console.log("2 seconds"))
  .catch(error => console.error(error))
  .finally(() => console.log("Done"));`,
    tags: ["promise", "async", "chain"],
  }),

  createSnippet({
    title: "Destructuring & Spread",
    description: "Advanced destructuring and spread operators",
    language: "javascript",
    category: "basic-syntax",
    difficulty: "intermediate",
    type: "syntax",
    code: `const user = {
  name: "Bob",
  age: 30,
  email: "bob@example.com"
};

const { name, ...rest } = user;
const updatedUser = { ...user, age: 31 };

const [first, second, ...others] = [1, 2, 3, 4, 5];
const combined = [...others, 6, 7];

console.log({ name, rest, first, combined });`,
    tags: ["destructuring", "spread", "rest"],
  }),

  createSnippet({
    title: "Higher Order Function",
    description: "Functions that return or accept functions",
    language: "javascript",
    category: "functions",
    difficulty: "intermediate",
    type: "function",
    code: `function createMultiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5));
console.log(triple(5));

const numbers = [1, 2, 3];
console.log(numbers.map(double));`,
    tags: ["higher-order", "closure", "function"],
  }),

  createSnippet({
    title: "Error Handling",
    description: "Try-catch error handling pattern",
    language: "javascript",
    category: "error-handling",
    difficulty: "intermediate",
    type: "function",
    code: `function parseJSON(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    return { success: true, data };
  } catch (error) {
    console.error("Parse error:", error.message);
    return { success: false, error: error.message };
  }
}

const result = parseJSON('{"name": "Test"}');
console.log(result);`,
    tags: ["error", "try-catch", "json"],
  }),

  // === ADVANCED LEVEL ===
  createSnippet({
    title: "Debounce Function",
    description: "Utility function to debounce rapid calls",
    language: "javascript",
    category: "algorithms",
    difficulty: "advanced",
    type: "algorithm",
    code: `function debounce(func, delay) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

const handleSearch = debounce((query) => {
  console.log("Searching for:", query);
}, 300);

handleSearch("test");`,
    tags: ["debounce", "utility", "closure"],
  }),

  createSnippet({
    title: "Deep Clone Object",
    description: "Recursive deep cloning implementation",
    language: "javascript",
    category: "algorithms",
    difficulty: "advanced",
    type: "algorithm",
    code: `function deepClone(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }

  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

const original = { a: 1, b: { c: 2 } };
const copy = deepClone(original);`,
    tags: ["recursion", "clone", "object"],
  }),

  createSnippet({
    title: "Custom Event Emitter",
    description: "Simple event emitter implementation",
    language: "javascript",
    category: "classes",
    difficulty: "advanced",
    type: "class",
    code: `class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(listener => {
        listener(...args);
      });
    }
  }

  off(event, listener) {
    if (this.events[event]) {
      this.events[event] = this.events[event]
        .filter(l => l !== listener);
    }
  }
}`,
    tags: ["event-emitter", "class", "pattern"],
  }),

  createSnippet({
    title: "Memoization",
    description: "Function memoization for performance",
    language: "javascript",
    category: "algorithms",
    difficulty: "advanced",
    type: "algorithm",
    code: `function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const fibonacci = memoize((n) => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

console.log(fibonacci(10));`,
    tags: ["memoization", "optimization", "cache"],
  }),

  createSnippet({
    title: "Promise.all with Error Handling",
    description: "Parallel async operations with proper error handling",
    language: "javascript",
    category: "api-calls",
    difficulty: "advanced",
    type: "function",
    code: `async function fetchMultipleUsers(ids) {
  try {
    const promises = ids.map(id =>
      fetch(\`/api/users/\${id}\`).then(r => r.json())
    );

    const users = await Promise.all(promises);
    return { success: true, data: users };
  } catch (error) {
    console.error("Fetch failed:", error);
    return { success: false, error: error.message };
  }
}

fetchMultipleUsers([1, 2, 3])
  .then(result => console.log(result));`,
    tags: ["promise", "async", "error-handling"],
  }),

  // === FULL SNIPPETS ===
  createSnippet({
    title: "Todo Manager Module",
    description: "Complete todo list manager with CRUD operations",
    language: "javascript",
    category: "full-snippets",
    difficulty: "advanced",
    type: "full-code",
    code: `class TodoManager {
  constructor() {
    this.todos = [];
    this.nextId = 1;
  }

  add(text) {
    const todo = {
      id: this.nextId++,
      text,
      completed: false,
      createdAt: Date.now()
    };
    this.todos.push(todo);
    return todo;
  }

  remove(id) {
    this.todos = this.todos.filter(t => t.id !== id);
  }

  toggle(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
  }

  getAll() {
    return [...this.todos];
  }

  getActive() {
    return this.todos.filter(t => !t.completed);
  }

  getCompleted() {
    return this.todos.filter(t => t.completed);
  }

  clearCompleted() {
    this.todos = this.todos.filter(t => !t.completed);
  }
}

const manager = new TodoManager();
manager.add("Learn JavaScript");
manager.add("Build a project");
console.log(manager.getAll());`,
    tags: ["class", "crud", "full-example"],
  }),
];

export const JS_SNIPPET_COUNT = JAVASCRIPT_SNIPPETS.length;
