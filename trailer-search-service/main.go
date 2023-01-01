package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
	"google.golang.org/api/option"
	"google.golang.org/api/youtube/v3"
)

const MaxResults = 25

func getKey() string {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error: could not load .env file")
	}
	return os.Getenv("YOUTUBE_DATA_API_KEY")

}

func main() {
	ctx := context.Background()

	service, err := youtube.NewService(ctx, option.WithAPIKey(getKey()))
	if err != nil {
		log.Fatal("Error creating new YouTube client: %v", err)
	}

	title := "Inception"
	part := []string{"snippet"}
	q := strings.Join([]string{title, "Official Trailer"}, " ")
	call := service.Search.List(part).Type("video").Q(q).MaxResults(MaxResults)

	response, err := call.Do()
	// TODO: Implement a proper defer, panic, recover
	if err != nil {
		handleError(err, "error response")
	}
	videos := make(map[int]string)

	// Iterate through each item and add it to the correct list.
	for i, item := range response.Items {
		if strings.Contains(item.Snippet.Title, title) && strings.Contains(item.Snippet.Title, "Official Trailer") {
			videos[i] = item.Id.VideoId
		}
	}
	printIDs("videos", videos)
}

func handleError(err error, s string) {
	panic(s)
}

func printIDs(sectionName string, matches map[int]string) {
	fmt.Printf("%v:\n", sectionName)
	for id, title := range matches {
		fmt.Printf("[%v] %v\n", id, title)
	}
	fmt.Printf("\n\n")
}
