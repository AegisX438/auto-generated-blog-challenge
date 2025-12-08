import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function Home() {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        api.get("/articles")
            .then((response) => {
                setArticles(response.data);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    return (
        <div className="container">
            <header className="hero">
                <h1>🚀 Tech Blog Daily</h1>
                <p>
                    Auto-generated insights on Docker, AWS & Full-Stack
                    Development.
                </p>
            </header>

            <div className="grid">
                {articles.length === 0 ? (
                    <p className="loading">Loading articles...</p>
                ) : (
                    articles.map((article) => (
                        <div key={article.id} className="card">
                            <h2>{article.title}</h2>
                            <p>{article.content.substring(0, 120)}...</p>
                            <div className="card-footer">
                                <span className="date">
                                    {new Date(
                                        article.createdAt
                                    ).toLocaleDateString("en-US")}
                                </span>
                                <Link
                                    to={`/article/${article.id}`}
                                    className="read-more">
                                    Read More →
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Home;
