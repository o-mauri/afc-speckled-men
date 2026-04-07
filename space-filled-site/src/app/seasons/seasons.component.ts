import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-seasons',
  templateUrl: './seasons.component.html',
  styleUrls: ['./seasons.component.scss'],
})
export class SeasonsComponent implements OnInit {
  seasons: any[] = [];
  seasonData: Map<string, any> = new Map();
  expandedSeason: string | null = null;
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getSeasons().subscribe({
      next: (seasons) => {
        this.seasons = seasons;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  toggleSeason(seasonId: string): void {
    if (this.expandedSeason === seasonId) {
      this.expandedSeason = null;
      return;
    }
    this.expandedSeason = seasonId;
    if (!this.seasonData.has(seasonId)) {
      this.loadSeasonStats(seasonId);
    }
  }

  private loadSeasonStats(seasonId: string): void {
    this.api.getStats(seasonId).subscribe({
      next: (stats) => {
        const topScorer = stats.playerStats
          .filter((p: any) => p.goals > 0)
          .sort((a: any, b: any) => b.goals - a.goals)
          .slice(0, 3);
        const topAssister = stats.playerStats
          .filter((p: any) => p.assists > 0)
          .sort((a: any, b: any) => b.assists - a.assists)
          .slice(0, 3);
        const topApps = stats.playerStats
          .filter((p: any) => p.matches > 0)
          .sort((a: any, b: any) => b.matches - a.matches)
          .slice(0, 3);
        this.seasonData.set(seasonId, {
          ...stats,
          topScorer,
          topAssister,
          topApps,
        });
      },
    });
  }

  getData(seasonId: string): any {
    return this.seasonData.get(seasonId);
  }
}
