export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;

  if (!password || password !== process.env.APP_PASSWORD) {
    // Same generic error whether password is wrong or missing
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }

  res.status(200).json({ ok: true });
}
