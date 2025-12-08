const axios = require("axios");
require("dotenv").config();

const HF_API_KEY = process.env.HF_API_KEY;
// Daha stabil, çok kullanılan bir model: Microsoft Phi-3
const MODEL_URL =
    "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct";

const topics = [
    "Docker Containers vs Virtual Machines",
    "The Future of React.js",
    "Why Node.js is great for backend",
    "Introduction to SQL vs NoSQL",
    "Microservices Architecture explained",
    "Cybersecurity tips for developers",
    "How to use AWS EC2 for beginners",
];

// API çalışmazsa kullanılacak yedek içerikler
const backupContent = {
    title: "Yapay Zeka Geçici Olarak Meşgul",
    content:
        "Şu anda ücretsiz AI servisine erişilemiyor. Ancak sistem hata vermedi ve bu yedek içeriği oluşturdu. Bu bir 'Fail-Over' mekanizmasıdır. Deployment ve Pipeline başarıyla çalışıyor!\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit.",
};

async function generateArticleContent() {
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];

    // Basit bir prompt
    const prompt = `<|user|>Write a technical blog post about "${randomTopic}". Keep it short.<|end|><|assistant|>`;

    try {
        console.log(`AI göreve başladı... Konu: ${randomTopic}`);

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

        // Yanıtı işle
        let generatedText = "";

        // Model yanıt yapısı bazen değişebilir, kontrol ediyoruz
        if (Array.isArray(response.data)) {
            generatedText = response.data[0].generated_text;
        } else if (response.data.generated_text) {
            generatedText = response.data.generated_text;
        } else {
            throw new Error("Beklenmedik yanıt formatı");
        }

        return {
            title: randomTopic,
            content: generatedText || "İçerik oluşturuldu ancak boş döndü.",
        };
    } catch (error) {
        // HATA OLSA BİLE DURMA! Yedek planı devreye sok.
        console.error(
            "⚠️ AI API Hatası (Önemli değil, yedek devreye giriyor):",
            error.message
        );

        return {
            title: `${randomTopic} (Backup)`,
            content: `API Hatası alındı: ${
                error.response?.statusText || error.message
            }.\n\nBu içerik sistem akışının bozulmaması için otomatik oluşturulmuştur. Blog altyapısı sorunsuz çalışmaktadır.`,
        };
    }
}

module.exports = { generateArticleContent };
