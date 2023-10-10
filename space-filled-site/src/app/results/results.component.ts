import { Component, ElementRef, OnInit, Renderer2, HostListener } from '@angular/core';
import * as data from '../../assets/siteData.json'

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  results: any;
  squad: any;
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

  ngOnInit(): void {
    this.updateIsMobile();
    var rawData = data;
    this.results = rawData.results;
    this.squad = rawData.squad;
  }
}
