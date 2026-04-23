import fetch from 'node-fetch';

async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gemini-3.1-pro-preview',
        contents: "Write 3 distinct variations of a YouTube post for this content.",
        config: {
          responseMimeType: 'application/json',
          tools: [{ googleSearch: {} }]
        }
      })
    });
    console.log("Status:", res.status);
    const json = await res.json();
    console.log("Json:", JSON.stringify(json).substring(0, 500));
  } catch (e: any) {
    console.error("Fetch failed!", e.message);
  }
}

test();
