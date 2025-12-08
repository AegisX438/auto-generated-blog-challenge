import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function Home() {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        // Backend'den yazıları çek
        api.get("/articles")
            .then((response) => {
                setArticles(response.data);
            })
            .catch((error) => console.error("Veri çekme hatası:", error));
    }, []);

    return (
        <div>
            <h1>📢 Blog Yazıları</h1>
            {articles.length === 0 ? (
                <p>Henüz hiç yazı yok...</p>
            ) : (
                articles.map((article) => (
                    <div key={article.id} className="card">
                        <h2>{article.title}</h2>
                        <p>{article.content.substring(0, 100)}...</p>{" "}
                        {/* İlk 100 karakter */}
                        <Link to={`/article/${article.id}`}>
                            Devamını Oku →
                        </Link>
                    </div>
                ))
            )}
        </div>
    );
}

export default Home;
