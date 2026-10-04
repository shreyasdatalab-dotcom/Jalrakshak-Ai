import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Helper for deterministic rule-based analysis fallback
function generateDeterministicAnalysis(description: string, category: string, location: string) {
  const text = (description + ' ' + category).toLowerCase();
  
  let detectedCategory = category || 'Pipe leakage';
  let priority: 'Critical' | 'High' | 'Medium' | 'Low' = 'Medium';
  let priorityReason = 'Standard municipal maintenance priority based on reported severity.';
  let department = 'Distribution & Pipeline Maintenance';
  let households = '15–30 households';
  let precautionaryNotice: string | null = null;
  let duplicateLikelihood = 18;

  const hasHealthOrContamination =
    text.includes('contaminat') ||
    text.includes('smell') ||
    text.includes('color') ||
    text.includes('black') ||
    text.includes('brown') ||
    text.includes('poison') ||
    text.includes('dirty') ||
    text.includes('muddy') ||
    text.includes('turbid') ||
    /\b(ill|illness|sick|vomit|nausea)\b/i.test(text);

  if (hasHealthOrContamination) {
    detectedCategory = 'Water contamination concern';
    priority = 'Critical';
    priorityReason = 'Potential public health biohazard detected in distribution stream requiring urgent chlorination and turbidity testing.';
    department = 'Water Quality & Chemical Laboratory Division';
    households = '80–150 households in ward supply zone';
    precautionaryNotice = 'Precautionary Health Advisory: Municipal standards require advising residents not to consume or cook with tap water until secondary lab culture testing is confirmed.';
    duplicateLikelihood = 42;
  } else if (text.includes('burst') || text.includes('gushing') || text.includes('flood') || text.includes('main pipeline') || text.includes('massive leak')) {
    detectedCategory = 'Pipe leakage';
    priority = 'Critical';
    priorityReason = 'High-pressure trunk line integrity failure causing severe non-revenue water loss and roadway hazard.';
    department = 'Emergency Rapid Response Team';
    households = '120+ households';
    duplicateLikelihood = 68;
  } else if (text.includes('no water') || text.includes('interruption') || text.includes('supply cut') || text.includes('3 days') || text.includes('2 days') || text.includes('dry tap')) {
    detectedCategory = 'Water supply interruption';
    priority = 'High';
    priorityReason = 'Extended localized outage exceeding 24 hours in residential feeder zone.';
    department = 'Zonal Water Supply Operations';
    households = '40–70 households';
    duplicateLikelihood = 55;
  } else if (text.includes('overflow') || text.includes('tanker') || text.includes('wastage') || text.includes('reservoir')) {
    detectedCategory = 'Water wastage or overflow';
    priority = 'Medium';
    priorityReason = 'Public water asset overflow causing drainage surcharge and conservation loss.';
    department = 'Reservoir & Pumping Station Wing';
    households = 'Local block';
    duplicateLikelihood = 25;
  } else if (text.includes('low pressure') || text.includes('trickle') || text.includes('weak flow')) {
    detectedCategory = 'Low water pressure';
    priority = 'Low';
    priorityReason = 'Sub-optimal head pressure during morning peak pumping hours.';
    department = 'Metering & Pressure Regulation Unit';
    households = '8–15 households';
    duplicateLikelihood = 12;
  } else if (text.includes('valve') || text.includes('meter') || text.includes('broken cover') || text.includes('hydrant')) {
    detectedCategory = 'Damaged water infrastructure';
    priority = 'High';
    priorityReason = 'Physical municipal infrastructure damage exposing distribution network to ambient ingress.';
    department = 'Civil Infrastructure & Valve Maintenance';
    households = '25 households';
    duplicateLikelihood = 20;
  }

  const summary = `Reported ${detectedCategory.toLowerCase()} at ${location || 'designated municipal zone'}. Initial assessment identifies ${priority.toLowerCase()} priority dispatch.`;
  const suggestedAction = `Dispatch Ward Sector Inspection Unit with portable diagnostic sensors and valve control telemetry.`;

  return {
    category: detectedCategory,
    summary,
    priority,
    priorityReason,
    recommendedDepartment: department,
    suggestedAction,
    estimatedHouseholdsImpacted: households,
    precautionaryNotice,
    duplicateLikelihood,
    aiModel: 'Jalrakshak-RuleIntelligence-v2 (Deterministic Fallback)',
    n8nPayload: {
      event: 'complaint.triaged',
      source: 'jalrakshak.ai.edge',
      timestamp: new Date().toISOString(),
      priority,
      department,
      autoRouted: true,
      slaHours: priority === 'Critical' ? 4 : priority === 'High' ? 12 : priority === 'Medium' ? 24 : 48
    }
  };
}

// API endpoint for complaint analysis - strictly using realistic dummy data
app.post('/api/ai/analyze-complaint', async (req, res) => {
  const { description = '', category = '', location = '' } = req.body;

  if (!description && !category) {
    return res.status(400).json({ error: 'Description or category is required' });
  }

  // Strictly use deterministic dummy civic intelligence
  const dummyAnalysis = generateDeterministicAnalysis(description, category, location);
  return res.json(dummyAnalysis);
});

// Proxy endpoint for n8n webhook to ensure zero CORS obstacles
app.post('/api/n8n-webhook', async (req, res) => {
  const webhookUrl = 'https://vinnie1919.app.n8n.cloud/webhook-test/jalrakshak-complaint';
  try {
    const n8nResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });
    const text = await n8nResponse.text();
    return res.status(n8nResponse.status).send(text);
  } catch (err: any) {
    console.error('[n8n Webhook Proxy Error]:', err.message);
    return res.status(502).json({ error: 'Failed to reach n8n webhook', message: err.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    app: 'Jalrakshak AI',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY
  });
});

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Jalrakshak AI] Server running at http://0.0.0.0:${PORT} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
