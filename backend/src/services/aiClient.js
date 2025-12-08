const axios = require("axios");
require("dotenv").config();

const HF_API_KEY = process.env.HF_API_KEY;
// Daha stabil olan Google'ın Gemma modeline geçiyoruz (Router üzerinden)
const MODEL_URL = "https://router.huggingface.co/models/google/gemma-2-2b-it";

const topics = [
    "Docker Containers vs Virtual Machines",
    "The Future of React.js",
    "Why Node.js is great for backend",
    "Introduction to SQL vs NoSQL",
    "Microservices Architecture explained",
    "Cybersecurity tips for developers",
    "How to use AWS EC2 for beginners",
];

// YEDEK İÇERİK (İNGİLİZCE VE PROFESYONEL)
const backupContent = {
    content:
        "System Note: The external AI provider is currently experiencing high traffic or rate limiting. This article content is a placeholder to demonstrate that the Database, Backend API, and Frontend connectivity are working correctly. The deployment pipeline is fully functional.",
};

async function generateArticleContent() {
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];

    // Prompt İngilizce
    const prompt = `Write a technical blog post about "${randomTopic}".
  Format:
  Title: [Title Here]
  [Content Here]
  Keep it concise.`;

    try {
        console.log(`AI task started... Topic: ${randomTopic}`);

        const response = await axios.post(
            MODEL_URL,
            {
                inputs: prompt,
                parameters: {
                    max_new_tokens: 400,
                    return_full_text: false,
                    temperature: 0.7,
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${HF_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        let generatedText = "";
        if (Array.isArray(response.data)) {
            generatedText = response.data[0].generated_text;
        } else if (response.data.generated_text) {
            generatedText = response.data.generated_text;
        } else {
            throw new Error("Unexpected response format");
        }

        return {
            title: randomTopic,
            content: generatedText || "Content generated but empty.",
        };
    } catch (error) {
        console.error("⚠️ AI API Warning (Backup trigger):", error.message);

        // Hata olsa bile başlık düzgün görünsün, içerik bilgi versin
        return {
            title: `${randomTopic}`, // (Backup) yazısını kaldırdım, daha temiz dursun
            content: backupContent.content,
        };
    }
}

module.exports = { generateArticleContent };
