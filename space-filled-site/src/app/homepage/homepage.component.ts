import * as data from '../../assets/siteData.json'
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  homeScore: number = 6;
  oppScore: number = 2;
  oppName: string = "Saucy 6";
  lastMatchDetails = {
    type: '',
    date: ''
  };
  scorers: Array<string> = [];
  assisters: Array<string> = [];
  squad: any;

  seasonStats: Array<Number> = [0, 0, 0, 0, 0, 0, 0];
  allTimeStats: Array<Number> = [0, 0, 0, 0, 0, 0, 0];
  allTimeStatsF: Array<Number> = [0, 0, 0, 0, 0, 0, 0];

  stats_includefriendlies: boolean = false;
  ts_includefriendlies: boolean = false;
  ta_includefriendlies: boolean = false;

  topScorers_s: Array<Array<any>> = [];
  topScorers_at: Array<Array<any>> = [];
  topScorers_atF: Array<Array<any>> = [];
  topAssist_s: Array<Array<any>> = [];
  topAssist_at: Array<Array<any>> = [];
  topAssist_atF: Array<Array<any>> = [];





  ngOnInit(): void {
    var rawData = data;
    var lastMatch = rawData.lastMatchData;
    this.squad = rawData.squad

    this.homeScore = lastMatch.sfScore
    this.oppName = lastMatch.opponent
    this.oppScore = lastMatch.oppScore
    this.lastMatchDetails.type = lastMatch.type
    this.lastMatchDetails.date = lastMatch.date

    var scrs = lastMatch.scorers
    for (let scr of scrs) {
      this.scorers.push(this.squad[scr].name)
    }
    var asts = lastMatch.assisters
    for (let ast of asts) {
      this.assisters.push(this.squad[ast].name)
    }

    this.seasonStats = rawData.seasonStats;
    this.allTimeStats = rawData.allTimeStats;
    this.allTimeStatsF = rawData.allTimeStatsF;

  }
}
