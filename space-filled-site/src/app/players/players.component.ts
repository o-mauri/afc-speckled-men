import { Component, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import * as data from '../../assets/siteData.json'
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})

export class PlayersComponent implements OnInit {

  selectedImage: number = 0;
  squad: any;
  squadKeys: any;
  isMobile: boolean = false;

  constructor(private renderer: Renderer2,  private el: ElementRef) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.updateIsMobile();
  }

  private updateIsMobile(): void {
    const breakpoint = 600;

    if (window.innerWidth < breakpoint) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  prev(): void {
    this.selectedImage = (this.selectedImage - 1 + this.squadKeys.length) % this.squadKeys.length;
  }

  next(): void {
    this.selectedImage = (this.selectedImage + 1) % this.squadKeys.length;
  }

  getImagePath(idx: number): string {
    var item = this.squadKeys[idx % this.squadKeys.length]
    
    var havePhotos = ['ACH','AGA','AMU','ASC','JFR','JRA','KPA','LPA','MWO','OBR','OMA','SCO','TTW']

    if (havePhotos.includes(item)) {
      return 'assets/players/' + item + '.png'
    }

    return 'assets/players/GENERIC.png' 
  }

  ngOnInit(): void {
    this.updateIsMobile();
    var rawData = data;
    this.squad = rawData.squad;

    this.squadKeys = Object.keys(this.squad)

    this.squadKeys.shift()
    this.squadKeys.shift()
  }
}
