import { Component, OnInit } from '@angular/core';
import {
  Router,
  ActivatedRoute,
} from '@angular/router';

import { SpotifyService } from '../spotify.service';
import { fromEvent } from 'rxjs';
import {
  map,
  filter,
  debounceTime,
  distinctUntilChanged, switchAll, pluck, last
} from 'rxjs/operators'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  query: string;
  tracks: SpotifyApi.TrackObjectFull[];

  constructor(private spotify: SpotifyService,
              private router: Router,
              private route: ActivatedRoute) {
    this.route
      .queryParams
      .subscribe(params => { this.query = params['query'] || ''; });
  }

  ngOnInit(): void {
    this.search();
  }

  submit($event: KeyboardEvent, input: HTMLInputElement): void {
    fromEvent($event.target, 'keyup').pipe(
      pluck('target', 'value'),
      filter((text: string) => text.length > 1),
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe(query => console.log(query))
      /*
      this.router
      .navigate(['search'], { queryParams: { query: query } })
        .then(_ => this.search()));
       */
  }

  search(): void {
    console.log('this.query', this.query);
    if (!this.query) {
      return;
    }
    this.spotify
      .searchTrack(this.query)
      .subscribe((res: SpotifyApi.TrackSearchResponse) => this.renderResults(res));
  }

  renderResults(res: SpotifyApi.TrackSearchResponse): void {
    this.tracks = null;
    if (res && res.tracks && res.tracks.items) {
      this.tracks = res.tracks.items;
    }
  }
}
