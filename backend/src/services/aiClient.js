const axios = require("axios");
require("dotenv").config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

// YEDEK PLANI: Sırayla denenecek ücretsiz modeller listesi
// Biri çalışmazsa otomatik diğerine geçecek.
const MODELS_TO_TRY = [
    "meta-llama/llama-3-8b-instruct:free", // Plan A: Meta Llama 3 (Genelde en iyisi)
    "microsoft/phi-3-mini-128k-instruct:free", // Plan B: Microsoft Phi-3 (Çok hızlı)
    "mistralai/mistral-7b-instruct:free", // Plan C: Mistral (Güvenilir)
    "google/gemma-2-9b-it:free", // Plan D: Google Gemma (Bazen hata veriyor)
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
        "System Note: All free AI models are currently overloaded. Database and API connectivity are fully functional. This is a fallback message.",
};

async function generateArticleContent() {
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];

    const prompt = `Write a technical blog post about "${randomTopic}".
  Rules:
  1. The first line MUST be the Title.
  2. The following lines MUST be the Content.
  3. Keep it concise (approx 150 words).
  4. Use standard English.`;

    // --- DÖNGÜ BAŞLIYOR ---
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
                    timeout: 10000, // 10 saniye içinde cevap gelmezse diğer modele geç
                }
            );

            // Eğer buraya geldiyse hata yok demektir, cevabı işle
            const generatedText =
                response.data.choices[0].message.content.trim();

            const lines = generatedText.split("\n");
            const cleanLines = lines.filter((line) => line.trim() !== "");
            // HTML taglerini (<s>, </s> vb.) ve markdown işaretlerini temizle
            const title = cleanLines[0]
                .replace(/<[^>]*>/g, "")
                .replace(/^#+\s*/, "")
                .replace(/\*\*/g, "")
                .trim();
            const content = cleanLines.slice(1).join("\n").trim();

            console.log(`✅ Success with model: ${modelName}`);

            return {
                title: title || randomTopic,
                content: content || generatedText,
            };
        } catch (error) {
            // Hata detayını yazdır ama programı durdurma, döngü devam etsin
            console.warn(
                `❌ Model failed: ${modelName}. Error: ${
                    error.response?.data?.error?.message || error.message
                }`
            );
            // Bir sonraki modele geç...
        }
    }

    // --- DÖNGÜ BİTTİ VE HİÇBİRİ ÇALIŞMADIYSA ---
    console.error("⚠️ All models failed. Returning backup content.");
    return {
        title: `${randomTopic}`,
        content: backupContent.content,
    };
}

module.exports = { generateArticleContent };
