# Build stage
FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY . .
RUN go build -o hemort .

# Run stage
FROM alpine:latest

WORKDIR /app
COPY --from=builder /app/hemort .
COPY static ./static

EXPOSE 8080

CMD ["./hemort"]

