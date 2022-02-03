import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import AppRoutingModule from './app-routing.module';
import AppComponent from './app.component';
import { AudioGameComponent } from './audio-game/audio-game.component';

@NgModule({
  declarations: [AppComponent, AudioGameComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export default class AppModule {}
