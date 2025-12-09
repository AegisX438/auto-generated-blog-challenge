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
        "System Note: Content generation is temporarily unavailable. Database and API connectivity are functional.",
};

async function generateArticleContent() {
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];

    const prompt = `Write a technical blog post about "${randomTopic}".
  Rules:
  1. The first line MUST be the Title.
  2. The following lines MUST be the Content.
  3. Do not use [OUT], [OUTPUT] or similar prefixes.
  4. Keep it concise (approx 150 words).`;

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
                    timeout: 15000,
                }
            );

            let generatedText = response.data.choices[0].message.content.trim();

            // --- İŞTE SİHİRLİ TEMİZLİK KISMI ---

            // 1. [OUT], [OUTPUT], [Start] gibi etiketleri sil
            generatedText = generatedText.replace(/^\[.*?\]/g, "").trim();

            // 2. Satırlara böl
            const lines = generatedText.split("\n");

            // 3. Boş satırları temizle
            const cleanLines = lines.filter((line) => line.trim() !== "");

            // 4. Başlığı al ve temizle (# işaretlerini, ** işaretlerini sil)
            // cleanLines[0] başlık olması lazım, eğer yoksa randomTopic'i kullan
            let title = cleanLines.length > 0 ? cleanLines[0] : randomTopic;
            title = title.replace(/[#*]/g, "").trim();

            // 5. İçeriği al (İlk satır hariç gerisi)
            const content = cleanLines.slice(1).join("\n").trim();

            console.log(`✅ Success with model: ${modelName}`);

            return { title, content: content || generatedText };
        } catch (error) {
            console.warn(`❌ Model failed: ${modelName}. Moving to next...`);
        }
    }

    console.error("⚠️ All models failed.");
    return { title: randomTopic, content: backupContent.content };
}

module.exports = { generateArticleContent };
