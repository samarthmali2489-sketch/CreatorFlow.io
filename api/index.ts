import express from "express";
import * as cheerio from "cheerio";
import crypto from 'crypto';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { YoutubeTranscript } from 'youtube-transcript/dist/youtube-transcript.esm.js';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create a Supabase admin client for backend updates
const supabaseAdmin = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

// Use raw JSON for LemonSqueezy webhook signature verification, normal JSON for everything else
app.use((req, res, next) => {
  // Increase payload size limit to 50mb to allow base64 image data for image generation 
  if (req.originalUrl === '/api/webhooks/lemonsqueezy' || req.originalUrl === '/api/webhooks/dodopayments') {
    express.raw({ type: 'application/json' })(req, res, next);
  } else {
    express.json({ limit: '50mb' })(req, res, next);
  }
});

// Secure Gemini API Proxy
app.post("/api/generate", async (req, res) => {
  try {
    // Prioritize the TONY_THE_KEY or standard GEMINI_API_KEY from the server's securely stored environment variables
    const apiKey = process.env.TONY_THE_KEY || process.env.VITE_TONY_THE_KEY || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Server AI Key not configured. Deployer must securely set TONY_THE_KEY or GEMINI_API_KEY in Vercel environment variables." });
    }

    const ai = new GoogleGenAI({ apiKey });
    const { model, contents, config } = req.body;

    const response = await ai.models.generateContent({
      model: model || 'gemini-3.1-pro-preview',
      contents,
      config
    });

    // Send the entire response object back down to the frontend wrapper
    res.json(response);
  } catch (error: any) {
    console.error("Gemini API proxy error:", error.message || error);
    
    // Attempt to extract the exact GoogleGenAI error string if possible
    let errorResponseStr = "Failed to generate content";
    if (error && typeof error.message === 'string') {
        errorResponseStr = error.message;
    }
    
    res.status(500).json({ error: errorResponseStr });
  }
});

import DodoPayments from 'dodopayments';
const dodopayments = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY || ''
});

// DodoPayments Webhook Endpoint
app.post('/api/webhooks/dodopayments', async (req, res) => {
  try {
    const signature = req.headers['dodopayments-signature'] as string;
    const webhookSecret = process.env.DODO_PAYMENTS_WEBHOOK_SECRET || '';

    // Verify signature using the DodoPayments SDK (if secret is provided)
    if (webhookSecret && signature) {
      try {
        (dodopayments.webhooks as any).verifySignature(req.body.toString('utf8'), req.headers, webhookSecret);
      } catch (err: any) {
         return res.status(403).json({ error: 'Invalid webhooks signature' });
      }
    }

    const payload = JSON.parse(req.body.toString());
    
    // DodoPayments events
    // ex: subscription.active, subscription.canceled
    const eventType = payload.webhook_event; // DodoPayments usually puts event type in top level or `type`
    
    console.log(`Received DodoPayments integration event: ${eventType || 'Unknown Event'}`);

    if (eventType === 'subscription.active' || eventType === 'subscription.renewed' || eventType === 'subscription.succeeded') {
      const planId = payload.data?.product_id;
      const userId = payload.data?.metadata?.user_id;

      let plan = 'pro';
      let credits = 250;
      if (planId === process.env.VITE_DODO_PAYMENTS_INFINITY_PRODUCT_ID) {
        plan = 'infinity';
        credits = 750;
      }

      console.log(`User ${userId} subscribed to product ${planId}`);
      
      // Update backend using service role so changes persist across devices
      if (supabaseAdmin && userId && userId !== 'anonymous') {
         await supabaseAdmin.auth.admin.updateUserById(userId, {
            user_metadata: { plan, credits }
         });
         console.log(`Successfully updated ${userId} to ${plan} with ${credits} credits.`);
      } else {
         console.warn("Could not update user metadata. Missing SUPABASE_SERVICE_ROLE_KEY or valid user_id.");
      }
    } else if (eventType === 'subscription.canceled' || eventType === 'subscription.past_due' || eventType === 'subscription.failed') {
      const userId = payload.data?.metadata?.user_id;
      console.log(`User ${userId} subscription canceled/past_due`);
      
      if (supabaseAdmin && userId && userId !== 'anonymous') {
         // Revert to free plan values
         await supabaseAdmin.auth.admin.updateUserById(userId, {
            user_metadata: { plan: 'free', credits: 80 }
         });
      }
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

// DodoPayments Create Payment Link
app.post("/api/payments/create-payment-link", async (req, res) => {
  try {
     const { planId, userId, email, returnUrl } = req.body;
     let productId = process.env.VITE_DODO_PAYMENTS_PRO_PRODUCT_ID;
     
     if (planId === 'infinity') {
       productId = process.env.VITE_DODO_PAYMENTS_INFINITY_PRODUCT_ID;
     }

     if (!productId) {
         return res.status(400).json({ error: "Product ID is missing in environment variables" });
     }

     const session = await dodopayments.checkoutSessions.create({
        customer: {
          email: email || 'anonymous@example.com',
          name: 'Customer'
        },
        product_cart: [
          {
            product_id: productId,
            quantity: 1
          }
        ],
        metadata: {
          user_id: userId || 'anonymous'
        },
        return_url: returnUrl || 'https://sandbox.klipora.com/upgrade'
     });

     res.json({ checkoutUrl: session.checkout_url });
  } catch (error: any) {
     console.error("Payment session error:", error);
     res.status(500).json({ error: error.message });
  }
});

export default app;
