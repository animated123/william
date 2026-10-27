import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer, ViteDevServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const baseDir = process.cwd();

async function createServer() {
  const app = express();
  const port = process.env.PORT || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  let vite: ViteDevServer | undefined;
  if (!isProd) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
  } else {
    app.use((await import('compression')).default());
    app.use(
      (await import('serve-static')).default(path.resolve(baseDir, 'dist'), {
        index: false,
      })
    );
  }

  // Static Assets (Favicon, images, public directory)
  app.use('/images', express.static(path.resolve(baseDir, 'public/images')));
  app.use('/images', express.static(path.resolve(baseDir, 'images')));
  app.use(express.static(path.resolve(baseDir, 'public')));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', firm: 'William & Co. Advocates' });
  });

  app.post('/api/contact', express.json(), (req, res) => {
    const { name, email, subject, message } = req.body;
    console.log(`[EMAIL SIMULATION] To: info@williamadvocates.co.ke`);
    console.log(`Subject: New Contact Inquiry - ${subject}`);
    console.log(`From: ${name} <${email}>`);
    console.log(`Message: ${message}`);
    res.status(200).json({ success: true, message: 'Inquiry received and email queued.' });
  });

  app.post('/api/appointment', express.json(), (req, res) => {
    const { clientName, clientEmail, clientPhone, date, time, message } = req.body;
    console.log(`[EMAIL SIMULATION] To: info@williamadvocates.co.ke`);
    console.log(`Subject: New Appointment Request - ${clientName}`);
    console.log(`Details: ${date} at ${time}`);
    console.log(`Contact: ${clientEmail} | ${clientPhone}`);
    console.log(`Message: ${message}`);
    res.status(200).json({ success: true, message: 'Appointment request received and email queued.' });
  });

  // Serve index.html for all non-API routes
  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    try {
      let template;
      const fs = await import('fs');
      if (!isProd && vite) {
        // Read the index.html file
        const indexHtml = fs.readFileSync(path.resolve(baseDir, 'index.html'), 'utf-8');
        // Transform the index.html file with Vite's HMR and other features
        template = await vite.transformIndexHtml(url, indexHtml);
      } else {
        template = fs.readFileSync(path.resolve(baseDir, 'dist/index.html'), 'utf-8');
      }
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      console.error("Error serving index.html:", e);
      !isProd && vite?.ssrFixStacktrace(e as Error);
      next(e);
    }
  });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

createServer();
