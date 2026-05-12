# VN Text Search

Hệ thống tìm kiếm văn bản tiếng Việt — Kappa Architecture

## Khởi động nhanh

```bash
git clone <repo-url>
cd vn-text-search
cp .env.example .env
docker compose up -d
python services/crawler/load_dataset.py   # load data
python services/api/main.py               # start API
cd services/frontend && npm run dev       # start UI
```

## URLs

```text
Search UI:  http://localhost:5173
API docs:   http://localhost:8000/docs
Spark UI:   http://localhost:8080
MinIO:      http://localhost:9001
Prometheus: http://localhost:9090
Grafana:    http://localhost:3001
```

## Member 5

```text
services/frontend
```

Chạy frontend:

```bash
cd services/frontend
npm install
npm run dev
```

Build Docker image:

```bash
cd services/frontend
docker build -t vn-search-frontend .
docker run -p 3000:80 vn-search-frontend
```
