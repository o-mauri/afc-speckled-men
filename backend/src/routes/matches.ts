import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { verifyAdmin } from '../middleware/auth';
import { putMatch, getMatchesBySeason, getAllMatches, deleteMatch, getSeason } from '../services/dynamo';
import { Match } from '../types';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const seasonId = req.query.seasonId as string | undefined;
    let matches: Match[];
    if (seasonId) {
      matches = await getMatchesBySeason(seasonId);
    } else {
      matches = await getAllMatches();
    }
    matches.sort((a, b) => b.date.localeCompare(a.date));
    res.json(matches);
  } catch (err) {
    console.error('Error fetching matches:', err);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

router.post('/', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const { seasonId, date, matchType, isForfeit, opponent, teamScore, opponentScore, players, ringerGoals, ringerAssists, ownGoals } = req.body;
    if (!seasonId || !date || !opponent || teamScore === undefined || opponentScore === undefined) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    const season = await getSeason(seasonId);
    if (!season) {
      res.status(400).json({ error: 'Season not found' });
      return;
    }
    const match: Match = {
      id: uuidv4(),
      seasonId,
      date,
      matchType: matchType || 'League',
      isForfeit: isForfeit || false,
      opponent,
      teamScore,
      opponentScore,
      players: players || [],
      ringerGoals: ringerGoals || 0,
      ringerAssists: ringerAssists || 0,
      ownGoals: ownGoals || 0,
      createdAt: new Date().toISOString(),
    };
    await putMatch(match);
    res.status(201).json(match);
  } catch (err) {
    console.error('Error creating match:', err);
    res.status(500).json({ error: 'Failed to create match' });
  }
});

router.put('/:id', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const { seasonId, date, originalSeasonId, originalDate } = req.body;
    const lookupSeasonId = originalSeasonId || seasonId;
    const lookupDate = originalDate || date;
    if (!lookupSeasonId || !lookupDate) {
      res.status(400).json({ error: 'seasonId and date are required' });
      return;
    }

    // Delete old entry if season or date changed
    if (originalSeasonId || originalDate) {
      await deleteMatch(lookupSeasonId, req.params.id, lookupDate);
    } else {
      await deleteMatch(seasonId, req.params.id, date);
    }

    const match: Match = {
      id: req.params.id,
      seasonId,
      date,
      matchType: req.body.matchType || 'League',
      isForfeit: req.body.isForfeit || false,
      opponent: req.body.opponent,
      teamScore: req.body.teamScore,
      opponentScore: req.body.opponentScore,
      players: req.body.players || [],
      ringerGoals: req.body.ringerGoals || 0,
      ringerAssists: req.body.ringerAssists || 0,
      ownGoals: req.body.ownGoals || 0,
      createdAt: req.body.createdAt || new Date().toISOString(),
    };
    await putMatch(match);
    res.json(match);
  } catch (err) {
    console.error('Error updating match:', err);
    res.status(500).json({ error: 'Failed to update match' });
  }
});

router.delete('/:id', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const { seasonId, date } = req.query as { seasonId: string; date: string };
    if (!seasonId || !date) {
      res.status(400).json({ error: 'seasonId and date query params required' });
      return;
    }
    await deleteMatch(seasonId, req.params.id, date);
    res.json({ message: 'Match deleted' });
  } catch (err) {
    console.error('Error deleting match:', err);
    res.status(500).json({ error: 'Failed to delete match' });
  }
});

export default router;
