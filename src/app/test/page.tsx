"use client";

import { useState, useEffect } from "react";

export default function TestPage() {
  const [apiTest, setApiTest] = useState<string>("Testing...");
  const [envTest, setEnvTest] = useState<string>("Loading...");

  useEffect(() => {
    // Test environment variables
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
    
    if (!apiKey) {
      setEnvTest("❌ TMDB API Key is missing");
    } else if (!baseUrl) {
      setEnvTest("❌ TMDB Base URL is missing");
    } else {
      setEnvTest(`✅ Environment variables loaded - API Key: ${apiKey.substring(0, 8)}...`);
    }

    // Test API call
    const testAPI = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=1`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          setApiTest(`✅ API working - Found ${data.results.length} movies`);
        } else {
          setApiTest("⚠️ API responded but no data found");
        }
      } catch (error) {
        setApiTest(`❌ API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    if (apiKey) {
      testAPI();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">ZeniX Debug Page</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
          <p>{envTest}</p>
        </div>
        
        <div className="p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">TMDB API Test</h2>
          <p>{apiTest}</p>
        </div>
        
        <div className="p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Browser Console</h2>
          <p>Check the browser console (F12) for any additional errors</p>
        </div>
      </div>
    </div>
  );
}
