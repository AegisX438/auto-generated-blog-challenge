const express = require("express");
const cors = require("cors");
const { Article, initDb } = require("./models/Article");
const { generateArticleContent } = require("./services/aiClient");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); //For fronend reach to backend
app.use(express.json());

// First start db
initDb();

// --- ENDPOINTS ---

// 1. Bring all blogs
app.get("/articles", async (req, res) => {
    try {
        // List to newer to older
        const articles = await Article.findAll({
            order: [["createdAt", "DESC"]],
        });
        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: "Couldn't bring blogs." });
    }
});

// 2. Bring only one blog
app.get("/articles/:id", async (req, res) => {
    try {
        const article = await Article.findByPk(req.params.id);
        if (!article) return res.status(404).json({ error: "Blog not found." });
        res.json(article);
    } catch (error) {
        res.status(500).json({
            error: "There is an error while getting blog detail.",
        });
    }
});

// 3. Just for test
app.post("/articles", async (req, res) => {
    try {
        const { title, content } = req.body;
        const newArticle = await Article.create({ title, content });
        res.status(201).json(newArticle);
    } catch (error) {
        res.status(500).json({ error: "Could not create a blog" });
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
            error: "AI Couldn't create a blog post.",
            details: error.message,
        });
    }
});

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`Backend server running on: http://localhost:${PORT}`);
});
