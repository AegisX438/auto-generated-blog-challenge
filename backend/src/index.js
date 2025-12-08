const express = require("express");
const cors = require("cors");
const { Article, initDb } = require("./models/Article");
const { generateArticleContent } = require("./services/aiClient");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Frontend'in (React) Backend'e erişmesine izin verir
app.use(express.json()); // JSON verilerini okuyabilmemizi sağlar

// Başlangıçta veritabanını başlat
initDb();

// --- ROTALAR (ENDPOINTS) ---

// 1. Tüm yazıları getir
app.get("/articles", async (req, res) => {
    try {
        // En yeniden eskiye doğru sırala
        const articles = await Article.findAll({
            order: [["createdAt", "DESC"]],
        });
        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: "Yazılar çekilemedi." });
    }
});

// 2. Tek bir yazıyı getir
app.get("/articles/:id", async (req, res) => {
    try {
        const article = await Article.findByPk(req.params.id);
        if (!article)
            return res.status(404).json({ error: "Yazı bulunamadı." });
        res.json(article);
    } catch (error) {
        res.status(500).json({ error: "Yazı detayı çekilemedi." });
    }
});

// 3. Test için Manuel Yazı Ekleme (Bunu normalde AI yapacak ama test için lazım)
app.post("/articles", async (req, res) => {
    try {
        const { title, content } = req.body;
        const newArticle = await Article.create({ title, content });
        res.status(201).json(newArticle);
    } catch (error) {
        res.status(500).json({ error: "Yazı oluşturulamadı." });
    }
});

// 4. AI ile Yazı Üret (Manuel Tetikleme)
app.post("/articles/generate", async (req, res) => {
    try {
        // 1. AI'dan içerik al
        const { title, content } = await generateArticleContent();

        // 2. Veritabanına kaydet
        const newArticle = await Article.create({ title, content });

        res.status(201).json(newArticle);
    } catch (error) {
        res.status(500).json({
            error: "AI yazı üretemedi.",
            details: error.message,
        });
    }
});

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`Backend sunucusu çalışıyor: http://localhost:${PORT}`);
});
