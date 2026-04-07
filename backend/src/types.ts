export interface Player {
  id: string;
  name: string;
  imageKey?: string;
  createdAt: string;
}

export interface Season {
  id: string;
  name: string;
  division?: string;
  isActive: boolean;
  finalPosition?: string;
  points?: number;
  createdAt: string;
}

export interface MatchPlayerEntry {
  playerId: string;
  goals: number;
  assists: number;
  isDefender: boolean;
  isGoalkeeper: boolean;
}

export interface Match {
  id: string;
  seasonId: string;
  date: string;
  matchType: 'League' | 'Friendly';
  isForfeit?: boolean;
  opponent: string;
  teamScore: number;
  opponentScore: number;
  players: MatchPlayerEntry[];
  ringerGoals: number;
  ringerAssists: number;
  ownGoals: number;
  createdAt: string;
}

export interface PlayerStats {
  playerId: string;
  playerName: string;
  imageKey?: string;
  matches: number;
  matchesLeague: number;
  matchesFriendly: number;
  goals: number;
  goalsLeague: number;
  goalsFriendly: number;
  assists: number;
  assistsLeague: number;
  assistsFriendly: number;
  wins: number;
  winsLeague: number;
  winsFriendly: number;
  goalContributions: number;
  goalContributionsLeague: number;
  defensiveMatches: number;
  defensiveMatchesLeague: number;
  keeperMatches: number;
  keeperMatchesLeague: number;
  conceded: number;
  concededLeague: number;
  concededKeeper: number;
  concededKeeperLeague: number;
  cleanSheets: number;
  cleanSheetsLeague: number;
  cleanSheetsKeeper: number;
  cleanSheetsKeeperLeague: number;
}

export interface TeamStats {
  matches: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  winPercentage: number;
}

export interface StatsResponse {
  teamStats: TeamStats;
  teamStatsLeague: TeamStats;
  playerStats: PlayerStats[];
  ringerGoals: number;
  ringerAssists: number;
  ownGoals: number;
  ringerGoalsLeague: number;
  ringerAssistsLeague: number;
  ownGoalsLeague: number;
}
