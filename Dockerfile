FROM node:20.18-alpine AS builder

ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache \
    git \
    gcc \
    musl-dev \
    make \
    openssl-dev \
    openjdk17
RUN npm install @openapitools/openapi-generator-cli -g

WORKDIR /valkey

RUN git clone https://github.com/valkey-io/valkey.git .
RUN git checkout tags/8.0.1
RUN make BUILD_TLS=yes

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY .env.example ./.env

COPY . .
RUN /valkey/src/valkey-server --port 6380 & sleep 5 && npm run build


FROM node:20.18-alpine AS runtime

ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public

RUN npm ci --production

EXPOSE 3000

CMD ["npm", "start"]
