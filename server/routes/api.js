import express from 'express';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import Node from '../models/Node.js';
import crypto from 'crypto';
import mongoose from 'mongoose';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// AWS S3 Configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  }
});

// GET /api/intelligence/db - Fetch all intelligence nodes from MongoDB
router.get('/db', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected. Provide credentials in .env' });
    }
    const nodes = await Node.find().sort({ timestamp: -1 });
    res.json(nodes);
  } catch (error) {
    console.error('Error fetching DB nodes:', error);
    res.status(500).json({ error: 'Failed to fetch intelligence data' });
  }
});

// POST /api/intelligence/upload - Upload file to S3 and save metadata to MongoDB
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const body = req.body; 
    let imageUrl = '';

    if (file) {
      const extension = file.originalname.split('.').pop();
      const filename = `${crypto.randomUUID()}.${extension}`;
      
      if (process.env.AWS_S3_BUCKET_NAME && process.env.AWS_S3_BUCKET_NAME !== 'your_bucket_name') {
        const command = new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: `uploads/${filename}`,
          Body: file.buffer,
          ContentType: file.mimetype,
        });
        
        await s3Client.send(command);
        imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/uploads/${filename}`;
      } else {
        console.warn('AWS credentials missing. Simulating S3 upload.');
        imageUrl = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop';
      }
    }

    const newNodeData = {
      id: crypto.randomUUID(),
      type: file && file.mimetype.includes('image') ? 'IMINT' : (body.type || 'HUMINT'),
      title: body.title || (file ? `Uploaded: ${file.originalname}` : 'Manual Entry'),
      description: body.description || 'Uploaded via Fusion Engine backend',
      latitude: parseFloat(body.latitude) || 34.0522,
      longitude: parseFloat(body.longitude) || -118.2437,
      source: body.source || 'Direct API Upload',
      tags: body.tags ? body.tags.split(',') : ['manual'],
      imageUrl: imageUrl || undefined
    };

    if (mongoose.connection.readyState === 1) {
      const newNode = new Node(newNodeData);
      await newNode.save();
      res.status(201).json(newNode);
    } else {
      console.warn('MongoDB not connected. Returning simulated saved node.');
      res.status(201).json(newNodeData);
    }
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Failed to upload and save intelligence' });
  }
});

export default router;
