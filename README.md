# Auto-Generated Tech Blog (AWS + Docker)

This project is a Full-Stack Technical Challenge submission for Assimetria. It is an auto-generated blog application that leverages a Hybrid AI system to create daily technical content automatically.

**🚀 Live Demo:** [http://63.176.47.85:8080]  
_(Please note: Hosted on an AWS EC2 Free Tier instance.)_

---

## 📋 Features

-   **Frontend:** Built with **React (Vite)**, Dockerized for portability.
-   **Backend:** **Node.js (Express)** API handling content generation and serving.
-   **Database:** **SQLite** for zero-config persistence (Docker volume managed).
-   **AI Engine:** **Hybrid Failover System** (Real AI + Mock Fallback).
-   **Automation:** **Cron Job** configured on EC2 to generate 1 article/day automatically.
-   **Infrastructure:** Docker Compose running on **AWS EC2**.

---

## 🛠 Architectural Decisions

### 1. AI Strategy: "Hybrid Failover System"

To ensure **100% uptime** during the demo, I implemented a robust fallback strategy:

-   The system first attempts to generate content using real AI models via **OpenRouter** (Google Gemini 2.0 Flash / Meta Llama 3).
-   If the free-tier APIs are overloaded or unreachable, the system automatically switches to a high-quality **Mock Data Engine**.
-   **Result:** No "Empty Content" errors, guaranteed stability.

### 2. Database: SQLite

I chose **SQLite** deliberately for this challenge. Since the requirement was a single-instance deployment, a file-based database eliminates the latency and overhead of a separate RDS instance while remaining fully persistent via Docker Volumes.

### 3. Deployment Strategy: Manual Git Workflow (EC2)

While the challenge mentioned CodeBuild/ECR, I opted for a **Git-based Manual Deployment** strategy for this specific MVP timeline.

-   **Reasoning:** For a single-developer, 1-week challenge, setting up a full CI/CD pipeline adds complexity that can slow down feature iteration.
-   **Method:** I utilized `docker-compose` directly on the EC2 instance, pulling changes from GitHub. This allowed for immediate feedback loops and faster debugging in the production environment.

---

## 💻 How to Run Locally

### Prerequisites

-   Node.js & npm
-   Docker & Docker Compose
-   An API Key (OpenRouter/OpenAI)

### Installation Steps

1. **Clone the repository**
   git clone [https://github.com/AegisX438/auto-generated-blog-challenge.git]

**Configure Environment Create a .env file in the backend/ directory:**
OPENROUTER_API_KEY=your_api_key

**Run with Docker**
docker compose -f infra/docker-compose.yml up --build

**Access the App**
Frontend: http://localhost:8080
Backend API: http://localhost:3000

📂 Project Structure
.
├── backend/ # Node.js API, AI Logic & SQLite DB
├── frontend/ # React Application
├── infra/ # Docker Compose & Configuration
└── README.md # Documentation
