"""Sample API: records a visit in Postgres and reports which build served it."""

import os

import psycopg
from fastapi import FastAPI

app = FastAPI()

ENV = os.environ.get("APP_ENV", "local")
VERSION = os.environ.get("VERSION_RELEASE", "local")


@app.get("/api/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/visits")
def visits() -> dict[str, str | int]:
    # The Supabase transaction pooler can't keep prepared statements.
    with psycopg.connect(os.environ["POSTGRES_DB_URL"], prepare_threshold=None) as conn:
        count = conn.execute(
            "insert into visits (env, version) values (%s, %s) returning "
            "(select count(*) + 1 from visits where env = %s)",
            (ENV, VERSION, ENV),
        ).fetchone()[0]
    return {"env": ENV, "version": VERSION, "visits": count}
