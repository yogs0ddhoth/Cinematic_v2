import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Actor, Genre, Movie, Rating } from 'src/app/core/graph/generated';

@Component({
  selector: 'app-movie-display',
  templateUrl: './movie-display.component.html',
  styleUrls: ['./movie-display.component.css'],
})
export default class MovieDisplayComponent implements OnInit {
  modalRef?: BsModalRef;
  @Input() movie!: Movie;
  genres?: Genre[];
  actors?: Actor[];
  ratings?: Rating[];
  image?: string;
  trailers?: string[];

  constructor(private readonly modalService: BsModalService) {}

  ngOnInit(): void {
    const { genres, actors, ratings, trailers, image, ...movie } = this.movie;

    if (genres) this.genres = genres;
    if (actors) this.actors = actors;
    if (ratings) this.ratings = ratings;
    if (image) this.image = image;
    if (trailers?.trailers?.length) this.trailers = trailers.trailers;

    this.movie = movie;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
