import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import environment from 'src/environments/environment';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';

import RSLState from './store/rsl.state';
import AppRoutingModule from './app-routing.module';
import AppComponent from './app.component';
import MainPageComponent from './components/main-page/main-page.component';
import HeaderComponent from './components/header/header.component';
import FooterComponent from './components/footer/footer.component';
import SprintGameComponent from './components/sprint-game/sprint-game.component';
import ButtonComponent from './components/sprint-game/button/button.component';
import RoundComponent from './components/sprint-game/round/round.component';
import StartComponent from './components/sprint-game/start/start.component';
import LoadingComponent from './components/sprint-game/loading/loading.component';
import ResultSprintComponent from './components/sprint-game/result-sprint/result-sprint.component';
import { AudiocallGameComponent } from './components/audiocall-game/audiocall-game.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    HeaderComponent,
    FooterComponent,
    SprintGameComponent,
    ButtonComponent,
    RoundComponent,
    StartComponent,
    LoadingComponent,
    ResultSprintComponent,
    AudiocallGameComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxsModule.forRoot([RSLState], {
      developmentMode: !environment.production,
    }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export default class AppModule {}
