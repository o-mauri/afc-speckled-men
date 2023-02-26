import * as data from '../../assets/siteData.json'
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit 
{
  homeScore: number = 6;
  oppScore: number = 1;
  oppName: string = "Saucy 6";




  ngOnInit(): void {
    var rawData = data;
  }
}
