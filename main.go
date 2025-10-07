package main

import (
	"encoding/json"
	"github.com/joho/godotenv"
	"log"
	"net/http"
	"os"
	"sync"
	"time"
)

type WeatherResponse struct {
	Name string `json:"name"`
	Main struct {
		Temp float64 `json:"temp"`
	} `json:"main"`
	Weather []struct {
		Main string `json:"main"`
		Icon string `json:"icon"`
	} `json:"weather"`
}

type cacheEntry struct {
	data      WeatherResponse
	timestamp int64
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	apiKey := os.Getenv("OPENWEATHER_API_KEY")
	if apiKey == "" {
		log.Fatal("OPENWEATHER_API_KEY not set")
	}

	var (
		cache      = make(map[string]cacheEntry)
		cacheMutex = &sync.Mutex{}
	)

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Path
		if path == "/" {
			http.ServeFile(w, r, "./static/index.html")
		} else {
			http.ServeFile(w, r, "./static"+path)
		}
	})

	http.HandleFunc("/weather", func(w http.ResponseWriter, r *http.Request) {

		city := r.URL.Query().Get("city")
		if city == "" {
			city = "Stockholm"
		}

		cacheMutex.Lock()
		entry, found := cache[city]
		cacheMutex.Unlock()

		now := time.Now().Unix()
		if found && now-entry.timestamp < 600 {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(entry.data)
			return
		}
		url := "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=metric"
		resp, err := http.Get(url)
		if err != nil {
			http.Error(w, "Failed to fetch weather", http.StatusInternalServerError)
			return
		}
		defer resp.Body.Close()

		var data WeatherResponse
		if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
			http.Error(w, "Failed to decode response", http.StatusInternalServerError)
			return
		}

		cacheMutex.Lock()
		cache[city] = cacheEntry{data: data, timestamp: now}
		cacheMutex.Unlock()
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(data)
	})

	log.Println("Server running on :3000")
	log.Fatal(http.ListenAndServe(":3000", nil))
}
