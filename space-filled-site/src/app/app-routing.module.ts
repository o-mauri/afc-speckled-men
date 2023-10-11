import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { ResultsComponent } from './results/results.component';
import { SquadComponent } from './squad/squad.component';
import { StatsComponent } from './stats/stats.component';
import { SeasonsComponent } from './seasons/seasons.component';
import { PlayersComponent } from './players/players.component';

const routes: Routes = [
  {path: "home", component: HomepageComponent},
  {path: "results", component: ResultsComponent},
  {path: "squad", component: SquadComponent},
  {path: "stats", component: StatsComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
