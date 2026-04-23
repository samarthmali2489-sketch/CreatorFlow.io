import fetch from 'node-fetch';

async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gemini-3.1-pro-preview',
        contents: "Hello",
      })
    });
    console.log("Status:", res.status);
    const json = await res.json();
    console.log("Json:", JSON.stringify(json).substring(0, 100));
  } catch (e: any) {
    console.error("Fetch failed!", e.message);
  }
}

test();
