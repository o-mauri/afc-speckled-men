import { Router, Request, Response } from 'express';
import { getAllPlayers, getMatchesBySeason, getAllMatches } from '../services/dynamo';
import { computeStats } from '../services/stats';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const seasonId = req.query.seasonId as string | undefined;
    const players = await getAllPlayers();
    let matches;
    if (seasonId) {
      matches = await getMatchesBySeason(seasonId);
    } else {
      matches = await getAllMatches();
    }
    const stats = computeStats(matches, players);
    res.json(stats);
  } catch (err) {
    console.error('Error computing stats:', err);
    res.status(500).json({ error: 'Failed to compute stats' });
  }
});

export default router;
