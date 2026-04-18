import express from "express";
import { createServer as createViteServer } from "vite";
import * as cheerio from "cheerio";
import path from "path";
import crypto from 'crypto';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { YoutubeTranscript } = require('youtube-transcript/dist/youtube-transcript.common.js');

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use raw JSON for LemonSqueezy webhook signature verification, normal JSON for everything else
  app.use((req, res, next) => {
    if (req.originalUrl === '/api/webhooks/lemonsqueezy') {
      next();
    } else {
      express.json()(req, res, next);
    }
  });

  // Lemon Squeezy Webhook Endpoint
  app.post('/api/webhooks/lemonsqueezy', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
      const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '';
      
      // If a secret is provided, verify the signature
      if (secret) {
        const hmac = crypto.createHmac('sha256', secret);
        const digest = Buffer.from(hmac.update(req.body).digest('hex'), 'utf8');
        const signature = Buffer.from(req.get('X-Signature') || '', 'utf8');

        if (!crypto.timingSafeEqual(digest, signature)) {
          return res.status(403).json({ error: 'Invalid webhooks signature' });
        }
      }

      const payload = JSON.parse(req.body.toString());
      const eventName = payload.meta.event_name;
      const customData = payload.meta.custom_data; // This can include the userId passed from checkout
      
      console.log(`Received Lemon Squeezy integration event: ${eventName}`);

      // Handle the event here (e.g. update user's premium status in Supabase)
      if (eventName === 'subscription_created' || eventName === 'subscription_updated') {
        const planId = payload.data.attributes.product_id;
        console.log(`User subscribed to plan ${planId}`);
        // await supabase.from('users').update({ is_pro: true }).eq('id', customData.user_id)
      } else if (eventName === 'subscription_cancelled' || eventName === 'subscription_expired') {
        console.log(`User subscription cancelled or expired`);
        // await supabase.from('users').update({ is_pro: false }).eq('id', customData.user_id)
      }

      res.status(200).json({ received: true });
    } catch(e: any) {
      console.error('Webhook processing failed', e);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  });

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
