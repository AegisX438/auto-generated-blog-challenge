const axios = require("axios");
require("dotenv").config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

// MODELS First try these
const MODELS_TO_TRY = [
    "google/gemini-2.0-flash-exp:free",
    "meta-llama/llama-3.2-11b-vision-instruct:free",
    "microsoft/phi-3-medium-128k-instruct:free",
];

// When AI doesn't response properly use this mock data
const mockArticles = [
    {
        title: "Docker Containers vs Virtual Machines",
        content:
            "Containers and Virtual Machines (VMs) differ primarily in their architecture. A VM emulates an entire computer system, including the hardware, which requires a full operating system (OS) to run. This makes VMs heavy and resource-intensive.\n\nDocker containers, on the other hand, share the host system's kernel and isolate the application processes. This makes them incredibly lightweight, fast to start, and portable. For modern microservices architectures, Docker is the industry standard because it ensures consistency across development, testing, and production environments.",
    },
    {
        title: "Why Node.js is Perfect for Microservices",
        content:
            "Node.js has become a go-to technology for building microservices, and for good reason. Its non-blocking, event-driven architecture makes it extremely efficient at handling concurrent requests, which is crucial for distributed systems.\n\nFurthermore, the vast npm ecosystem provides libraries for almost any requirement. Since Node.js uses JavaScript, frontend developers can easily transition to backend tasks, fostering a Full-Stack culture within teams. Its lightweight nature allows for rapid deployment and scaling in containerized environments like Kubernetes or AWS ECS.",
    },
    {
        title: "The Power of CI/CD Pipelines",
        content:
            "Continuous Integration and Continuous Deployment (CI/CD) are the backbone of modern DevOps. CI ensures that code changes are automatically tested and merged, preventing 'integration hell'. CD takes this further by automatically deploying the code to production if all tests pass.\n\nAutomating these steps reduces human error, speeds up the release cycle, and allows developers to focus on writing code rather than managing deployments. Tools like AWS CodeBuild, GitHub Actions, and Jenkins are essential for maintaining a healthy software lifecycle.",
    },
    {
        title: "PostgreSQL vs SQLite: Which One to Choose?",
        content:
            "Choosing the right database depends heavily on the project scope. SQLite is a serverless, file-based database that is incredibly easy to set up. It is perfect for small projects, embedded systems, or local development environments where simplicity is key.\n\nPostgreSQL, however, is a powerful, open-source object-relational database system. It supports advanced features like complex queries, massive concurrency, and JSON storage. For production-grade applications serving thousands of users, PostgreSQL is usually the superior choice due to its robustness and scalability.",
    },
    {
        title: "Securing Your Web Application: Top Tips",
        content:
            "Security should never be an afterthought. The first line of defense is securing your API endpoints. Always use HTTPS to encrypt data in transit. Implement proper authentication and authorization mechanisms, such as JWT (JSON Web Tokens).\n\nAdditionally, sanitize all user inputs to prevent SQL Injection and Cross-Site Scripting (XSS) attacks. Regularly updating your dependencies is also crucial, as outdated libraries often contain known vulnerabilities. Security is a continuous process, not a one-time setup.",
    },
    {
        title: "Introduction to AWS EC2 for Beginners",
        content:
            "Amazon Elastic Compute Cloud (Amazon EC2) provides scalable computing capacity in the Amazon Web Services (AWS) Cloud. Using Amazon EC2 eliminates your need to invest in hardware up front, so you can develop and deploy applications faster.\n\nYou can use Amazon EC2 to launch as many or as few virtual servers as you need, configure security and networking, and manage storage. Amazon EC2 enables you to scale up or down to handle changes in requirements or spikes in popularity, reducing your need to forecast traffic.",
    },
    {
        title: "Understanding GraphQL vs REST APIs",
        content:
            "REST APIs have been the standard for years, using standard HTTP methods to access resources. However, they often lead to over-fetching or under-fetching of data. GraphQL solves this by allowing clients to request exactly the data they need in a single query.\n\nWhile REST is great for simple caching and simple error handling, GraphQL offers better performance for complex front-end applications where bandwidth is a concern. Choosing between them depends on your specific application requirements and team expertise.",
    },
    {
        title: "Why TypeScript is Essential for Large Projects",
        content:
            "JavaScript is flexible, but that flexibility can lead to runtime errors in large codebases. TypeScript adds static typing to JavaScript, catching errors at compile time rather than runtime. This makes the code more predictable and easier to debug.\n\nFor large teams, TypeScript serves as self-documentation. Interfaces and types clearly define the shape of data, making it easier for new developers to understand the codebase. It integrates perfectly with modern IDEs, providing intelligent code completion and refactoring tools.",
    },
    {
        title: "The Rise of Serverless Architecture",
        content:
            "Serverless computing allows developers to build and run applications without managing servers. Cloud providers like AWS Lambda handle the infrastructure, scaling automatically with usage. You only pay for the compute time you consume.\n\nThis architecture significantly reduces operational costs and complexity. It allows developers to focus purely on business logic rather than server maintenance, patching, or capacity planning. However, it requires a mindset shift in how applications are architected, moving towards event-driven designs.",
    },
    {
        title: "Redis: More Than Just a Cache",
        content:
            "Redis is often known as a caching layer, but it is a powerful in-memory data structure store. It supports strings, hashes, lists, sets, and more. Its speed is unmatched because it holds data in RAM, making it perfect for real-time applications.\n\nBeyond caching, Redis is used for session management, leaderboards, and even as a message broker using its Pub/Sub features. Its versatility makes it a critical component in high-performance system architectures.",
    },
];

