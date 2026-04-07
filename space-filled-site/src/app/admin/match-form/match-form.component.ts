import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

interface PlayerEntry {
  playerId: string;
  playerName: string;
  selected: boolean;
  goals: number;
  assists: number;
  isGoalkeeper: boolean;
}

@Component({
  selector: 'app-match-form',
  templateUrl: './match-form.component.html',
  styleUrls: ['./match-form.component.scss'],
})
export class MatchFormComponent implements OnInit {
  seasons: any[] = [];
  matches: any[] = [];
  players: any[] = [];
  playerEntries: PlayerEntry[] = [];

  selectedSeasonId = '';
  filterSeasonId = '';
  matchDate = '';
  matchType: 'League' | 'Friendly' = 'League';
  isForfeit = false;
  opponent = '';
  teamScore = 0;
  opponentScore = 0;
  ringerGoals = 0;
  ringerAssists = 0;
  ownGoals = 0;

  editingMatch: any = null;
  loading = false;
  message = '';
  messageType = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadSeasons();
    this.loadPlayers();
  }

  loadSeasons(): void {
    this.api.getSeasons().subscribe({
      next: (seasons) => {
        this.seasons = seasons;
        const active = seasons.find((s: any) => s.isActive);
        if (active) {
          this.selectedSeasonId = active.id;
          this.filterSeasonId = active.id;
          this.loadMatches();
        }
      },
    });
  }

  loadPlayers(): void {
    this.api.getPlayers().subscribe({
      next: (players) => {
        this.players = players;
        this.buildPlayerEntries();
      },
    });
  }

  loadMatches(): void {
    if (!this.filterSeasonId) return;
    this.api.getMatches(this.filterSeasonId).subscribe({
      next: (matches) => (this.matches = matches),
    });
  }

  buildPlayerEntries(): void {
    this.playerEntries = this.players.map((p) => ({
      playerId: p.id,
      playerName: p.name,
      selected: false,
      goals: 0,
      assists: 0,
      isGoalkeeper: false,
    }));
  }

  onForfeitChange(): void {
    if (this.isForfeit) {
      this.matchType = 'League';
      this.teamScore = 0;
      this.opponentScore = 5;
      this.ringerGoals = 0;
      this.ringerAssists = 0;
      this.ownGoals = 0;
      // Deselect all players
      for (const pe of this.playerEntries) {
        pe.selected = false;
        pe.goals = 0;
        pe.assists = 0;
        pe.isGoalkeeper = false;
      }
    }
  }

  saveMatch(): void {
    if (!this.selectedSeasonId || !this.matchDate || !this.opponent) return;
    this.loading = true;

    const matchPlayers = this.isForfeit
      ? []
      : this.playerEntries
          .filter((p) => p.selected)
          .map((p) => ({
            playerId: p.playerId,
            goals: p.goals,
            assists: p.assists,
            isDefender: true,
            isGoalkeeper: p.isGoalkeeper,
          }));

    const data: any = {
      seasonId: this.selectedSeasonId,
      date: this.matchDate,
      matchType: this.isForfeit ? 'League' : this.matchType,
      isForfeit: this.isForfeit,
      opponent: this.opponent,
      teamScore: this.isForfeit ? 0 : this.teamScore,
      opponentScore: this.isForfeit ? 5 : this.opponentScore,
      players: matchPlayers,
      ringerGoals: this.isForfeit ? 0 : this.ringerGoals,
      ringerAssists: this.isForfeit ? 0 : this.ringerAssists,
      ownGoals: this.isForfeit ? 0 : this.ownGoals,
    };

    if (this.editingMatch) {
      data.originalSeasonId = this.editingMatch.seasonId;
      data.originalDate = this.editingMatch.date;
      data.createdAt = this.editingMatch.createdAt;
    }

    const obs = this.editingMatch
      ? this.api.updateMatch(this.editingMatch.id, data)
      : this.api.createMatch(data);

    obs.subscribe({
      next: () => {
        this.showMessage(this.editingMatch ? 'Match updated' : 'Match added', 'success');
        this.resetForm();
        this.loadMatches();
        this.loading = false;
      },
      error: () => {
        this.showMessage('Failed to save match', 'danger');
        this.loading = false;
      },
    });
  }

  editMatch(match: any): void {
    this.editingMatch = match;
    this.selectedSeasonId = match.seasonId;
    this.matchDate = match.date;
    this.matchType = match.matchType;
    this.isForfeit = match.isForfeit || false;
    this.opponent = match.opponent;
    this.teamScore = match.teamScore;
    this.opponentScore = match.opponentScore;
    this.ringerGoals = match.ringerGoals || 0;
    this.ringerAssists = match.ringerAssists || 0;
    this.ownGoals = match.ownGoals || 0;

    this.buildPlayerEntries();
    for (const mp of match.players || []) {
      const entry = this.playerEntries.find((pe) => pe.playerId === mp.playerId);
      if (entry) {
        entry.selected = true;
        entry.goals = mp.goals;
        entry.assists = mp.assists;
        entry.isGoalkeeper = mp.isGoalkeeper;
      }
    }
  }

  removeMatch(match: any): void {
    if (!confirm(`Delete match vs ${match.opponent}?`)) return;
    this.api.deleteMatch(match.id, match.seasonId, match.date).subscribe({
      next: () => {
        this.showMessage('Match deleted', 'success');
        this.loadMatches();
      },
      error: () => this.showMessage('Failed to delete match', 'danger'),
    });
  }

  resetForm(): void {
    this.editingMatch = null;
    this.matchDate = '';
    this.matchType = 'League';
    this.isForfeit = false;
    this.opponent = '';
    this.teamScore = 0;
    this.opponentScore = 0;
    this.ringerGoals = 0;
    this.ringerAssists = 0;
    this.ownGoals = 0;
    this.buildPlayerEntries();
  }

  // Validation
  get totalPlayerGoals(): number {
    return this.playerEntries.filter((p) => p.selected).reduce((sum, p) => sum + p.goals, 0);
  }

  get totalPlayerAssists(): number {
    return this.playerEntries.filter((p) => p.selected).reduce((sum, p) => sum + p.assists, 0);
  }

  get expectedGoals(): number {
    return this.teamScore;
  }

  get actualGoals(): number {
    return this.totalPlayerGoals + this.ringerGoals + this.ownGoals;
  }

  get goalsValid(): boolean {
    return this.actualGoals === this.expectedGoals;
  }

  get totalAssists(): number {
    return this.totalPlayerAssists + this.ringerAssists;
  }

  get assistsValid(): boolean {
    return this.totalAssists <= this.teamScore;
  }

  get formValid(): boolean {
    if (this.isForfeit) {
      return !!this.selectedSeasonId && !!this.matchDate && !!this.opponent.trim();
    }
    return !!this.selectedSeasonId && !!this.matchDate && !!this.opponent.trim() && this.goalsValid && this.assistsValid;
  }

  getResultClass(match: any): string {
    if (match.isForfeit) return 'FF';
    if (match.teamScore > match.opponentScore) return 'W';
    if (match.teamScore === match.opponentScore) return 'D';
    return 'L';
  }

  private showMessage(msg: string, type: string): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => (this.message = ''), 3000);
  }
}
