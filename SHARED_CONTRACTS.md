# SHARED CONTRACTS

Tat ca thanh vien phai tuan theo contract nay. Khong tu y doi ten field, port, topic, index, bucket.

## Kafka Topics

| Topic | Producer | Consumer | Message format |
| --- | --- | --- | --- |
| `raw-documents` | Member 4 crawler | Member 2 Spark | raw document JSON |
| `processed-documents` | Member 2 Spark | Member 4 API | processed document JSON |

### raw-documents message schema

```json
{
  "id": "vnexpress_1234567",
  "title": "Tieu de bai bao",
  "content": "Noi dung bai bao...",
  "url": "https://vnexpress.net/...",
  "category": "thoi-su",
  "source": "vnexpress",
  "published_at": "2024-01-15T08:00:00Z",
  "crawled_at": "2024-01-15T08:05:00Z"
}
```

### processed-documents message schema

```json
{
  "id": "vnexpress_1234567",
  "title": "Tieu de bai bao",
  "content": "Noi dung bai bao...",
  "tokens": ["tieu_de", "bai_bao"],
  "token_count": 120,
  "category": "thoi-su",
  "topic_label": "chinh-tri",
  "url": "https://vnexpress.net/...",
  "published_at": "2024-01-15T08:00:00Z",
  "indexed_at": "2024-01-15T08:06:00Z"
}
```

## Elasticsearch

Index name: `vn-documents`

```json
{
  "mappings": {
    "properties": {
      "id": { "type": "keyword" },
      "title": { "type": "text", "analyzer": "standard" },
      "content": { "type": "text", "analyzer": "standard" },
      "tokens": { "type": "keyword" },
      "token_count": { "type": "integer" },
      "category": { "type": "keyword" },
      "topic_label": { "type": "keyword" },
      "url": { "type": "keyword" },
      "published_at": { "type": "date" },
      "indexed_at": { "type": "date" }
    }
  }
}
```

## MinIO Buckets

| Bucket | Purpose | Owner |
| --- | --- | --- |
| `raw-data` | Raw parquet from crawler | Member 4 |
| `spark-checkpoints` | Spark Structured Streaming checkpoint | Member 2 |
| `spark-output` | Batch job output | Member 3 |

## Ports

| Service | Port |
| --- | --- |
| Kafka | `9092` |
| Elasticsearch | `9200` |
| MinIO API | `9000` |
| MinIO Console | `9001` |
| Spark Master | `7077` |
| Spark UI | `8080` |
| FastAPI | `8000` |
| Prometheus | `9090` |
| Grafana | `3001` |

## Python Dependencies

```text
pyspark==3.5.1
kafka-python==2.0.2
elasticsearch==8.13.0
boto3==1.34.0
```

## Git Workflow

- `main`: merge only after testing.
- `dev`: shared working branch.
- `feat/m2-spark-streaming`
- `feat/m3-ml-jobs`
- `feat/m4-crawler-api`
- `feat/m5-frontend`

Commit prefixes:

- `feat:`
- `fix:`
- `docs:`
