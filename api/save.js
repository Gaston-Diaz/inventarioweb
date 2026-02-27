import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, deliveries } = req.body;

    if (!Array.isArray(items) || !Array.isArray(deliveries)) {
      return res.status(400).json({ error: 'Formato inválido' });
    }

    await Promise.all([
      redis.set('inv-items',      items),
      redis.set('inv-deliveries', deliveries),
    ]);

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ error: 'Error al guardar datos' });
  }
}
