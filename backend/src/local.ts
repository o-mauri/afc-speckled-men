import express from 'express';
import path from 'path';
import app from './index';

// Serve locally stored images in dev mode
// Files are saved at .local-images/images/players/<id>.jpg
// Requests come in as /images/players/<id>.jpg
// So mount static at root to match the full path
const LOCAL_IMAGE_DIR = path.join(__dirname, '../.local-images');
app.use(express.static(LOCAL_IMAGE_DIR));

const PORT = process.env.PORT || 8841;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Local mode: ${process.env.LOCAL === 'true' ? 'ON' : 'OFF'}`);
});
