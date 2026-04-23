import fetch from 'node-fetch';

async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      body: "this is invalid json but it is sent as json",
      headers: { 'Content-Type': 'application/json' }
    });
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response text:", text);
  } catch (e: any) {
    console.error("Fetch failed!", e.message);
  }
}

test();
