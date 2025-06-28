// Simple test to check if TMDB API is working
const axios = require('axios');

const TMDB_API_KEY = '08159ef15062dca4322114cf57150163';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function testAPI() {
  try {
    console.log('Testing TMDB API...');
    const response = await axios.get(`${TMDB_BASE_URL}/movie/550`, {
      params: {
        api_key: TMDB_API_KEY
      }
    });
    console.log('API Response:', response.data.title);
    console.log('API working correctly!');
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
  }
}

testAPI();
