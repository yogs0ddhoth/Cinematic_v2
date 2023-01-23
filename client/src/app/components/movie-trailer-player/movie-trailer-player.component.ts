import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

let apiLoaded = false;

@Component({
  selector: 'app-movie-trailer-player',
  templateUrl: './movie-trailer-player.component.html',
  styleUrls: ['./movie-trailer-player.component.css']
})
export class MovieTrailerPlayerComponent implements OnInit {
  @Input() videoId!: string;

  @Input() width = 640;
  @Input() height = 360;

  ngOnInit() {
    if (!apiLoaded) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      apiLoaded = true;
    }
  }
}
