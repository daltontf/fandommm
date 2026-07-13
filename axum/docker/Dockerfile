# Use an official Python runtime as a parent image
FROM debian:bookworm-slim AS builder

RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    cmake \
    pkg-config \
    sqlite3 \
    libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

RUN curl https://sh.rustup.rs -sSf | sh -s -- -y 

WORKDIR /build

COPY ./rust_calc/src/ ./rust_calc/src/
COPY ./rust_calc/*.toml ./rust_calc/
COPY ./rust_calc/*.geojson ./rust_calc/
COPY ./rust_calc/*.csv ./rust_calc/
COPY ./axum/src/ ./axum/src/
COPY ./axum/*.toml ./axum/

# Install the current package in editable mode and build the Rust extension in release mode
WORKDIR /build/axum 

RUN bash -c "source $HOME/.cargo/env && cargo build --release"

FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y libsqlite3-dev 

WORKDIR /app

COPY --from=builder /build/axum/target/release/fandommm_axum .

COPY ./react_interactive/web/dist/ ./dist/

EXPOSE 3000

RUN chmod +x ./fandommm_axum   

ENTRYPOINT ["/app/fandommm_axum", "/app/dist"]