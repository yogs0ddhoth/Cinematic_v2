package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"google.golang.org/api/option"
	"google.golang.org/api/youtube/v3"
)

const MaxResults = 25

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error: could not load .env file")
	}
	youTubeDataAPIKey := os.Getenv("YOUTUBE_DATA_API_KEY")
	fmt.Println(youTubeDataAPIKey)

	ctx := context.Background()
	service, err := youtube.NewService(ctx, option.WithAPIKey(youTubeDataAPIKey))
	if err != nil {
		log.Fatal("Error creating new YouTube client: %v", err)
	}
	part := []string{"snippet"}
	call := service.Search.List(part).Type("video").Q("").MaxResults(MaxResults)

	response, err := call.Do()
	// TODO: Implement a proper defer, panic, recover
	if err != nil {
		handleError(err, "error response")
	}
	videos := make(map[string]string)

	// Iterate through each item and add it to the correct list.
	for _, item := range response.Items {
		videos[item.Id.VideoId] = item.Snippet.Title
	}
	printIDs("videos", videos)
}

func handleError(err error, s string) {
	panic(s)
}

func printIDs(sectionName string, matches map[string]string) {
	fmt.Printf("%v:\n", sectionName)
	for id, title := range matches {
		fmt.Printf("[%v] %v\n", id, title)
	}
	fmt.Printf("\n\n")
}
