import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Movie } from 'src/app/core/graph/generated';
import MovieDisplayComponent from '../movie-display/movie-display.component';

@Component({
  selector: 'app-movie-display-card',
  templateUrl: './movie-display-card.component.html',
  styleUrls: ['./movie-display-card.component.css']
})
export class MovieDisplayCardComponent {
  @Input() movie!: Movie;

  constructor(private readonly dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(MovieDisplayComponent, {
      data: {
        ...this.movie,
      },
    })
  }
}
