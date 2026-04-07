import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-season-form',
  templateUrl: './season-form.component.html',
  styleUrls: ['./season-form.component.scss'],
})
export class SeasonFormComponent implements OnInit {
  seasons: any[] = [];
  seasonName = '';
  division = '';
  isActive = false;
  editingSeason: any = null;
  loading = false;
  message = '';
  messageType = '';

  // Close-out modal state
  showCloseoutModal = false;
  previousSeasonName = '';
  closeoutPosition = '';
  closeoutPoints: number | null = null;
  pendingSaveData: any = null;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadSeasons();
  }

  loadSeasons(): void {
    this.api.getSeasons().subscribe({
      next: (seasons) => (this.seasons = seasons),
      error: () => this.showMessage('Failed to load seasons', 'danger'),
    });
  }

  saveSeason(): void {
    if (!this.seasonName.trim()) return;

    const data: any = {
      name: this.seasonName.trim(),
      division: this.division.trim() || undefined,
      isActive: this.isActive,
    };

    // If setting active, check if there's a current active season to close out
    if (this.isActive) {
      const currentActive = this.seasons.find((s) => s.isActive);
      // Don't show modal if we're editing the already-active season
      if (currentActive && (!this.editingSeason || this.editingSeason.id !== currentActive.id)) {
        this.previousSeasonName = currentActive.name;
        this.closeoutPosition = '';
        this.closeoutPoints = null;
        this.pendingSaveData = data;
        this.showCloseoutModal = true;
        return;
      }
    }

    this.doSave(data);
  }

  confirmCloseout(): void {
    if (!this.pendingSaveData) return;
    this.pendingSaveData.previousSeasonFinalPosition = this.closeoutPosition || undefined;
    this.pendingSaveData.previousSeasonPoints = this.closeoutPoints !== null ? this.closeoutPoints : undefined;
    this.showCloseoutModal = false;
    this.doSave(this.pendingSaveData);
  }

  cancelCloseout(): void {
    this.showCloseoutModal = false;
    this.pendingSaveData = null;
  }

  private doSave(data: any): void {
    this.loading = true;
    const obs = this.editingSeason
      ? this.api.updateSeason(this.editingSeason.id, data)
      : this.api.createSeason(data);

    obs.subscribe({
      next: () => {
        this.showMessage(
          this.editingSeason ? 'Season updated' : 'Season created',
          'success'
        );
        this.resetForm();
        this.loadSeasons();
        this.loading = false;
      },
      error: () => {
        this.showMessage('Failed to save season', 'danger');
        this.loading = false;
      },
    });
  }

  editSeason(season: any): void {
    this.editingSeason = season;
    this.seasonName = season.name;
    this.division = season.division || '';
    this.isActive = season.isActive;
  }

  removeSeason(season: any): void {
    if (!confirm(`Delete season "${season.name}" and all its matches?`)) return;
    this.api.deleteSeason(season.id).subscribe({
      next: () => {
        this.showMessage('Season deleted', 'success');
        this.loadSeasons();
      },
      error: () => this.showMessage('Failed to delete season', 'danger'),
    });
  }

  resetForm(): void {
    this.seasonName = '';
    this.division = '';
    this.isActive = false;
    this.editingSeason = null;
    this.pendingSaveData = null;
  }

  private showMessage(msg: string, type: string): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => (this.message = ''), 3000);
  }
}
