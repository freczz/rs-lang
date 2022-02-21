import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import MainPageComponent from './components/main-page/main-page.component';
import AuthPageComponent from './components/auth-page/auth-page.component';
import SprintGameComponent from './components/sprint-game/sprint-game.component';
import AudiocallGameComponent from './components/audiocall-game/audiocall-game.component';
import StatisticPageComponent from './components/statistic-page/statistic-page.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'authorization', component: AuthPageComponent },
  { path: 'sprint', component: SprintGameComponent },
  { path: 'audiocall', component: AudiocallGameComponent },
  { path: 'statistic', component: StatisticPageComponent },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export default class AppRoutingModule {}
