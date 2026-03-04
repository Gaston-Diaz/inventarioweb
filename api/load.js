import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rows = await sql`
      SELECT key, value FROM store
      WHERE key IN ('inv-items', 'inv-deliveries')
    `;

    const get = (key) => rows.find(r => r.key === key)?.value ?? [];

    res.status(200).json({
      items:      get('inv-items'),
      deliveries: get('inv-deliveries'),
    });
  } catch (err) {
    console.error('Load error:', err);
    res.status(500).json({ error: 'Error al cargar datos' });
  }
}
