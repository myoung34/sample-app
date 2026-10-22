# The sample API, built like applications/grcapp: python slim, uv-exported
# requirements, a non-root user, release metadata last. The Supabase CLI and
# migrations ride along so the same image runs the pre-deploy migration Job.
FROM python:3.12.14-slim@sha256:7a8b475003c4fe15a2cd4e55e5cfc2f3560bdc9333d624f24cdd6d4340fd7a17

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV UV_LINK_MODE=copy

WORKDIR /app
ENV PYTHONPATH=/app/src

COPY --from=ghcr.io/astral-sh/uv:0.11.7 /uv /usr/local/bin/uv

# Same Supabase CLI as the monorepo's verify-schema job.
ARG SUPABASE_CLI_VERSION=2.75.0
ARG SUPABASE_CLI_SHA256=b551c2f8e03715be428d2592765200a9e371168fc36ec2646a84ecc530d3120e
ADD --checksum=sha256:${SUPABASE_CLI_SHA256} \
    https://github.com/supabase/cli/releases/download/v${SUPABASE_CLI_VERSION}/supabase_linux_arm64.tar.gz /tmp/supabase.tgz
RUN tar -xzf /tmp/supabase.tgz -C /usr/local/bin supabase && rm /tmp/supabase.tgz

COPY pyproject.toml uv.lock /app/
RUN --mount=type=cache,target=/root/.cache/uv \
    uv export --locked --no-dev --no-emit-project --format requirements.txt > /tmp/requirements.txt \
 && uv pip install --system -r /tmp/requirements.txt \
 && rm /tmp/requirements.txt

COPY supabase /app/supabase
COPY src /app/src
RUN python -c "import sample_api.main"

RUN useradd -m app && chown -R app:app /app
USER app

EXPOSE 8096

ARG VERSION_COMMIT=local
ARG VERSION_RELEASE=local
ENV VERSION_COMMIT=${VERSION_COMMIT}
ENV VERSION_RELEASE=${VERSION_RELEASE}

CMD ["uvicorn", "sample_api.main:app", "--host", "0.0.0.0", "--port", "8096"]
