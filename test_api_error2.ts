import fetch from 'node-fetch';

async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'invalid-model',
        contents: "Hello"
      })
    });
    console.log("Status:", res.status);
    const json = await res.json();
    console.log("Json:", JSON.stringify(json));
  } catch (e: any) {
    console.error("Fetch failed!", e.message);
  }
}

test();
