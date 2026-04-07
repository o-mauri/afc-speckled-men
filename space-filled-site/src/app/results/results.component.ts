import { Component, OnInit, HostListener } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
  results: any[] = [];
  seasons: any[] = [];
  players: any[] = [];
  selectedSeasonId = '';
  isMobile = false;
  loading = true;

  constructor(private api: ApiService) {}

  @HostListener('window:resize')
  onResize(): void {
    this.isMobile = window.innerWidth < 600;
  }

  ngOnInit(): void {
    this.isMobile = window.innerWidth < 600;
    this.api.getPlayers().subscribe((p) => (this.players = p));
    this.api.getSeasons().subscribe({
      next: (seasons) => {
        this.seasons = seasons;
        const active = seasons.find((s: any) => s.isActive);
        if (active) {
          this.selectedSeasonId = active.id;
          this.loadResults();
        } else {
          this.loading = false;
        }
      },
      error: () => (this.loading = false),
    });
  }

  loadResults(): void {
    if (!this.selectedSeasonId) return;
    this.loading = true;
    this.api.getMatches(this.selectedSeasonId).subscribe({
      next: (matches) => {
        this.results = matches;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  getScorers(match: any): string[] {
    return this.groupNames(this.getContributions(match, 'goals'));
  }

  private getContributions(match: any, field: string): string[] {
    const names: string[] = [];
    for (const p of match.players || []) {
      if (p[field] > 0) {
        const name = this.getPlayerName(p.playerId);
        for (let i = 0; i < p[field]; i++) names.push(name);
      }
    }
    return names;
  }

  private groupNames(names: string[]): string[] {
    const counts = new Map<string, number>();
    for (const n of names) {
      counts.set(n, (counts.get(n) || 0) + 1);
    }
    return Array.from(counts.entries()).map(([name, count]) =>
      count > 1 ? `${name} (x${count})` : name
    );
  }

  getPlayerName(id: string): string {
    const p = this.players.find((pl: any) => pl.id === id);
    return p ? p.name : '?';
  }
}
