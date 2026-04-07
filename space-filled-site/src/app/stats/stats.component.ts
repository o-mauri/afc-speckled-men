import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit {
  loading = true;
  minApps = 0;

  appsList: any[] = [];
  appsListF: any[] = [];
  winList: any[] = [];
  winListF: any[] = [];
  winRList: any[] = [];
  winRListF: any[] = [];

  goalsList: any[] = [];
  goalsListF: any[] = [];
  gpgList: any[] = [];
  gpgListF: any[] = [];

  assistList: any[] = [];
  assistListF: any[] = [];
  apgList: any[] = [];
  apgListF: any[] = [];

  contList: any[] = [];
  contListF: any[] = [];
  cpgList: any[] = [];
  cpgListF: any[] = [];

  concededList: any[] = [];
  concededListF: any[] = [];
  concededpgList: any[] = [];
  concededpgListF: any[] = [];
  csList: any[] = [];
  csListF: any[] = [];
  gpcsList: any[] = [];
  gpcsListF: any[] = [];

  gkappsList: any[] = [];
  gkappsListF: any[] = [];
  gkcsList: any[] = [];
  gkcsListF: any[] = [];
  gkgaList: any[] = [];
  gkgaListF: any[] = [];
  gkgapgList: any[] = [];
  gkgapgListF: any[] = [];
  gkgpcsList: any[] = [];
  gkgpcsListF: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getStats().subscribe({
      next: (data) => {
        this.processStats(data.playerStats);
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  private processStats(playerStats: any[]): void {
    for (const p of playerStats) {
      const nme = p.playerName;
      const games = p.matchesLeague;
      const gamesF = p.matches;
      const goals = p.goalsLeague;
      const goalsF = p.goals;
      const assist = p.assistsLeague;
      const assistF = p.assists;
      const win = p.winsLeague;
      const winF = p.wins;
      const dgp = p.defensiveMatchesLeague;
      const dgpF = p.defensiveMatches;
      const gkapps = p.keeperMatchesLeague;
      const gkappsF = p.keeperMatches;
      const ga = p.concededLeague;
      const gaF = p.conceded;
      const gkga = p.concededKeeperLeague;
      const gkgaF = p.concededKeeper;
      const cs = p.cleanSheetsLeague;
      const csF = p.cleanSheets;
      const gkcs = p.cleanSheetsKeeperLeague;
      const gkcsF = p.cleanSheetsKeeper;

      this.appsList.push({ name: nme, stat: games });
      this.appsListF.push({ name: nme, stat: gamesF });
      this.winList.push({ name: nme, stat: win });
      this.winListF.push({ name: nme, stat: winF });
      this.winRList.push({ name: nme, stat: games > 0 ? parseFloat((win / games * 100).toFixed(0)) : 0, g: games });
      this.winRListF.push({ name: nme, stat: gamesF > 0 ? parseFloat((winF / gamesF * 100).toFixed(0)) : 0, g: gamesF });

      this.goalsList.push({ name: nme, stat: goals });
      this.goalsListF.push({ name: nme, stat: goalsF });
      this.gpgList.push({ name: nme, stat: games > 0 ? parseFloat((goals / games).toFixed(2)) : 0, g: games });
      this.gpgListF.push({ name: nme, stat: gamesF > 0 ? parseFloat((goalsF / gamesF).toFixed(2)) : 0, g: gamesF });

      this.assistList.push({ name: nme, stat: assist });
      this.assistListF.push({ name: nme, stat: assistF });
      this.apgList.push({ name: nme, stat: games > 0 ? parseFloat((assist / games).toFixed(2)) : 0, g: games });
      this.apgListF.push({ name: nme, stat: gamesF > 0 ? parseFloat((assistF / gamesF).toFixed(2)) : 0, g: gamesF });

      this.contList.push({ name: nme, stat: goals + assist });
      this.contListF.push({ name: nme, stat: goalsF + assistF });
      this.cpgList.push({ name: nme, stat: games > 0 ? parseFloat(((goals + assist) / games).toFixed(2)) : 0, g: games });
      this.cpgListF.push({ name: nme, stat: gamesF > 0 ? parseFloat(((goalsF + assistF) / gamesF).toFixed(2)) : 0, g: gamesF });

      if (dgpF > 0) {
        this.concededList.push({ name: nme, stat: ga });
        this.concededListF.push({ name: nme, stat: gaF });
        if (dgp > 0) {
          this.concededpgList.push({ name: nme, stat: parseFloat((ga / dgp).toFixed(1)) });
        }
        this.concededpgListF.push({ name: nme, stat: parseFloat((gaF / dgpF).toFixed(1)) });
        this.csList.push({ name: nme, stat: cs });
        this.csListF.push({ name: nme, stat: csF });
        if (cs > 0) {
          this.gpcsList.push({ name: nme, stat: parseFloat((dgp / cs).toFixed(1)) });
        }
        if (csF > 0) {
          this.gpcsListF.push({ name: nme, stat: parseFloat((dgpF / csF).toFixed(1)) });
        }
        if (gkappsF > 0) {
          this.gkappsList.push({ name: nme, stat: gkapps });
          this.gkappsListF.push({ name: nme, stat: gkappsF });
          this.gkcsList.push({ name: nme, stat: gkcs });
          this.gkcsListF.push({ name: nme, stat: gkcsF });
          this.gkgaList.push({ name: nme, stat: gkga });
          this.gkgaListF.push({ name: nme, stat: gkgaF });
          if (gkapps > 0) {
            this.gkgapgList.push({ name: nme, stat: parseFloat((gkga / gkapps).toFixed(1)) });
          }
          this.gkgapgListF.push({ name: nme, stat: parseFloat((gkgaF / gkappsF).toFixed(1)) });
          if (gkcs > 0) {
            this.gkgpcsList.push({ name: nme, stat: parseFloat((gkapps / gkcs).toFixed(1)) });
          }
          if (gkcsF > 0) {
            this.gkgpcsListF.push({ name: nme, stat: parseFloat((gkappsF / gkcsF).toFixed(1)) });
          }
        }
      }
    }

    // Sort all lists
    this.appsList = this.processStat(this.appsList, false);
    this.appsListF = this.processStat(this.appsListF, false);
    this.winList = this.processStat(this.winList, false);
    this.winListF = this.processStat(this.winListF, false);
    this.winRList = this.processStat(this.winRList, true);
    this.winRListF = this.processStat(this.winRListF, true);

    this.goalsList = this.processStat(this.goalsList, false);
    this.goalsListF = this.processStat(this.goalsListF, false);
    this.gpgList = this.processStat(this.gpgList, true);
    this.gpgListF = this.processStat(this.gpgListF, true);

    this.assistList = this.processStat(this.assistList, false);
    this.assistListF = this.processStat(this.assistListF, false);
    this.apgList = this.processStat(this.apgList, true);
    this.apgListF = this.processStat(this.apgListF, true);

    this.contList = this.processStat(this.contList, false);
    this.contListF = this.processStat(this.contListF, false);
    this.cpgList = this.processStat(this.cpgList, true);
    this.cpgListF = this.processStat(this.cpgListF, true);

    this.concededList = this.processStat(this.concededList, false);
    this.concededListF = this.processStat(this.concededListF, false);
    this.concededpgList = this.processStat(this.concededpgList, false).reverse();
    this.concededpgListF = this.processStat(this.concededpgListF, false).reverse();
    this.csList = this.processStat(this.csList, false);
    this.csListF = this.processStat(this.csListF, false);
    this.gpcsList = this.processStat(this.gpcsList, false).reverse();
    this.gpcsListF = this.processStat(this.gpcsListF, false).reverse();

    this.gkappsList = this.processStat(this.gkappsList, false);
    this.gkappsListF = this.processStat(this.gkappsListF, false);
    this.gkcsList = this.processStat(this.gkcsList, false);
    this.gkcsListF = this.processStat(this.gkcsListF, false);
    this.gkgaList = this.processStat(this.gkgaList, false).reverse();
    this.gkgaListF = this.processStat(this.gkgaListF, false).reverse();
    this.gkgapgList = this.processStat(this.gkgapgList, false);
    this.gkgapgListF = this.processStat(this.gkgapgListF, false);
    this.gkgpcsList = this.processStat(this.gkgpcsList, false).reverse();
    this.gkgpcsListF = this.processStat(this.gkgpcsListF, false).reverse();
  }

  processStat(list: any[], minFix: boolean): any[] {
    let result = list.sort((a, b) => b.stat - a.stat).filter((e) => e.stat > 0);
    if (minFix) {
      result = result.filter((e) => e.g >= this.minApps);
    }
    return result;
  }
}
