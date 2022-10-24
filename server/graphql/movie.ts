import { objectType } from 'nexus';

export const Genre = objectType({
  name: 'Genre',
  definition(t) {
    t.nonNull.string('key');
    t.string('value');
  },
});
export const Movie = objectType({
  name: 'Movie',
  definition(t) {
    t.nonNull.id('id');
    t.string('contentRating');
    t.string('description');
    t.list.field('genreList', { type: Genre });
    t.string('genres');
    t.string('imDbId');
    t.float('imDbRating');
    t.int('imDbRatingVotes');
    t.string('image');
    t.int('metacriticRating');
    t.string('plot');
    t.string('runtimeStr');
    t.list.field('starList', { type: Star });
    t.string('stars');
    t.nonNull.string('title');
  },
});
export const Star = objectType({
  name: 'Star',
  definition(t) {
    t.nonNull.string('id');
    t.string('name');
  },
});
