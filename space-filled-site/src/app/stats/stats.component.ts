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

  concededList: { name: string; stat: number}[] = [];
  concededListF: { name: string; stat: number}[] = [];
  concededpgList: { name: string; stat: number}[] = [];
  concededpgListF: { name: string; stat: number}[] = [];
  csList: { name: string; stat: number}[] = [];
  csListF: { name: string; stat: number}[] = [];
  gpcsList: { name: string; stat: number}[] = [];
  gpcsListF: { name: string; stat: number}[] = [];
  
  gkappsList: { name: string; stat: number}[] = [];
  gkappsListF: { name: string; stat: number}[] = [];
  gkcsList: {name: string, stat: number}[] = [];
  gkcsListF: {name: string, stat: number}[] = [];
  gkgaList: {name: string, stat: number}[] = [];
  gkgaListF: {name: string, stat: number}[] = [];
  gkgapgList: {name: string, stat: number}[] = [];
  gkgapgListF: {name: string, stat: number}[] = [];
  gkgpcsList: { name: string; stat: number}[] = [];
  gkgpcsListF: { name: string; stat: number}[] = [];

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
        var dgp = this.squad[key]["statsC"]["defensiveGP"]
        var dgpF = this.squad[key]["statsF"]["defensiveGP"]
        var gkapps = this.squad[key]["statsC"]["defensiveGP_k"]
        var gkappsF = this.squad[key]["statsF"]["defensiveGP_k"]
        var ga = this.squad[key]["statsC"]["conceded"]
        var gaF = this.squad[key]["statsF"]["conceded"]
        var gkga = this.squad[key]["statsC"]["conceded_k"]
        var gkgaF = this.squad[key]["statsF"]["conceded_k"]
        var cs = this.squad[key]["statsC"]["cleansheet"]
        var csF = this.squad[key]["statsF"]["cleansheet"]
        var gkcs = this.squad[key]["statsC"]["cleansheet_k"]
        var gkcsF = this.squad[key]["statsF"]["cleansheet_k"]


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
        
        if (dgpF > 0 ) 
        {
            this.concededList.push({ name: nme, stat: ga})
            this.concededListF.push({ name: nme, stat: gaF})
            if (dgp > 0) 
            {
                this.concededpgList.push({ name: nme, stat: parseFloat((ga/dgp).toFixed(1))})
            }
            this.concededpgListF.push({ name: nme, stat: parseFloat((gaF/dgpF).toFixed(1))})
            this.csList.push({ name: nme, stat: cs})
            this.csListF.push({ name: nme, stat: csF})
            if (cs > 0) 
            {
                this.gpcsList.push({ name: nme, stat: parseFloat((dgp/cs).toFixed(1))})
            }
            if (csF > 0) {
                this.gpcsListF.push({ name: nme, stat: parseFloat((dgpF/csF).toFixed(1))})
            }
            if (gkappsF > 0) 
            {
                this.gkappsList.push({ name: nme, stat: gkapps})
                this.gkappsListF.push({ name: nme, stat: gkappsF})
                this.gkcsList.push({ name: nme, stat: gkcs})
                this.gkcsListF.push({ name: nme, stat: gkcsF})
                this.gkgaList.push({ name: nme, stat: gkga})
                this.gkgaListF.push({ name: nme, stat: gkgaF})
                if (gkapps > 0) 
                {
                    this.gkgapgList.push({ name: nme, stat: parseFloat((gkga/gkapps).toFixed(1))})
                }
                this.gkgapgListF.push({ name: nme, stat: parseFloat((gkgaF/gkappsF).toFixed(1))})
                if (gkcs > 0) 
                {
                    this.gkgpcsList.push({ name: nme, stat: parseFloat((gkapps/gkcs).toFixed(1))})
                }
                if (gkcsF > 0) 
                {
                    this.gkgpcsListF.push({ name: nme, stat: parseFloat((gkappsF/gkcsF).toFixed(1))})
                }
            }
        }      
      }
    });

    console.log(this.csList)

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

    this.concededList = this.processStat(this.concededList, false)
    this.concededListF = this.processStat(this.concededListF, false)
    this.concededpgList = this.processStat(this.concededpgList, false).reverse()
    this.concededpgListF = this.processStat(this.concededpgListF, false).reverse()
    this.csList = this.processStat(this.csList, false)
    this.csListF = this.processStat(this.csListF, false)
    this.gpcsList = this.processStat(this.gpcsList, false).reverse()
    this.gpcsListF = this.processStat(this.gpcsListF, false).reverse()

    this.gkappsList = this.processStat(this.gkappsList, false)
    this.gkappsListF = this.processStat(this.gkappsListF, false)
    this.gkcsList = this.processStat(this.gkcsList, false)
    this.gkcsListF = this.processStat(this.gkcsListF, false)
    this.gkgaList = this.processStat(this.gkgaList, false).reverse()
    this.gkgaListF = this.processStat(this.gkgaListF, false).reverse()
    this.gkgapgList = this.processStat(this.gkgapgList, false)
    this.gkgapgListF = this.processStat(this.gkgapgListF, false)
    this.gkgpcsList = this.processStat(this.gkgpcsList, false).reverse()
    this.gkgpcsListF = this.processStat(this.gkgpcsListF, false).reverse()
    
    console.log(this.csList)
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
