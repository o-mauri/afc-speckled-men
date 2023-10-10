import { Component, OnInit } from '@angular/core';
import * as data from '../../assets/siteData.json'
import { faFutbol, faUser, faA } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-squad',
  templateUrl: './squad.component.html',
  styleUrls: ['./squad.component.scss']
})
export class SquadComponent implements OnInit{
  incFriendlies: boolean = false;
  searchTerm: string = "statsC";
  squad: any;
  squadKeys: any;


  userIcon = faUser;
  footyIcon = faFutbol;
  aIcon = faA;

  toggleFriendlies(){
    this.incFriendlies = !this.incFriendlies;

    if (this.incFriendlies){
      this.searchTerm = "statsF"
    }
    else{
      this.searchTerm = "statsC"
    }
  }

  ngOnInit(): void {
    var rawData = data;
    this.squad = rawData.squad;

    this.squadKeys = Object.keys(this.squad)

    this.squadKeys.shift()
    this.squadKeys.shift()
  }
}
