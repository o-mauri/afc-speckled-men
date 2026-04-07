import { Router, Request, Response } from 'express';
import { generateToken } from '../middleware/auth';

const router = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

router.post('/login', (req: Request, res: Response) => {
  const { password } = req.body;
  if (!password || password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Invalid password' });
    return;
  }
  const token = generateToken();
  res.json({ token });
});

export default router;
