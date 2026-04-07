import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: 'home', component: HomepageComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'squad', component: SquadComponent },
  { path: 'stats', component: StatsComponent },
  { path: 'seasons', component: SeasonsComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AdminGuard] },
  { path: 'admin/players', component: PlayerFormComponent, canActivate: [AdminGuard] },
  { path: 'admin/matches', component: MatchFormComponent, canActivate: [AdminGuard] },
  { path: 'admin/seasons', component: SeasonFormComponent, canActivate: [AdminGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
