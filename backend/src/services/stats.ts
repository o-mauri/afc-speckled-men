import { Match, Player, PlayerStats, TeamStats, StatsResponse } from '../types';

function computeTeamStats(matches: Match[], leagueOnly: boolean): TeamStats {
  const filtered = leagueOnly ? matches.filter((m) => m.matchType === 'League') : matches;
  let wins = 0, draws = 0, losses = 0, gf = 0, ga = 0;
  for (const m of filtered) {
    gf += m.teamScore;
    ga += m.opponentScore;
    if (m.teamScore > m.opponentScore) wins++;
    else if (m.teamScore === m.opponentScore) draws++;
    else losses++;
  }
  const total = filtered.length;
  return {
    matches: total,
    wins,
    draws,
    losses,
    goalsFor: gf,
    goalsAgainst: ga,
    winPercentage: total > 0 ? Math.round((wins / total) * 100) : 0,
  };
}

export function computeStats(matches: Match[], players: Player[]): StatsResponse {
  const playerMap = new Map<string, Player>();
  for (const p of players) {
    playerMap.set(p.id, p);
  }

  const teamStats = computeTeamStats(matches, false);
  const teamStatsLeague = computeTeamStats(matches, true);

  const statsMap = new Map<string, PlayerStats>();

  for (const player of players) {
    statsMap.set(player.id, {
      playerId: player.id,
      playerName: player.name,
      imageKey: player.imageKey,
      matches: 0, matchesLeague: 0, matchesFriendly: 0,
      goals: 0, goalsLeague: 0, goalsFriendly: 0,
      assists: 0, assistsLeague: 0, assistsFriendly: 0,
      wins: 0, winsLeague: 0, winsFriendly: 0,
      goalContributions: 0, goalContributionsLeague: 0,
      defensiveMatches: 0, defensiveMatchesLeague: 0,
      keeperMatches: 0, keeperMatchesLeague: 0,
      conceded: 0, concededLeague: 0,
      concededKeeper: 0, concededKeeperLeague: 0,
      cleanSheets: 0, cleanSheetsLeague: 0,
      cleanSheetsKeeper: 0, cleanSheetsKeeperLeague: 0,
    });
  }

  let ringerGoals = 0, ringerAssists = 0, ownGoals = 0;
  let ringerGoalsLeague = 0, ringerAssistsLeague = 0, ownGoalsLeague = 0;

  for (const match of matches) {
    const isLeague = match.matchType === 'League';
    const isWin = match.teamScore > match.opponentScore;
    const isCleanSheet = match.opponentScore === 0;

    ringerGoals += match.ringerGoals;
    ringerAssists += match.ringerAssists;
    ownGoals += match.ownGoals;
    if (isLeague) {
      ringerGoalsLeague += match.ringerGoals;
      ringerAssistsLeague += match.ringerAssists;
      ownGoalsLeague += match.ownGoals;
    }

    for (const entry of match.players) {
      const ps = statsMap.get(entry.playerId);
      if (!ps) continue;

      ps.matches++;
      ps.goals += entry.goals;
      ps.assists += entry.assists;
      ps.goalContributions += entry.goals + entry.assists;
      if (isWin) ps.wins++;

      if (isLeague) {
        ps.matchesLeague++;
        ps.goalsLeague += entry.goals;
        ps.assistsLeague += entry.assists;
        ps.goalContributionsLeague += entry.goals + entry.assists;
        if (isWin) ps.winsLeague++;
      } else {
        ps.matchesFriendly++;
        ps.goalsFriendly += entry.goals;
        ps.assistsFriendly += entry.assists;
        if (isWin) ps.winsFriendly++;
      }

      if (entry.isDefender) {
        ps.defensiveMatches++;
        ps.conceded += match.opponentScore;
        if (isCleanSheet) ps.cleanSheets++;
        if (isLeague) {
          ps.defensiveMatchesLeague++;
          ps.concededLeague += match.opponentScore;
          if (isCleanSheet) ps.cleanSheetsLeague++;
        }
      }

      if (entry.isGoalkeeper) {
        ps.keeperMatches++;
        ps.concededKeeper += match.opponentScore;
        if (isCleanSheet) ps.cleanSheetsKeeper++;
        if (isLeague) {
          ps.keeperMatchesLeague++;
          ps.concededKeeperLeague += match.opponentScore;
          if (isCleanSheet) ps.cleanSheetsKeeperLeague++;
        }
      }
    }
  }

  const playerStats = Array.from(statsMap.values());

  return {
    teamStats,
    teamStatsLeague,
    playerStats,
    ringerGoals,
    ringerAssists,
    ownGoals,
    ringerGoalsLeague,
    ringerAssistsLeague,
    ownGoalsLeague,
  };
}