const topics = mockArticles.map((a) => a.title); // Get topics from mock

async function generateArticleContent() {
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];

    // !!Prompt rules!!
    const prompt = `Write a technical blog post about "${randomTopic}".
  STRICT FORMAT RULES:
  1. First line must be the Title.
  2. Write at least 2 paragraphs of content.
  3. No prefixes like [Title].
  4. Write in standard English.`;

    // --- PLAN A: Real AI Trial---
    for (const modelName of MODELS_TO_TRY) {
        try {
            console.log(`🔄 Trying Real AI model: ${modelName}...`);

            const response = await axios.post(
                API_URL,
                {
                    model: modelName,
                    messages: [{ role: "user", content: prompt }],
                },
                {
                    headers: {
                        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                        "HTTP-Referer": "http://localhost:3000",
                        "X-Title": "Auto Blog Challenge",
                        "Content-Type": "application/json",
                    },
                    timeout: 15000, // Wait for 15 second
                }
            );

            let generatedText = response.data.choices[0].message.content.trim();
            generatedText = generatedText
                .replace(/^\[.*?\]/g, "")
                .replace(/<[^>]*>/g, "")
                .trim();

            const lines = generatedText.split("\n");
            const cleanLines = lines.filter((line) => line.trim() !== "");

            let title = "";
            let content = "";

            if (cleanLines.length > 1) {
                title = cleanLines[0].replace(/[#*]/g, "").trim();
                content = cleanLines.slice(1).join("\n").trim();
            } else {
                throw new Error("Insufficient content length");
            }

            // If the content too short or empty throw an error
            if (!content || content.length < 100) {
                throw new Error("Content too short");
            }

            console.log(`✅ Success with Real AI: ${modelName}`);
            return { title, content };
        } catch (error) {
            console.warn(`❌ Real AI failed (${modelName}). trying next...`);
        }
    }

    // --- PLAN B: MOCK DATA ---
    console.warn(
        "⚠️ All Real AI models failed. Switching to High-Quality Mock Data."
    );

    // Randomly pick a blog
    const backupArticle =
        mockArticles[Math.floor(Math.random() * mockArticles.length)];

    console.log(`✅ Served Mock Article: ${backupArticle.title}`);
    return backupArticle;
}

module.exports = { generateArticleContent };
