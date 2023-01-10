package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.22

import (
	"cinematic_v2/trailer-search/graph/model"
	"context"
)

// FindMovieTrailersByTitle is the resolver for the findMovieTrailersByTitle field.
func (r *entityResolver) FindMovieTrailersByTitle(ctx context.Context, title string) (*model.MovieTrailers, error) {
	return r.getMovieTrailers(title)
}

// Entity returns EntityResolver implementation.
func (r *Resolver) Entity() EntityResolver { return &entityResolver{r} }

type entityResolver struct{ *Resolver }