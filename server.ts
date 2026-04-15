import express from "express";
import { createServer as createViteServer } from "vite";
import * as cheerio from "cheerio";
import path from "path";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { YoutubeTranscript } = require('youtube-transcript/dist/youtube-transcript.common.js');

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route to scrape URL
  app.post("/api/scrape", async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }

      const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
      let transcriptText = '';
      let title = '';
      let description = '';
      let text = '';

      if (isYouTube) {
        try {
          const transcript = await YoutubeTranscript.fetchTranscript(url);
          transcriptText = transcript.map((t: any) => t.text).join(' ');
        } catch (e: any) {
          console.warn("Could not fetch YouTube transcript:", e.message);
          transcriptText = "[Transcript unavailable: YouTube rate limit exceeded or captions disabled. Please paste the transcript manually if needed.]";
        }

        try {
          // Use oEmbed for YouTube metadata to avoid scraping blocks
          const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
          const oembedRes = await fetch(oembedUrl);
          if (oembedRes.ok) {
            const oembedData = await oembedRes.json();
            title = oembedData.title || '';
            description = `Author: ${oembedData.author_name || ''}`;
          }
        } catch (e) {
          console.warn("Could not fetch YouTube oEmbed data:", e);
        }
      } else {
        try {
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
          });
          if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
          }
          
          const html = await response.text();
          const $ = cheerio.load(html);
          
          title = $('title').text() || '';
          description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';
          
          // Remove scripts, styles, and nav elements to get clean text
          $('script, style, nav, footer, header, noscript, iframe').remove();
          
          text = $('body').text().replace(/\s+/g, ' ').trim();
        } catch (e: any) {
          console.warn("Could not fetch webpage:", e.message);
          text = `[Failed to scrape webpage: ${e.message}]`;
        }
      }
      
      // Combine metadata with body text or transcript to ensure we get context
      let combinedText = `Title: ${title}\nDescription: ${description}\n`;
      
      if (isYouTube) {
        combinedText += `\nVideo Transcript (Spoken Content):\n${transcriptText}\n`;
      } else {
        combinedText += `\nContent:\n${text}`;
      }
      
      res.json({ text: combinedText.substring(0, 15000) }); // limit text length
    } catch (error: any) {
      console.error("Scraping error:", error);
      res.status(500).json({ error: error.message || "Failed to scrape URL" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
