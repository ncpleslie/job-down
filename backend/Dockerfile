FROM golang:1.22.0 as builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -a -installsuffix cgo -o main .
RUN chmod +x main

FROM chromedp/headless-shell:latest as headless
RUN apt-get update
# RUN apt-get install -y dumb-init
RUN apt-get install -y ca-certificates

WORKDIR /app
COPY --from=builder /app/main .
COPY --from=builder /app/config.yaml .
COPY --from=builder /app/.env .

# ENTRYPOINT ["dumb-init" , "--"]
ENTRYPOINT ["sh", "-c", "./main" ]