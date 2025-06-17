import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import path from 'path';
// import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // Disable body parsing, formidable handles it
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const form = formidable({
    uploadDir: path.join(process.cwd(), 'public', 'uploads'),
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB
  });

  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, files] = await form.parse(req);

    if (!files.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;
    const filePath = `/uploads/${path.basename(uploadedFile.filepath)}`;

    res.status(200).json({ message: 'File uploaded successfully', url: filePath });
  } catch (error) {
    console.error('File upload error:', error);
    if (error instanceof Error && (error as any).code === formidable.errors.biggerThanMaxFileSize) {
      return res.status(413).json({ message: 'File size too large (max 5MB).' });
    }
    res.status(500).json({ message: 'Something went wrong', error: error instanceof Error ? error.message : String(error) });
  }
} 