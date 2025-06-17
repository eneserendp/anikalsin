import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

  try {
    const files = await fs.promises.readdir(uploadsDir);
    const memories = files.map(file => {
      const filePath = `/uploads/${file}`;
      const fileExtension = path.extname(file).toLowerCase();
      let type: "photo" | "audio";

      if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(fileExtension)) {
        type = 'photo';
      } else if (['.mp3', '.wav', '.webm'].includes(fileExtension)) {
        type = 'audio';
      } else {
        return null; // Desteklenmeyen dosya tipi
      }
      return { type, url: filePath };
    }).filter(Boolean);

    res.status(200).json({ memories });
  } catch (error: any) {
    console.error('Error reading uploads directory:', error);
    res.status(500).json({ message: 'Failed to retrieve memories', error: error.message });
  }
} 