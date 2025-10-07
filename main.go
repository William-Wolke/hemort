package main

import (
	"encoding/json"
	"github.com/joho/godotenv"
	"log"
	"net/http"
	"os"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	apiKey := os.Getenv("OPENWEATHER_API_KEY")
	if apiKey == "" {
		log.Fatal("OPENWEATHER_API_KEY not set")
	}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Path
		if path == "/" {
			http.ServeFile(w, r, "./static/index.html")
		} else {
			http.ServeFile(w, r, "./static"+path)
		}
	})

	log.Println("Server running on :3000")
	log.Fatal(http.ListenAndServe(":3000", nil))
}
