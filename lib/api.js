// lib/aiParser.js

export async function fetchAIResults(message) {
  try {
    const res = await fetch('http://localhost:3001/api/parser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) throw new Error('Failed to fetch from backend');

    const data = await res.json();
    return {
      filters: data.filters || {},
      listings: data.listings || [],
    };
  } catch (error) {
    console.error('❌ AI fetch error:', error);
    return { filters: {}, listings: [], error: true };
  }
}
