import {Component, AfterViewInit, ViewChild, ElementRef, OnInit} from '@angular/core';
import {
  Router,
  ActivatedRoute,
} from '@angular/router';

import { SpotifyService } from '../spotify.service';
import { fromEvent } from 'rxjs';
import {
  filter,
  debounceTime,
  distinctUntilChanged, pluck
} from 'rxjs/operators'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, AfterViewInit {
  query: string;
  tracks: SpotifyApi.TrackObjectFull[];
  @ViewChild('newQuery') input: ElementRef;

  constructor(private spotify: SpotifyService,
              private router: Router,
              private route: ActivatedRoute) {
    this.route
      .queryParams
      .subscribe(params => { this.query = params['query'] || ''; });
  }

  ngOnInit() {
    this.search();
  }

  ngAfterViewInit() {
    fromEvent(this.input.nativeElement, 'keyup').pipe(
      pluck('target', 'value'),
      filter((text: string) => text.length > 1),
      debounceTime(700),
      distinctUntilChanged()
    ).subscribe(
      query => this.router
        .navigate(['search'], {queryParams: {query: query}})
        .then(_ => this.search())
    );
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
