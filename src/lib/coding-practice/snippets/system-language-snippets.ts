/**
 * System-Language Code Snippets
 *
 * Java, C++, C, Go, Rust, and Markdown snippets — languages that previously
 * had no curated coverage, which forced the "Try Curated Snippets" path in
 * the coding dashboard to warn that no static snippets were available.
 */

import type { CodeSnippet } from "../types";
import { generateMetadata } from "../snippet-utils";

function createSnippet(partial: Omit<CodeSnippet, "id" | "metadata">): CodeSnippet {
  return {
    id: `system-${Math.random().toString(36).substring(2, 11)}`,
    ...partial,
    metadata: generateMetadata(partial.code, partial.language),
  };
}

export const SYSTEM_LANGUAGE_SNIPPETS: CodeSnippet[] = [
  // === JAVA ===
  createSnippet({
    title: "Java Class with Inheritance",
    description: "Object-oriented Java with inheritance and override",
    language: "java",
    category: "classes",
    difficulty: "intermediate",
    type: "class",
    code: `public abstract class Animal {
    protected String name;

    public Animal(String name) {
        this.name = name;
    }

    public abstract String speak();

    public void introduce() {
        System.out.println("I am a " + name + ".");
    }
}

public class Dog extends Animal {
    public Dog(String name) {
        super(name);
    }

    @Override
    public String speak() {
        return "Woof!";
    }
}

public class Main {
    public static void main(String[] args) {
        Animal pet = new Dog("Buddy");
        pet.introduce();
        System.out.println(pet.speak());
    }
}`,
    tags: ["java", "class", "inheritance", "oop"],
  }),

  createSnippet({
    title: "Java Streams Pipeline",
    description: "Functional processing with Java streams",
    language: "java",
    category: "algorithms",
    difficulty: "advanced",
    type: "function",
    code: `import java.util.List;
import java.util.stream.Collectors;

public class StreamExample {
    record Employee(String name, int salary) {}

    public static void main(String[] args) {
        List<Employee> employees = List.of(
            new Employee("Alice", 120_000),
            new Employee("Bob", 85_000),
            new Employee("Carol", 150_000)
        );

        List<String> highEarners = employees.stream()
            .filter(e -> e.salary() > 100_000)
            .sorted((a, b) -> Integer.compare(b.salary(), a.salary()))
            .map(Employee::name)
            .collect(Collectors.toList());

        double average = employees.stream()
            .mapToInt(Employee::salary)
            .average()
            .orElse(0);

        System.out.println(highEarners);
        System.out.println("Average salary: " + average);
    }
}`,
    tags: ["java", "streams", "functional", "filter"],
  }),

  // === C++ ===
  createSnippet({
    title: "C++ Function with References",
    description: "Pass-by-reference and default arguments in C++",
    language: "cpp",
    category: "functions",
    difficulty: "intermediate",
    type: "function",
    code: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

// Pass by reference avoids copying the vector
double average(const vector<double>& numbers) {
    if (numbers.empty()) {
        return 0.0;
    }
    double sum = 0.0;
    for (double n : numbers) {
        sum += n;
    }
    return sum / numbers.size();
}

void greet(const string& name, bool excited = false) {
    string message = "Hello, " + name;
    cout << (excited ? message + "!" : message + ".") << endl;
}

int main() {
    vector<double> scores = {85.0, 92.5, 78.5, 91.0};
    cout << "Average: " << average(scores) << endl;
    greet("C++", true);
    return 0;
}`,
    tags: ["cpp", "references", "function", "vector"],
  }),

  createSnippet({
    title: "C++ Class with Memory Management",
    description: "RAII-style class with constructors and destructor",
    language: "cpp",
    category: "classes",
    difficulty: "advanced",
    type: "class",
    code: `#include <iostream>
#include <cstring>

using namespace std;

class Buffer {
private:
    char* data;
    size_t size;

public:
    explicit Buffer(size_t size) : size(size) {
        data = new char[size];
        memset(data, 0, size);
        cout << "Buffer allocated (" << size << " bytes)" << endl;
    }

    ~Buffer() {
        delete[] data;
        cout << "Buffer freed" << endl;
    }

    void write(size_t index, char value) {
        if (index >= size) {
            throw out_of_range("Index out of bounds");
        }
        data[index] = value;
    }

    char read(size_t index) const {
        return data[index];
    }
};

int main() {
    Buffer buffer(16);
    buffer.write(0, 'K');
    buffer.write(1, 'F');
    cout << buffer.read(0) << buffer.read(1) << endl;
    return 0;
}`,
    tags: ["cpp", "class", "raii", "memory"],
  }),

  // === C ===
  createSnippet({
    title: "C Struct and Pointers",
    description: "Define structs and pass pointers in C",
    language: "c",
    category: "variables",
    difficulty: "intermediate",
    type: "full-code",
    code: `#include <stdio.h>

typedef struct {
    char name[32];
    int age;
    double balance;
} Account;

void print_account(const Account* account) {
    printf("Name: %s\\n", account->name);
    printf("Age: %d\\n", account->age);
    printf("Balance: %.2f\\n", account->balance);
}

void deposit(Account* account, double amount) {
    account->balance += amount;
}

int main(void) {
    Account user = {"Alice", 30, 1000.00};

    deposit(&user, 250.50);
    print_account(&user);

    return 0;
}`,
    tags: ["c", "struct", "pointers", "printf"],
  }),

  createSnippet({
    title: "C String Utilities",
    description: "Manual string handling with C-style arrays",
    language: "c",
    category: "arrays",
    difficulty: "advanced",
    type: "full-code",
    code: `#include <stdio.h>
#include <stdbool.h>

int string_length(const char* str) {
    int len = 0;
    while (str[len] != '\\0') {
        len++;
    }
    return len;
}

void reverse_string(char* str) {
    int left = 0;
    int right = string_length(str) - 1;

    while (left < right) {
        char temp = str[left];
        str[left] = str[right];
        str[right] = temp;
        left++;
        right--;
    }
}

bool is_palindrome(const char* str) {
    int left = 0;
    int right = string_length(str) - 1;

    while (left < right) {
        if (str[left] != str[right]) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}

int main(void) {
    char word[] = "racecar";
    printf("Length: %d\\n", string_length(word));
    printf("Palindrome: %s\\n", is_palindrome(word) ? "yes" : "no");

    reverse_string(word);
    printf("Reversed: %s\\n", word);

    return 0;
}`,
    tags: ["c", "strings", "algorithms", "pointers"],
  }),

  // === GO ===
  createSnippet({
    title: "Go HTTP Server",
    description: "REST endpoints with Go net/http",
    language: "go",
    category: "functions",
    difficulty: "intermediate",
    type: "full-code",
    code: `package main

import (
	"encoding/json"
	"log"
	"net/http"
)

type Task struct {
	ID    int    \`json:"id"\`
	Title string \`json:"title"\`
	Done  bool   \`json:"done"\`
}

var tasks = []Task{
	{ID: 1, Title: "Learn Go", Done: true},
	{ID: 2, Title: "Build an API", Done: false},
}

func listTasks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(tasks); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func health(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("ok"))
}

func main() {
	http.HandleFunc("/api/tasks", listTasks)
	http.HandleFunc("/health", health)

	log.Println("Server listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}`,
    tags: ["go", "http", "rest", "json"],
  }),

  createSnippet({
    title: "Go Concurrency with Channels",
    description: "Worker pool pattern with goroutines and channels",
    language: "go",
    category: "algorithms",
    difficulty: "advanced",
    type: "full-code",
    code: `package main

import (
	"fmt"
	"sync"
)

func worker(id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup) {
	defer wg.Done()
	for job := range jobs {
		results <- job * 2
		fmt.Printf("Worker %d processed job %d\\n", id, job)
	}
}

func main() {
	const numJobs = 10
	const numWorkers = 3

	jobs := make(chan int, numJobs)
	results := make(chan int, numJobs)

	var wg sync.WaitGroup

	for w := 1; w <= numWorkers; w++ {
		wg.Add(1)
		go worker(w, jobs, results, &wg)
	}

	for j := 1; j <= numJobs; j++ {
		jobs <- j
	}
	close(jobs)

	wg.Wait()
	close(results)

	total := 0
	for result := range results {
		total += result
	}
	fmt.Println("Total:", total)
}`,
    tags: ["go", "goroutines", "channels", "concurrency"],
  }),

  // === RUST ===
  createSnippet({
    title: "Rust Error Handling",
    description: "Result and Option patterns in Rust",
    language: "rust",
    category: "error-handling",
    difficulty: "intermediate",
    type: "function",
    code: `fn divide(numerator: f64, denominator: f64) -> Result<f64, String> {
    if denominator == 0.0 {
        return Err("Cannot divide by zero".to_string());
    }
    Ok(numerator / denominator)
}

fn parse_number(raw: &str) -> Option<i32> {
    raw.trim().parse::<i32>().ok()
}

fn main() {
    match divide(10.0, 2.0) {
        Ok(result) => println!("10 / 2 = {}", result),
        Err(error) => println!("Error: {}", error),
    }

    match parse_number("42") {
        Some(value) => println!("Parsed: {}", value),
        None => println!("Not a valid number"),
    }
}`,
    tags: ["rust", "error-handling", "result", "option"],
  }),

  createSnippet({
    title: "Rust Struct with impl",
    description: "Rust struct, impl block, and unit tests",
    language: "rust",
    category: "classes",
    difficulty: "advanced",
    type: "class",
    code: `struct BankAccount {
    owner: String,
    balance: f64,
}

impl BankAccount {
    fn new(owner: &str, initial_balance: f64) -> BankAccount {
        BankAccount {
            owner: owner.to_string(),
            balance: initial_balance,
        }
    }

    fn deposit(&mut self, amount: f64) {
        self.balance += amount;
    }

    fn withdraw(&mut self, amount: f64) -> Result<f64, String> {
        if amount > self.balance {
            return Err("Insufficient funds".to_string());
        }
        self.balance -= amount;
        Ok(amount)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn deposit_increases_balance() {
        let mut account = BankAccount::new("Alice", 100.0);
        account.deposit(50.0);
        assert_eq!(account.balance, 150.0);
    }

    #[test]
    fn withdraw_errors_on_insufficient_funds() {
        let mut account = BankAccount::new("Bob", 10.0);
        assert!(account.withdraw(20.0).is_err());
    }
}`,
    tags: ["rust", "struct", "impl", "testing"],
  }),

  // === MARKDOWN ===
  createSnippet({
    title: "Markdown README",
    description: "Project README with headings, code, and links",
    language: "markdown",
    category: "full-snippets",
    difficulty: "beginner",
    type: "full-code",
    code: `# KeyFlow

A fast, focused typing practice app built with Next.js.

## Features

- Typing and coding practice with AI-generated content
- Live WPM and accuracy tracking
- Multiple keyboard layouts
- Daily challenges

## Installation

\`\`\`bash
git clone https://github.com/example/keyflow.git
cd keyflow
npm install
npm run dev
\`\`\`

## Usage

1. Set your \`GROQ_API_KEYS\` in \`.env.local\`
2. Open http://localhost:3000
3. Start typing!

## License

MIT`,
    tags: ["markdown", "readme", "documentation"],
  }),

  createSnippet({
    title: "Markdown API Documentation",
    description: "Well-structured endpoint documentation",
    language: "markdown",
    category: "full-snippets",
    difficulty: "intermediate",
    type: "full-code",
    code: `# User API

RESTful endpoints for managing users.

## Endpoints

### \`POST /api/users\`

Create a new user.

**Request body:**

\`\`\`json
{
  "name": "Alice",
  "email": "alice@example.com"
}
\`\`\`

**Response:** \`201 Created\`

| Field | Type   | Required | Description        |
|-------|--------|----------|--------------------|
| name  | string | yes      | Display name       |
| email | string | yes      | Unique email       |

### \`GET /api/users/:id\`

Fetch a user by ID.

**Query parameters:**

- \`id\` — the numeric user identifier

**Error codes:**

- \`404\` — user not found
- \`400\` — invalid request format`,
    tags: ["markdown", "api", "documentation"],
  }),
];

export const SYSTEM_LANGUAGE_SNIPPET_COUNT = SYSTEM_LANGUAGE_SNIPPETS.length;
