// pages/api/listings.js
export default async function handler(req, res) {
  const query = new URLSearchParams(req.query).toString();
  try {
    const listingsRes = await fetch(`http://localhost:3001/listings?${query}`);
    const listings = await listingsRes.json();
    res.status(200).json(listings);
  } catch (err) {
    console.error('Failed to fetch listings:', err);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
}
