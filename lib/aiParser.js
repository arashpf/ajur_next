
import axios from 'axios';

export async function fetchAIResults(prompt) {
  const response = await axios.post('http://localhost:3001/api/parser', { prompt });
  return response.data; // this should return a JSON object like { city, neighbor, ... }
}
