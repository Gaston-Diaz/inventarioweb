import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const items      = await redis.get('inv-items')      ?? [];
    const deliveries = await redis.get('inv-deliveries') ?? [];
    res.status(200).json({ items, deliveries });
  } catch (err) {
    console.error('Load error:', err);
    res.status(500).json({ error: 'Error al cargar datos' });
  }
}
