import { useState } from "react";
import axios from "axios";
import { Activity, BarChart3, ExternalLink, Search } from "lucide-react";
import Stats from "./Stats";

const API = "http://localhost:8000";
const CATEGORIES = ["", "thoi-su", "kinh-doanh", "the-thao", "giai-tri", "giao-duc"];
const PAGE_SIZE = 10;

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [view, setView] = useState("search");

  const search = async (e, newPage = 1) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await axios.get(`${API}/search`, {
        params: {
          q: query,
          category: category || undefined,
          page: newPage,
          size: PAGE_SIZE
        },
        timeout: 3000
      });
      setResults(res.data.results || []);
      setTotal(res.data.total || 0);
      setPage(newPage);
    } catch (err) {
      setError("Không thể kết nối API. Đảm bảo FastAPI đang chạy ở port 8000.");
    }

    setLoading(false);
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="app-shell">
      <section className="topbar">
        <div>
          <p className="eyebrow">Kappa Architecture</p>
          <h1>VnTextSearch</h1>
          <p className="subtitle">Tìm kiếm và theo dõi kho văn bản tiếng Việt</p>
        </div>

        <div className="nav-actions">
          <button className={view === "search" ? "nav-button active" : "nav-button"} onClick={() => setView("search")}>
            <Search size={18} />
            Search
          </button>
          <button className={view === "stats" ? "nav-button active" : "nav-button"} onClick={() => setView("stats")}>
            <Activity size={18} />
            Stats
          </button>
          <a className="grafana-link" href="http://localhost:3001" target="_blank" rel="noreferrer">
            <BarChart3 size={18} />
            Grafana
          </a>
        </div>
      </section>

      {view === "stats" ? (
        <Stats />
      ) : (
        <>
          <section className="search-panel">
            <form className="search-form" onSubmit={search}>
              <label className="search-box">
                <Search size={22} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Nhập từ khóa tìm kiếm..."
                />
              </label>

              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c || "all"} value={c}>
                    {c || "Tất cả chuyên mục"}
                  </option>
                ))}
              </select>

              <button className="primary-button" type="submit" disabled={loading}>
                {loading ? "Đang tìm..." : "Tìm kiếm"}
              </button>
            </form>
          </section>

          <section className="results-layout">
            <div className="results-header">
              <div>
                <h2>Kết quả tìm kiếm</h2>
                <p>{total > 0 ? `Tìm thấy ${total.toLocaleString("vi-VN")} kết quả` : "Index: vn-documents"}</p>
              </div>
              <span className="page-indicator">Trang {page} / {totalPages}</span>
            </div>

            {error && <div className="state-message error">{error}</div>}

            {!error && results.length === 0 && (
              <div className="state-message">
                Nhập từ khóa để tìm trong FastAPI port 8000 và Elasticsearch index vn-documents.
              </div>
            )}

            <div className="result-list">
              {results.map((r) => (
                <article className="result-card" key={r.id}>
                  <div className="result-meta">
                    <span>{r.category}</span>
                    {r.topic_label && <span>{r.topic_label}</span>}
                  </div>

                  <a className="result-title" href={r.url} target="_blank" rel="noreferrer">
                    {r.highlight?.title ? (
                      <span dangerouslySetInnerHTML={{ __html: r.highlight.title[0] }} />
                    ) : (
                      r.title
                    )}
                    <ExternalLink size={15} />
                  </a>

                  {r.highlight?.content ? (
                    <p dangerouslySetInnerHTML={{ __html: r.highlight.content[0] }} />
                  ) : (
                    <p>{r.content}</p>
                  )}
                </article>
              ))}
            </div>

            {total > PAGE_SIZE && (
              <div className="pagination">
                <button onClick={() => search(null, page - 1)} disabled={page === 1 || loading}>
                  Trước
                </button>
                <span>Trang {page} / {totalPages}</span>
                <button onClick={() => search(null, page + 1)} disabled={page >= totalPages || loading}>
                  Sau
                </button>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}

export default App;
