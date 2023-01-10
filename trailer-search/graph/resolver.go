package graph

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.
import (
	"cinematic_v2/trailer-search/graph/model"
	"context"
	"fmt"
	"log"
	"os"
	"strings"

	mapset "github.com/deckarep/golang-set/v2"
	"github.com/joho/godotenv"
	"google.golang.org/api/option"
	"google.golang.org/api/youtube/v3"
)

const MaxResults = 25

type Resolver struct{}

func (r *Resolver) getMovieTrailers(title string) (*model.MovieTrailers, error) {
	ctx := context.Background()

	service, err := youtube.NewService(ctx, option.WithAPIKey(getKey()))
	if err != nil {
		return nil, err
	}

	q := title + " Official Trailer"
	call := service.Search.List([]string{"snippet"}).Type("video").Q(q).MaxResults(MaxResults)

	response, err := call.Do()
	// TODO: Implement a proper defer, panic, recover
	if err != nil {
		return nil, err
	}

	// filter trailer response videos common on youtube
	filters := []string{"Honest Trailers", "Trailer Breakdown"}

	trailersSet := mapset.NewSet[string]()
	for _, item := range response.Items {
		title := item.Snippet.Title
		// match title
		if strings.Contains(title, title) && strings.Contains(title, "Trailer") {

			// apply filters
			for _, filter := range filters {
				if !strings.Contains(title, filter) && !trailersSet.Contains(item.Id.VideoId) {
					trailersSet.Add(item.Id.VideoId)
				}
			}
		}
	}
	var trailers []string
	for trailer := range trailersSet.Iterator().C {
		trailers = append(trailers, trailer)
	}
	printIDs("videos", trailers)

	return &model.MovieTrailers{Title: title, Trailers: trailers}, nil
}

func getKey() string {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error: could not load .env file")
	}
	return os.Getenv("YOUTUBE_DATA_API_KEY")

}
func printIDs(sectionName string, matches []string) {
	fmt.Printf("%v:\n", sectionName)
	for _, title := range matches {
		fmt.Printf("%v\n", title)
	}
	fmt.Printf("\n\n")
}
