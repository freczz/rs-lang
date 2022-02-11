import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import MainPageComponent from './components/main-page/main-page.component';
import AudiocallGameComponent from './components/audiocall-game/audiocall-game.component';

const routes: Routes = [
{ path: '', component: MainPageComponent },
// { path: '**', redirectTo: '/' },
{ path: 'audiocall', component: AudiocallGameComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export default class AppRoutingModule {}
