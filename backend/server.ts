import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db';
import routes from './src/routes';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

// Mount API routes
app.use('/api', routes);

// Health check route
app.get('/', (_req: Request, res: Response) => {
  res.send('TravelEase backend up!');
});

// Basic itinerary routes (mock data)
app.get('/api/itineraries', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        title: 'Sample Itinerary',
        items: [
          {
            id: '1',
            title: 'Sigiriya Rock Fortress',
            location: 'Sigiriya, Central Province',
            time: '08:00 AM',
            duration: '3 hours',
            category: 'Attraction',
            price: 'LKR 5,000',
          },
        ],
      },
    ],
  });
});

app.post('/api/itineraries', (req: Request, res: Response) => {
  const { title, items } = req.body;
  res.status(201).json({
    success: true,
    data: {
      id: Date.now().toString(),
      title,
      items: items || [],
    },
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));