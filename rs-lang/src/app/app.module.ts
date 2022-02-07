import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import AppRoutingModule from './app-routing.module';
import AppComponent from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

const appRoutes: AppRoutingModule =[
    { path: '', component: MainPageComponent},
];

import { RSLState } from './store/rsl.state';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import environment from 'src/environments/environment';

@NgModule({
<<<<<<< HEAD
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule,
    NgxsModule.forRoot([RSLState], {
      developmentMode: !environment.production,
    }),
    NgxsReduxDevtoolsPluginModule.forRoot(),],
=======
  declarations: [AppComponent, MainPageComponent, HeaderComponent, FooterComponent],
  imports: [BrowserModule, AppRoutingModule],
>>>>>>> fbcd45a (feat: add main page)
  providers: [],
  bootstrap: [AppComponent],
})
export default class AppModule {}
