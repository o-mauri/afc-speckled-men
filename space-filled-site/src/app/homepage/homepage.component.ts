import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  loading = true;
  hasData = false;

  lastMatch: any = null;
  lastMatchScorers: string[] = [];
  lastMatchAssisters: string[] = [];

  seasonStats = { matches: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, winPercentage: 0 };
  allTimeStats = { matches: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, winPercentage: 0 };
  allTimeStatsF = { matches: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, winPercentage: 0 };

  stats_includefriendlies = false;
  ts_includefriendlies = false;
  ta_includefriendlies = false;
  cs_includefriendlies = false;
  gapg_includefriendlies = false;

  topScorers_s: any[] = [];
  topScorers_at: any[] = [];
  topScorers_atF: any[] = [];
  topAssist_s: any[] = [];
  topAssist_at: any[] = [];
  topAssist_atF: any[] = [];

  gapg_s: any[] = [];
  gapg_at: any[] = [];
  gapg_atF: any[] = [];
  cs_s: any[] = [];
  cs_at: any[] = [];
  cs_atF: any[] = [];

  rG = 0; rG_s = 0; rG_f = 0;
  rA = 0; rA_s = 0; rA_f = 0;
  oG = 0; oG_s = 0; oG_f = 0;

  activeSeason: any = null;
  private players: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    // Load players and seasons in parallel, then proceed
    forkJoin({
      players: this.api.getPlayers(),
      seasons: this.api.getSeasons(),
    }).subscribe({
      next: ({ players, seasons }) => {
        this.players = players;
        this.activeSeason = seasons.find((s: any) => s.isActive);
        if (this.activeSeason) {
          this.loadSeasonData();
          this.loadAllTimeData();
        } else {
          this.loading = false;
        }
      },
      error: () => (this.loading = false),
    });
  }

  private loadSeasonData(): void {
    this.api.getStats(this.activeSeason.id).subscribe({
      next: (stats) => {
        this.seasonStats = stats.teamStats;
        this.rG_s = stats.ringerGoals;
        this.rA_s = stats.ringerAssists;
        this.oG_s = stats.ownGoals;
        this.topScorers_s = this.getTopN(stats.playerStats, 'goals', 5);
        this.topAssist_s = this.getTopN(stats.playerStats, 'assists', 5);
        this.cs_s = this.getTopKeeper(stats.playerStats, 'cleanSheetsKeeper');
        this.gapg_s = this.getGAPG(stats.playerStats, false);
        this.loadLastMatch();
      },
    });
  }

  private loadAllTimeData(): void {
    this.api.getStats().subscribe({
      next: (stats) => {
        this.allTimeStatsF = stats.teamStats;
        this.allTimeStats = stats.teamStatsLeague;
        this.rG = stats.ringerGoalsLeague;
        this.rA = stats.ringerAssistsLeague;
        this.oG = stats.ownGoalsLeague;
        this.rG_f = stats.ringerGoals;
        this.rA_f = stats.ringerAssists;
        this.oG_f = stats.ownGoals;
        this.topScorers_at = this.getTopN(stats.playerStats, 'goalsLeague', 5);
        this.topScorers_atF = this.getTopN(stats.playerStats, 'goals', 5);
        this.topAssist_at = this.getTopN(stats.playerStats, 'assistsLeague', 5);
        this.topAssist_atF = this.getTopN(stats.playerStats, 'assists', 5);
        this.cs_at = this.getTopKeeper(stats.playerStats, 'cleanSheetsKeeperLeague');
        this.cs_atF = this.getTopKeeper(stats.playerStats, 'cleanSheetsKeeper');
        this.gapg_at = this.getGAPG(stats.playerStats, true);
        this.gapg_atF = this.getGAPG(stats.playerStats, false);
        this.hasData = true;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  private loadLastMatch(): void {
    this.api.getMatches(this.activeSeason.id).subscribe({
      next: (matches) => {
        if (matches.length > 0) {
          this.lastMatch = matches[0];
          this.lastMatchScorers = this.groupNames(this.getMatchContributions(this.lastMatch, 'goals'));
          this.lastMatchAssisters = this.groupNames(this.getMatchContributions(this.lastMatch, 'assists'));
        }
      },
    });
  }

  private getMatchContributions(match: any, field: string): string[] {
    const names: string[] = [];
    for (const p of match.players || []) {
      if (p[field] > 0) {
        const name = this.getPlayerName(p.playerId);
        for (let i = 0; i < p[field]; i++) names.push(name);
      }
    }
    return names;
  }

  private getPlayerName(playerId: string): string {
    const p = this.players.find((pl: any) => pl.id === playerId);
    return p ? p.name : '?';
  }

  groupNames(names: string[]): string[] {
    const counts = new Map<string, number>();
    for (const n of names) {
      counts.set(n, (counts.get(n) || 0) + 1);
    }
    return Array.from(counts.entries()).map(([name, count]) =>
      count > 1 ? `${name} (x${count})` : name
    );
  }

  private getTopN(playerStats: any[], field: string, n: number): any[] {
    return playerStats
      .filter((p: any) => p[field] > 0)
      .sort((a: any, b: any) => b[field] - a[field])
      .slice(0, n)
      .map((p: any) => [p.playerName, p[field]]);
  }

  private getTopKeeper(playerStats: any[], field: string): any[] {
    return playerStats
      .filter((p: any) => p[field] > 0)
      .sort((a: any, b: any) => b[field] - a[field])
      .map((p: any) => [p.playerName, p[field]]);
  }

  private getGAPG(playerStats: any[], leagueOnly: boolean): any[] {
    const matchField = leagueOnly ? 'keeperMatchesLeague' : 'keeperMatches';
    const concField = leagueOnly ? 'concededKeeperLeague' : 'concededKeeper';
    return playerStats
      .filter((p: any) => p[matchField] > 0)
      .map((p: any) => [p.playerName, parseFloat((p[concField] / p[matchField]).toFixed(2))])
      .sort((a: any, b: any) => a[1] - b[1]);
  }
}
