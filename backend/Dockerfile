FROM golang:1.22.0 as builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=1 GOOS=linux go build -ldflags="-s -w" -a -installsuffix cgo -o main .
RUN chmod +x main

FROM golang:1.22.0

WORKDIR /app
COPY --from=builder /app/main .
COPY --from=builder /app/config.yaml .

EXPOSE 8080

CMD ["./main"]