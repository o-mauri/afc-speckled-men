import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { verifyAdmin } from '../middleware/auth';
import { putPlayer, getAllPlayers, getPlayer, deletePlayer } from '../services/dynamo';
import { uploadPlayerImage, deletePlayerImage } from '../services/s3';
import { Player } from '../types';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const players = await getAllPlayers();
    const imageBaseUrl = process.env.IMAGE_BASE_URL || '';
    const result = players.map((p) => ({
      ...p,
      imageUrl: p.imageKey ? `${imageBaseUrl}/${p.imageKey}` : null,
    }));
    res.json(result);
  } catch (err) {
    console.error('Error fetching players:', err);
    res.status(500).json({ error: 'Failed to fetch players' });
  }
});

router.post('/', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const { name, image } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }
    const id = uuidv4();
    let imageKey: string | undefined;

    if (image) {
      const buffer = Buffer.from(image, 'base64');
      imageKey = await uploadPlayerImage(id, buffer, 'image/jpeg');
    }

    const player: Player = {
      id,
      name,
      imageKey,
      createdAt: new Date().toISOString(),
    };
    await putPlayer(player);
    const imageBaseUrl = process.env.IMAGE_BASE_URL || '';
    res.status(201).json({
      ...player,
      imageUrl: imageKey ? `${imageBaseUrl}/${imageKey}` : null,
    });
  } catch (err) {
    console.error('Error creating player:', err);
    res.status(500).json({ error: 'Failed to create player' });
  }
});

router.put('/:id', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const existing = await getPlayer(req.params.id);
    if (!existing) {
      res.status(404).json({ error: 'Player not found' });
      return;
    }
    const { name, image } = req.body;
    let imageKey = existing.imageKey;

    if (image) {
      const buffer = Buffer.from(image, 'base64');
      imageKey = await uploadPlayerImage(req.params.id, buffer, 'image/jpeg');
    }

    const updated: Player = {
      ...existing,
      name: name || existing.name,
      imageKey,
    };
    await putPlayer(updated);
    const imageBaseUrl = process.env.IMAGE_BASE_URL || '';
    res.json({
      ...updated,
      imageUrl: imageKey ? `${imageBaseUrl}/${imageKey}` : null,
    });
  } catch (err) {
    console.error('Error updating player:', err);
    res.status(500).json({ error: 'Failed to update player' });
  }
});

router.delete('/:id', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const existing = await getPlayer(req.params.id);
    if (!existing) {
      res.status(404).json({ error: 'Player not found' });
      return;
    }
    if (existing.imageKey) {
      await deletePlayerImage(existing.imageKey);
    }
    await deletePlayer(req.params.id);
    res.json({ message: 'Player deleted' });
  } catch (err) {
    console.error('Error deleting player:', err);
    res.status(500).json({ error: 'Failed to delete player' });
  }
});

export default router;
