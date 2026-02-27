import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, deliveries } = req.body;

    if (!Array.isArray(items) || !Array.isArray(deliveries)) {
      return res.status(400).json({ error: 'Formato inválido' });
    }

    // Save both keys in parallel
    await Promise.all([
      kv.set('inv-items',      items),
      kv.set('inv-deliveries', deliveries),
    ]);

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ error: 'Error al guardar datos' });
  }
}
