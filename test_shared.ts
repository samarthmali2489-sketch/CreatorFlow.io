import fetch from 'node-fetch';

async function test() {
  try {
    const res = await fetch('https://ais-dev-qs2b2x5xe5fd76e7ldnfev-397168076521.asia-east1.run.app/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gemini-3.1-pro-preview',
        contents: "Hello",
      })
    });
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response text:", text);
  } catch (e: any) {
    console.error("Fetch failed!", e.message);
  }
}

test();
