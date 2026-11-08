// server.js
import { Nyora } from 'nyora-sdk';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

const client = new Nyora();

// Endpoint untuk mencari komik
app.get('/api/search', async (req, res) => {
  try {
    const { q, sourceName } = req.query;
    // Cari sumber (misal: 'komiku' atau 'mangadex')
    const source = await client.sources.find(sourceName || 'komiku');
    
    // Cari komik di sumber tersebut
    const results = await client.manga.search(source.id, q);
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint untuk mengambil detail & chapter
app.get('/api/details', async (req, res) => {
  try {
    const { sourceName, mangaUrl, title } = req.query;
    const source = await client.sources.find(sourceName);
    const details = await client.manga.details(source.id, mangaUrl, { title });
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint untuk mengambil gambar chapter
app.get('/api/pages', async (req, res) => {
  try {
    const { sourceName, chapterUrl } = req.query;
    const source = await client.sources.find(sourceName);
    const pages = await client.manga.pages(source.id, chapterUrl);
    res.json(pages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve file statis dari root folder
app.use(express.static(__dirname));

app.listen(3000, () => console.log('Server berjalan di port 3000'));
