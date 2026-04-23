import fetch from 'node-fetch';

async function test() {
  try {
    const hugeBody = JSON.stringify({
      model: 'gemini-3.1-pro-preview',
      contents: "A".repeat(2 * 1024 * 1024) // 2MB string
    });
    const res = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: hugeBody
    });
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response text:", text.substring(0, 500));
  } catch (e: any) {
    console.error("Fetch failed!", e.message);
  }
}

test();
