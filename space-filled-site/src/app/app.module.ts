import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ResultsComponent } from './results/results.component';
import { SquadComponent } from './squad/squad.component';
import { StatsComponent } from './stats/stats.component';
import { SeasonsComponent } from './seasons/seasons.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { PlayerFormComponent } from './admin/player-form/player-form.component';
import { MatchFormComponent } from './admin/match-form/match-form.component';
import { SeasonFormComponent } from './admin/season-form/season-form.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomepageComponent,
    ResultsComponent,
    SquadComponent,
    StatsComponent,
    SeasonsComponent,
    AdminLoginComponent,
    AdminDashboardComponent,
    PlayerFormComponent,
    MatchFormComponent,
    SeasonFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    FontAwesomeModule,
    HttpClientModule,
    NoopAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
