// pages/api/ai.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log("🔍 AI parse received input:", req.body);

  const userQuery = req.body?.query;
  if (!userQuery) {
    return res.status(400).json({ error: 'Missing query in body' });
  }

  try {
    const response = await fetch('http://localhost:3001/api/parser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: userQuery }),
    });

    if (!response.ok) {
      console.error('❌ AI backend error:', response.status, await response.text());
      return res.status(502).json({ error: 'Failed to fetch from AI parser' });
    }

    const filters = await response.json();
    console.log("✅ Filters received:", filters);

    return res.status(200).json(filters);
  } catch (err) {
    console.error('❌ AI parsing failed:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
