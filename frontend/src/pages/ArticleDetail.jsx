import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";

function ArticleDetail() {
    const { id } = useParams(); // URL'den ID'yi al
    const [article, setArticle] = useState(null);

    useEffect(() => {
        api.get(`/articles/${id}`)
            .then((response) => setArticle(response.data))
            .catch((error) => console.error("Hata:", error));
    }, [id]);

    if (!article) return <p>Yükleniyor...</p>;

    return (
        <div>
            <Link to="/" className="back-btn">
                ← Geri Dön
            </Link>
            <div className="card">
                <h1>{article.title}</h1>
                <small>
                    Tarih: {new Date(article.createdAt).toLocaleDateString()}
                </small>
                <hr />
                <p className="content">{article.content}</p>
            </div>
        </div>
    );
}

export default ArticleDetail;
