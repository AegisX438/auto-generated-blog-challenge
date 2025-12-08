const { Sequelize, DataTypes } = require("sequelize");

// SQLite veritabanı bağlantısı
// Bu komut, backend klasöründe 'blog.sqlite' adında bir dosya oluşturacak.
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./blog.sqlite",
    logging: false, // Konsolu kirletmemesi için SQL loglarını kapattık
});

// Article (Makale) Modeli
const Article = sequelize.define(
    "Article",
    {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        imageUrl: {
            // Opsiyonel: Görsel eklemek istersen
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        timestamps: true, // createdAt ve updatedAt otomatik oluşur
    }
);

// Veritabanını senkronize et (Tablo yoksa oluşturur)
const initDb = async () => {
    try {
        await sequelize.sync();
        console.log("Veritabanı senkronize edildi (SQLite).");
    } catch (error) {
        console.error("Veritabanı hatası:", error);
    }
};

module.exports = { Article, initDb };
