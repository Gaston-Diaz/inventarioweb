import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

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
      sql`
        INSERT INTO store (key, value, updated_at)
        VALUES ('inv-items', ${JSON.stringify(items)}, NOW())
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
      `,
      sql`
        INSERT INTO store (key, value, updated_at)
        VALUES ('inv-deliveries', ${JSON.stringify(deliveries)}, NOW())
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
      `,
    ]);

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ error: 'Error al guardar datos' });
  }
}
