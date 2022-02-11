import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import environment from 'src/environments/environment';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import AppRoutingModule from './app-routing.module';
import AppComponent from './app.component';
import MainPageComponent from './components/main-page/main-page.component';
import HeaderComponent from './components/header/header.component';
import FooterComponent from './components/footer/footer.component';
import AudiocallGameComponent from './components/audiocall-game/audiocall-game.component';

import { RSLState } from './store/rsl.state';

const appRoutes: Routes = [
  { path: '', component: MainPageComponent },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  declarations: [AppComponent, MainPageComponent, HeaderComponent, FooterComponent, AudiocallGameComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    NgxsModule.forRoot([RSLState], {
      developmentMode: !environment.production,
    }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export default class AppModule {}
