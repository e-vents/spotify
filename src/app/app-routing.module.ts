import {RouterModule, Routes} from '@angular/router';
import {SearchComponent} from './search/search.component';
import {ArtistComponent} from './artist/artist.component';
import {TrackComponent} from './track/track.component';
import {AlbumComponent} from './album/album.component';
import {NgModule} from '@angular/core';

const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: 'search', component: SearchComponent },
  { path: 'artists/:id', component: ArtistComponent },
  { path: 'tracks/:id', component: TrackComponent },
  { path: 'albums/:id', component: AlbumComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
