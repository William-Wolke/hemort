# Build stage
FROM golang:1.23-alpine AS builder

WORKDIR /app
COPY . .
RUN go build -o hemort .

# Run stage
FROM alpine:latest

WORKDIR /app
COPY --from=builder /app/hemort .
COPY static ./static

EXPOSE 3000

CMD ["./hemort"]

