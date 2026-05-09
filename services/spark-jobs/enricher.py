from __future__ import annotations

import argparse

from pyspark.sql import functions as F

from es_reader import DEFAULT_INDEX, get_spark, read_from_es


DEFAULT_OUTPUT_PATH = "s3a://spark-output/enriched-documents/"


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Enrich documents with per-category daily document counts."
    )
    parser.add_argument("--index", default=DEFAULT_INDEX, help="Elasticsearch index name")
    parser.add_argument(
        "--output",
        default=DEFAULT_OUTPUT_PATH,
        help="Output parquet path for enriched data",
    )
    args = parser.parse_args()

    spark = get_spark()

    # Enforce sort-merge join instead of broadcast join.
    spark.conf.set("spark.sql.autoBroadcastJoinThreshold", -1)

    df_docs = (
        read_from_es(spark, index=args.index)
        .select("id", "title", "category", "published_at")
        .withColumn("date", F.to_date("published_at"))
        .filter(F.col("category").isNotNull())
        .filter(F.col("date").isNotNull())
    )

    df_stats = (
        df_docs.groupBy("category", "date")
        .agg(F.count("id").alias("daily_count"))
        .hint("merge")
    )

    df_enriched = (
        df_docs.hint("merge")
        .join(df_stats, on=["category", "date"], how="left")
        .select("id", "title", "category", "date", "daily_count")
    )

    df_enriched.write.mode("overwrite").parquet(args.output)
    print(f"Saved enriched documents to: {args.output}")


if __name__ == "__main__":
    main()
