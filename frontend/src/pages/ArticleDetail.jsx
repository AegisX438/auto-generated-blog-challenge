import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";

function ArticleDetail() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);

    useEffect(() => {
        api.get(`/articles/${id}`)
            .then((response) => setArticle(response.data))
            .catch((error) => console.error("Error:", error));
    }, [id]);

    if (!article) return <p className="loading">Loading...</p>;

    return (
        <div className="container">
            <Link to="/" className="back-btn">
                ← Back to Home
            </Link>
            <div className="detail-card">
                <h1>{article.title}</h1>
                <small className="date">
                    Published on:{" "}
                    {new Date(article.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </small>
                <hr />
                <p className="content">{article.content}</p>
            </div>
        </div>
    );
}

export default ArticleDetail;
