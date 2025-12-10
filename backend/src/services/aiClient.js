const axios = require("axios");
require("dotenv").config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

// DAHA GÜÇLÜ VE YENİ MODELLER (Sıralama Önemli)
const MODELS_TO_TRY = [
    "google/gemini-2.0-flash-exp:free", // Google'ın en yeni, çok hızlı ve zeki modeli
    "meta-llama/llama-3.2-11b-vision-instruct:free", // Llama'nın yeni versiyonu
    "microsoft/phi-3-medium-128k-instruct:free", // Microsoft'un güçlü modeli
    "huggingfaceh4/zephyr-7b-beta:free", // Çok konuşkan bir model
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
        "System Note: Content generation is temporarily unavailable. The database and backend services are fully operational.",
};

async function generateArticleContent() {
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];

    // Prompt'u daha net ve zorlayıcı yaptık
    const prompt = `Write a technical blog post about "${randomTopic}".
  STRICT FORMAT RULES:
  1. First line must be the Title.
  2. Write at least 2 paragraphs of content after the title.
  3. Do not use prefixes like [Title] or [Content].
  4. Write in standard English.`;

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
                    timeout: 25000, // Süreyi artırdık
                }
            );

            let generatedText = response.data.choices[0].message.content.trim();

            // Temizlik (Regex)
            generatedText = generatedText
                .replace(/^\[.*?\]/g, "")
                .replace(/<[^>]*>/g, "")
                .trim();

            const lines = generatedText.split("\n");
            // Boş satırları temizle
            const cleanLines = lines.filter((line) => line.trim() !== "");

            // --- AKILLI AYRIŞTIRICI ---

            let title = randomTopic;
            let content = "";

            if (cleanLines.length === 0) {
                throw new Error("Empty response from AI");
            }

            if (cleanLines.length === 1) {
                // Eğer AI sadece tek bir paragraf verdiyse
                // Başlığı konu ismi yap, gelen metni içerik yap
                title = randomTopic;
                content = cleanLines[0];
            } else {
                // Eğer birden fazla satır varsa (Normal durum)
                title = cleanLines[0].replace(/[#*]/g, "").trim();
                content = cleanLines.slice(1).join("\n").trim();
            }

            // Eğer içerik hala boşsa ama başlık çok uzunsa, başlığı içerik yap
            if (!content && title.length > 100) {
                content = title;
                title = randomTopic;
            }

            // Son güvenlik kontrolü
            if (!content || content.length < 50) {
                console.warn(
                    `⚠️ Model (${modelName}) returned insufficient content. Trying next...`
                );
                continue; // Diğer modele geç
            }

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
