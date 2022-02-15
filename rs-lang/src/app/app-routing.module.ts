import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import SprintGameComponent from './components/sprint-game/sprint-game.component';
import MainPageComponent from './components/main-page/main-page.component';
import AudiocallGameComponent from './components/audiocall-game/audiocall-game.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'sprint', component: SprintGameComponent },
  { path: 'audiocall', component: AudiocallGameComponent },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export default class AppRoutingModule {}
