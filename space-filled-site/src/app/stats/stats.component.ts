import { Component, OnInit } from '@angular/core';
import * as data from '../../assets/siteData.json'

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  squad: any;

  appsList: { name: string, stat: number }[] = [];
  appsListF: { name: string, stat: number }[] = [];
  winList: { name: string, stat: number}[] = [];
  winListF: { name: string, stat: number }[] = [];
  winRList: {name: string, stat: number, g: number}[] = [];
  winRListF: {name: string, stat: number, g: number}[] =[];

  goalsList: { name: string; stat: number; }[] = [];
  goalsListF: { name: string; stat: number; }[] = [];
  gpgList: { name: string; stat: number; g: number; }[] = [];
  gpgListF: { name: string; stat: number; g: number; }[] = [];

  assistList: { name: string; stat: number }[] = [];
  assistListF: { name: string; stat: number }[] = [];
  apgList: { name: string, stat: number; g: number }[] = [];
  apgListF: { name: string, stat: number; g: number }[] = [];

  contList: { name: string; stat: number }[] = [];
  contListF: { name: string; stat: number }[] = [];
  cpgList: { name: string; stat: number, g: number }[] = [];
  cpgListF: { name: string; stat: number, g: number }[] = [];

  ngOnInit(): void {
    var rawData = data;
    this.squad = rawData.squad;

    Object.keys(this.squad).forEach((key) => {
      if (key != "RNG" && key != "OWN") {
        var nme = this.squad[key]["name"]
        var games = this.squad[key]["statsC"]["matches"]
        var gamesF = this.squad[key]["statsF"]["matches"]
        var goals = this.squad[key]["statsC"]["goals"]
        var goalsF = this.squad[key]["statsF"]["goals"]
        var assist = this.squad[key]["statsC"]["assists"]
        var assistF = this.squad[key]["statsF"]["assists"]
        var win = this.squad[key]["statsC"]["wins"]
        var winF = this.squad[key]["statsF"]["wins"]


        this.appsList.push({ name: nme, stat: games })
        this.appsListF.push({ name: nme, stat: gamesF })
        this.winList.push({name: nme, stat: win})
        this.winListF.push({name: nme, stat: winF})
        this.winRList.push({name: nme, stat: parseFloat((win/ games).toFixed(2))*100, g: games })
        this.winRListF.push({name: nme, stat: parseFloat((winF/ gamesF).toFixed(2))*100, g: gamesF })

        this.goalsList.push({ name: nme, stat: goals })
        this.goalsListF.push({ name: nme, stat: goalsF })
        this.gpgList.push({ name: nme, stat: parseFloat((goals / games).toFixed(2)), g: games })
        this.gpgListF.push({ name: nme, stat: parseFloat((goalsF / gamesF).toFixed(2)), g: gamesF })
        
        this.assistList.push({ name: nme, stat: assist })
        this.assistListF.push({ name: nme, stat: assistF })
        this.apgList.push({ name: nme, stat: parseFloat((assist / games).toFixed(2)), g: games })
        this.apgListF.push({ name: nme, stat: parseFloat((assistF / gamesF).toFixed(2)), g: games })
      
        this.contList.push({ name: nme, stat: goals + assist })
        this.contListF.push({name: nme, stat: goalsF + assistF})
        this.cpgList.push({ name: nme, stat: parseFloat(((goals + assist)/ games).toFixed(2)), g: games })
        this.cpgListF.push({ name: nme, stat: parseFloat(((goalsF + assistF)/ gamesF).toFixed(2)), g: gamesF })
      }
    });

    this.appsList = this.processStat(this.appsList, false)
      this. appsListF = this.processStat(this.appsListF, false)
      this.winList = this.processStat(this.winList, false)
      this.winListF = this.processStat(this.winListF, false)
      this.winRList = this.processStat(this.winRList, true)
      this.winRListF = this.processStat(this.winRListF, true)

      this.goalsList = this.processStat(this.goalsList, false)
      this.goalsListF = this.processStat(this.goalsListF, false)
      this.gpgList = this.processStat(this.gpgList, true)
      this.gpgListF = this.processStat(this.gpgListF, true)

      this.assistList = this.processStat(this.assistList, false)
      this.assistListF = this.processStat(this.assistListF, false)
      this.apgList = this.processStat(this.apgList, true)
      this.apgListF = this.processStat(this.apgListF, true)

      this.contList = this.processStat(this.contList, false)
      this.contListF = this.processStat(this.contListF, false)
      this.cpgList = this.processStat(this.cpgList, true)
      this.cpgListF = this.processStat(this.cpgListF, true)

      console.log(this.contList)
    
  }

  processStat(list: any, minFix: boolean): any {
    list.sort((a: any, b: any) => b.stat - a.stat)
    var newlist = list.filter((ent: any) => ent.stat > 0)
    if (minFix) {
      var newlist = newlist.filter((ent: any) => ent.g > 25)
    }
    return newlist
  }
}
