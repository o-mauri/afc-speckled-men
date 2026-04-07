import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-player-form',
  templateUrl: './player-form.component.html',
  styleUrls: ['./player-form.component.scss'],
})
export class PlayerFormComponent implements OnInit {
  players: any[] = [];
  playerName = '';
  imageBase64: string | null = null;
  imagePreview: string | null = null;
  editingPlayer: any = null;
  loading = false;
  message = '';
  messageType = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadPlayers();
  }

  loadPlayers(): void {
    this.api.getPlayers().subscribe({
      next: (players) => (this.players = players),
      error: () => this.showMessage('Failed to load players', 'danger'),
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;

    const file = input.files[0];
    this.compressImage(file).then((result) => {
      this.imageBase64 = result.base64;
      this.imagePreview = result.preview;
    });
  }

  private compressImage(file: File): Promise<{ base64: string; preview: string }> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxSize = 300;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxSize) {
              height = Math.round((height * maxSize) / width);
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = Math.round((width * maxSize) / height);
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, width, height);

          const preview = canvas.toDataURL('image/jpeg', 0.6);
          const base64 = preview.split(',')[1];
          resolve({ base64, preview });
        };
        img.src = e.target!.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  savePlayer(): void {
    if (!this.playerName.trim()) return;
    this.loading = true;

    const data: any = { name: this.playerName.trim() };
    if (this.imageBase64) {
      data.image = this.imageBase64;
    }

    const obs = this.editingPlayer
      ? this.api.updatePlayer(this.editingPlayer.id, data)
      : this.api.createPlayer(data);

    obs.subscribe({
      next: () => {
        this.showMessage(
          this.editingPlayer ? 'Player updated' : 'Player added',
          'success'
        );
        this.resetForm();
        this.loadPlayers();
        this.loading = false;
      },
      error: () => {
        this.showMessage('Failed to save player', 'danger');
        this.loading = false;
      },
    });
  }

  editPlayer(player: any): void {
    this.editingPlayer = player;
    this.playerName = player.name;
    this.imagePreview = player.imageUrl;
    this.imageBase64 = null;
  }

  removePlayer(player: any): void {
    if (!confirm(`Remove ${player.name}?`)) return;
    this.api.deletePlayer(player.id).subscribe({
      next: () => {
        this.showMessage('Player removed', 'success');
        this.loadPlayers();
      },
      error: () => this.showMessage('Failed to remove player', 'danger'),
    });
  }

  resetForm(): void {
    this.playerName = '';
    this.imageBase64 = null;
    this.imagePreview = null;
    this.editingPlayer = null;
  }

  private showMessage(msg: string, type: string): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => (this.message = ''), 3000);
  }
}
