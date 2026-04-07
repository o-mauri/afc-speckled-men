import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { verifyAdmin } from '../middleware/auth';
import {
  putSeason,
  getAllSeasons,
  getSeason,
  deleteSeason,
  deactivateAllSeasons,
  getMatchesBySeason,
  deleteMatch,
} from '../services/dynamo';
import { Season } from '../types';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const seasons = await getAllSeasons();
    seasons.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    res.json(seasons);
  } catch (err) {
    console.error('Error fetching seasons:', err);
    res.status(500).json({ error: 'Failed to fetch seasons' });
  }
});

router.post('/', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const { name, division, isActive, previousSeasonFinalPosition, previousSeasonPoints } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }
    if (isActive) {
      // Close out the current active season with final position/points
      const allSeasons = await getAllSeasons();
      const currentActive = allSeasons.find((s) => s.isActive);
      if (currentActive && (previousSeasonFinalPosition || previousSeasonPoints !== undefined)) {
        const closedSeason: Season = {
          ...currentActive,
          isActive: false,
          finalPosition: previousSeasonFinalPosition || currentActive.finalPosition,
          points: previousSeasonPoints !== undefined ? previousSeasonPoints : currentActive.points,
        };
        await putSeason(closedSeason);
      } else {
        await deactivateAllSeasons();
      }
    }
    const season: Season = {
      id: uuidv4(),
      name,
      division: division || undefined,
      isActive: isActive || false,
      createdAt: new Date().toISOString(),
    };
    await putSeason(season);
    res.status(201).json(season);
  } catch (err) {
    console.error('Error creating season:', err);
    res.status(500).json({ error: 'Failed to create season' });
  }
});

router.put('/:id', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const existing = await getSeason(req.params.id);
    if (!existing) {
      res.status(404).json({ error: 'Season not found' });
      return;
    }
    const { name, division, isActive, finalPosition, points, previousSeasonFinalPosition, previousSeasonPoints } = req.body;
    if (isActive && !existing.isActive) {
      // Close out the current active season
      const allSeasons = await getAllSeasons();
      const currentActive = allSeasons.find((s) => s.isActive);
      if (currentActive && (previousSeasonFinalPosition || previousSeasonPoints !== undefined)) {
        const closedSeason: Season = {
          ...currentActive,
          isActive: false,
          finalPosition: previousSeasonFinalPosition || currentActive.finalPosition,
          points: previousSeasonPoints !== undefined ? previousSeasonPoints : currentActive.points,
        };
        await putSeason(closedSeason);
      } else {
        await deactivateAllSeasons();
      }
    }
    const updated: Season = {
      ...existing,
      name: name !== undefined ? name : existing.name,
      division: division !== undefined ? division : existing.division,
      isActive: isActive !== undefined ? isActive : existing.isActive,
      finalPosition: finalPosition !== undefined ? finalPosition : existing.finalPosition,
      points: points !== undefined ? points : existing.points,
    };
    await putSeason(updated);
    res.json(updated);
  } catch (err) {
    console.error('Error updating season:', err);
    res.status(500).json({ error: 'Failed to update season' });
  }
});

router.delete('/:id', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const existing = await getSeason(req.params.id);
    if (!existing) {
      res.status(404).json({ error: 'Season not found' });
      return;
    }
    const matches = await getMatchesBySeason(req.params.id);
    for (const match of matches) {
      await deleteMatch(match.seasonId, match.id, match.date);
    }
    await deleteSeason(req.params.id);
    res.json({ message: 'Season and all its matches deleted' });
  } catch (err) {
    console.error('Error deleting season:', err);
    res.status(500).json({ error: 'Failed to delete season' });
  }
});

export default router;
