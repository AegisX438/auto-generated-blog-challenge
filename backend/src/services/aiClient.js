const axios = require("axios");
require("dotenv").config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

const MODELS_TO_TRY = [
    "mistralai/mistral-7b-instruct:free",
    "meta-llama/llama-3-8b-instruct:free",
    "microsoft/phi-3-mini-128k-instruct:free",
    "google/gemma-2-9b-it:free",
];

const topics = [
    "Docker Containers vs Virtual Machines",
    "The Future of React.js",
    "Why Node.js is great for backend",
    "Introduction to SQL vs NoSQL",
    "Microservices Architecture explained",
    "Cybersecurity tips for developers",
    "How to use AWS EC2 for beginners",
    "CI/CD Pipelines with GitHub Actions",
];

const backupContent = {
    content:
        "System Note: The AI model generated a title but failed to provide the body content. This placeholder ensures the layout remains intact. The database and backend services are fully operational.",
};

async function generateArticleContent() {
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];

    const prompt = `Write a technical blog post about "${randomTopic}".
  Rules:
  1. The first line MUST be the Title.
  2. The following lines MUST be the Content (at least 3 paragraphs).
  3. Do not use [OUT], [OUTPUT] or similar prefixes.
  4. Use standard English.`;

    for (const modelName of MODELS_TO_TRY) {
        try {
            console.log(`🔄 Trying model: ${modelName}...`);

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
                    timeout: 20000, // Süreyi biraz artırdık (20sn)
                }
            );

            let generatedText = response.data.choices[0].message.content.trim();

            // Temizlik
            generatedText = generatedText.replace(/^\[.*?\]/g, "").trim();
            const lines = generatedText.split("\n");
            const cleanLines = lines.filter((line) => line.trim() !== "");

            // Başlık Belirleme
            let title = cleanLines.length > 0 ? cleanLines[0] : randomTopic;
            title = title.replace(/[#*]/g, "").trim();

            // İçerik Belirleme
            let content = cleanLines.slice(1).join("\n").trim();

            // --- YENİ EKLENEN KORUMA ---
            // Eğer içerik boş geldiyse veya çok kısaysa (AI sadece başlık ürettiyse)
            if (!content || content.length < 50) {
                console.warn(
                    `⚠️ Model (${modelName}) returned empty body. Using backup content.`
                );
                // Eğer AI koca bir paragrafı tek satırda verdiyse (başlık sanıldıysa)
                if (title.length > 100) {
                    content = title; // O zaman başlık sandığımız şey aslında içeriktir.
                    title = randomTopic; // Başlığı biz uyduralım.
                } else {
                    // Gerçekten boşsa yedek metni koy
                    content = backupContent.content;
                }
            }
            // ---------------------------

            console.log(`✅ Success with model: ${modelName}`);
            return { title, content };
        } catch (error) {
            console.warn(`❌ Model failed: ${modelName}. Moving to next...`);
        }
    }

    console.error("⚠️ All models failed.");
    return { title: randomTopic, content: backupContent.content };
}

module.exports = { generateArticleContent };
