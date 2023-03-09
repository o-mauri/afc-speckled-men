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

  rG: number = 0;
  rG_s: number = 0;
  rG_f: number = 0;
  rA: number = 0;
  rA_s: number = 0;
  rA_f: number = 0;
  oG: number = 0;
  oG_s: number = 0;
  oG_f: number = 0;  






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

    this.topScorers_s = rawData.topScorers_s;
    this.topScorers_at = rawData.topScorers_at;
    this.topScorers_atF = rawData.topScorers_atF;

    this.topAssist_s = rawData.topAssist_s;
    this.topAssist_at = rawData.topAssist_at;
    this.topAssist_atF = rawData.topAssist_atF;

    this.rG = rawData.ringerGoals;
    this.rG_s = rawData.ringerGoalsS;
    this.rG_f = rawData.ringerGoalsF;
    this.rA = rawData.ringerAst;
    this.rA_s = rawData.ringerAstS;
    this.rA_f = rawData.ringerAstF;
    this.oG = rawData.ownGoal;
    this.oG_s = rawData.ownGoalS;
    this.oG_f = rawData.ownGoalF;

  }
}
