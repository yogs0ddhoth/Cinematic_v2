import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Movie } from 'src/app/core/graph/generated';

@Component({
  selector: 'app-movie-display',
  templateUrl: './movie-display.component.html',
  styleUrls: ['./movie-display.component.css'],
})
export default class MovieDisplayComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Movie) {}

  ngOnInit(): void { }
}
