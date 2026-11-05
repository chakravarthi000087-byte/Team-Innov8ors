import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '20mb' }));

// Shared Gemini client
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// ActaCite Extraction Schema definition
const ActaCiteResponseSchema = {
  type: Type.OBJECT,
  properties: {
    notice_title: {
      type: Type.STRING,
      description: 'Title or subject of the notice',
    },
    extracted_tasks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          task_description: {
            type: Type.STRING,
            description: 'Clear, concise action the student needs to take',
          },
          deadline: {
            type: Type.STRING,
            description: 'Exact date/time, or null if not stated',
          },
          eligibility: {
            type: Type.STRING,
            description: "Who needs to complete this task (e.g., 'All 3rd-year students')",
          },
          required_documents: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
            description: 'List of documents or empty array',
          },
          evidence: {
            type: Type.OBJECT,
            properties: {
              exact_quote: {
                type: Type.STRING,
                description: 'Copy-paste the exact sentence(s) from the source text justifying this task. Do not paraphrase.',
              },
              page_reference: {
                type: Type.STRING,
                description: 'Page reference (e.g. "Page 1", "Page 2")',
              },
            },
            required: ['exact_quote', 'page_reference'],
          },
          needs_review: {
            type: Type.BOOLEAN,
            description: 'Flag true if a deadline is missing, a requirement is ambiguous, or instructions conflict. Do not guess.',
          },
          review_reason: {
            type: Type.STRING,
            description: 'Leave null unless needs_review is true. If true, explain the ambiguity or missing detail.',
          },
        },
        required: [
          'task_description',
          'eligibility',
          'required_documents',
          'evidence',
          'needs_review',
        ],
      },
    },
  },
  required: ['notice_title', 'extracted_tasks'],
};

const SYSTEM_INSTRUCTION = `You are the core extraction engine for "ActaCite," an AI-Powered Academic Notice Intelligence system. Your objective is to convert academic and college notices into evidence-linked task checklists. Students rely on you to not miss critical details.

Analyze the provided OCR or text extracted from an academic notice and output a structured JSON response containing actionable items.

CRITICAL RULES:
1. Extract Key Fields: For every actionable item, identify the specific task, deadlines, required documents, and eligibility conditions.
2. Keep Evidence Attached (Traceability): Every extracted task MUST include an "evidence" object containing the EXACT quote from the source text and the page number where it was found (e.g., "Page 1", "Page 2" based on page indicators in the text like "--- Page X ---" or "Page X of Y", or "Page 1" if single page). Do NOT paraphrase the quote. Copy the exact characters from the text.
3. Handle Uncertainty Safely (Ambiguity Guard): If a deadline is missing, a requirement is ambiguous, or instructions conflict, DO NOT GUESS. Flag the item as "needs_review: true" and state the conflict or missing information in "review_reason". If there is no ambiguity, set "needs_review: false" and "review_reason: null".
4. Accuracy is paramount: Only extract actionable tasks for students. If an action is required by college administration only (and not by students), do not attribute it to students unless students must trigger or follow up on it.`;

app.post('/api/extract', async (req, res) => {
  try {
    const { text, imageBase64, mimeType } = req.body;

    if (!text && !imageBase64) {
      return res.status(400).json({ error: 'Please provide notice text or image data.' });
    }

    if (!ai) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please check your AI Studio Secrets panel.',
      });
    }

    let contents: any;

    if (imageBase64 && mimeType) {
      const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');
      contents = {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          {
            text: text
              ? `Academic Notice text / context:\n${text}\n\nPlease perform OCR and extract all actionable student tasks according to ActaCite rules.`
              : 'Please perform OCR on this academic notice image and extract all actionable student tasks according to ActaCite rules.',
          },
        ],
      };
    } else {
      contents = `Here is the academic notice source text to analyze:\n\n${text}`;
    }

    // Call Gemini API with automatic retry on transient spikes
    let response: any;
    let attempts = 0;
    const maxAttempts = 3;
    while (attempts < maxAttempts) {
      try {
        attempts++;
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
            responseSchema: ActaCiteResponseSchema,
          },
        });
        break; // Success
      } catch (err: any) {
        if (attempts >= maxAttempts) throw err;
        console.warn(`Gemini API attempt ${attempts} failed (${err.message}). Retrying in ${attempts * 1000}ms...`);
        await new Promise((r) => setTimeout(r, attempts * 1000));
      }
    }

    const outputText = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(outputText);
    } catch (parseErr) {
      console.error('Failed to parse Gemini JSON output:', outputText);
      return res.status(502).json({
        error: 'Failed to parse extracted JSON output from model.',
        raw: outputText,
      });
    }

    return res.json(parsedData);
  } catch (error: any) {
    console.error('Extraction error:', error);
    return res.status(500).json({
      error: error.message || 'An error occurred during notice extraction.',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    service: 'ActaCite Core Intelligence Engine',
  });
});

async function startServer() {
  // Mount Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`ActaCite server running on port ${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
