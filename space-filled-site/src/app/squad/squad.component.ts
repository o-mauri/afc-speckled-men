import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { faFutbol, faUser, faA } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-squad',
  templateUrl: './squad.component.html',
  styleUrls: ['./squad.component.scss'],
})
export class SquadComponent implements OnInit {
  incFriendlies = false;
  players: any[] = [];
  playerStats: any[] = [];
  loading = true;

  userIcon = faUser;
  footyIcon = faFutbol;
  aIcon = faA;

  activeSeason: any = null;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getSeasons().subscribe({
      next: (seasons) => {
        this.activeSeason = seasons.find((s: any) => s.isActive);
        this.loadData();
      },
      error: () => (this.loading = false),
    });
  }

  loadData(): void {
    this.api.getPlayers().subscribe({
      next: (players) => {
        this.players = players;
        const seasonId = this.activeSeason?.id;
        this.api.getStats(seasonId).subscribe({
          next: (stats) => {
            this.playerStats = stats.playerStats.filter((p: any) => p.matches > 0);
            this.playerStats.sort((a: any, b: any) => b.matches - a.matches);
            // Attach imageUrl from players
            for (const ps of this.playerStats) {
              const pl = this.players.find((p: any) => p.id === ps.playerId);
              if (pl) ps.imageUrl = pl.imageUrl;
            }
            this.loading = false;
          },
          error: () => (this.loading = false),
        });
      },
    });
  }

  toggleFriendlies(): void {
    this.incFriendlies = !this.incFriendlies;
  }

  getMatches(p: any): number {
    return this.incFriendlies ? p.matches : p.matchesLeague;
  }

  getGoals(p: any): number {
    return this.incFriendlies ? p.goals : p.goalsLeague;
  }

  getAssists(p: any): number {
    return this.incFriendlies ? p.assists : p.assistsLeague;
  }

  getWins(p: any): number {
    return this.incFriendlies ? p.wins : p.winsLeague;
  }

  getWinP(p: any): number {
    const m = this.getMatches(p);
    return m > 0 ? Math.round((this.getWins(p) / m) * 100) : 0;
  }

  getGPG(p: any): string {
    const m = this.getMatches(p);
    return m > 0 ? (this.getGoals(p) / m).toFixed(2) : '0';
  }

  getAPG(p: any): string {
    const m = this.getMatches(p);
    return m > 0 ? (this.getAssists(p) / m).toFixed(2) : '0';
  }
}
